from datetime import datetime
import logging
from sqlmodel import Session
from app.models import CheckoutRequest
from fastapi import HTTPException, Request
from app.core.config import settings
import stripe
from app import crud
from app.models import BookingStatus, PaymentStatus

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(*, data: CheckoutRequest, booking_id: int):
    # Parse the scheduled_time string to extract date and time
    try:
        # Assuming scheduled_time is in ISO format like "2025-06-01T14:30:00"
        scheduled_datetime = datetime.fromisoformat(data.scheduled_time.replace('Z', '+00:00'))
        date_str = scheduled_datetime.strftime("%Y-%m-%d")
        time_str = scheduled_datetime.strftime("%H:%M")
    except (ValueError, AttributeError):
        # Fallback if parsing fails
        date_str = data.scheduled_time
        time_str = ""
        
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "eur",
                    "unit_amount": int(data.price * 100),  # Stripe uses cents
                    "product_data": {
                        "name": f"{data.selected_vehicle.capitalize()} Taxi Ride",
                        "description": f"""From: {data.pickup_location}
                                        To: {data.destination}
                                        Number of Passengers: {data.passengers}""",
                    },
                },
                "quantity": 1,
            }
        ],
        customer_email=data.email,
        metadata={
            "booking_id": str(booking_id),
            "name": data.name,
            "phone": data.phone,
            "pickup": data.pickup_location,
            "destination": data.destination,
            "date": date_str,
            "time": time_str,
            "vehicle": data.selected_vehicle,
            "fare": f"{data.price:.2f}",
            "passengers": str(data.passengers)
        },
        success_url=settings.STRIPE_SUCCESS_URL,
        cancel_url=settings.STRIPE_CANCEL_URL,
    )
    return {"url": session.url}


# Main Webhook Handler
async def stripe_webhook(*, db: Session, request: Request) -> dict:
    """
    Main Stripe webhook handler that processes various webhook events.
    
    This function:
    1. Validates the webhook signature
    2. Routes events to appropriate handler functions
    3. Provides centralized error handling and logging
    
    Args:
        db: Database session (injected by FastAPI)
        request: HTTP request object containing webhook payload
        
    Returns:
        Dict indicating processing status
        
    Raises:
        HTTPException: For invalid payloads or signature verification failures
    """
    # Get webhook payload and signature
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    
    # Verify webhook signature
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=endpoint_secret,
        )
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Log incoming webhook event
    event_type = event.get("type", "unknown")
    event_id = event.get("id", "unknown")
    logger.info(f"Processing webhook event: {event_type} (ID: {event_id})")

    try:
        # Route events to appropriate handlers
        if event_type == "checkout.session.completed":
            result = handle_checkout_session_completed(db, event["data"]["object"])
            
        elif event_type == "checkout.session.expired":
            result = handle_checkout_session_expired(db, event["data"]["object"])
            
        elif event_type == "payment_intent.payment_failed":
            result = handle_payment_intent_failed(db, event["data"]["object"])
            
        elif event_type == "invoice.payment_failed":
            result = handle_invoice_payment_failed(db, event["data"]["object"])
            
        else:
            logger.info(f"Unhandled webhook event type: {event_type}")
            result = {"status": "unhandled_event"}
        
        logger.info(f"Webhook event {event_type} processed successfully: {result}")
        return result
    
    except Exception as e:
        # Log error with full context
        logger.error(
            f"Webhook processing failed for event {event_type} (ID: {event_id}): {e}", 
            exc_info=True
        )
        
        # Rollback any database changes
        db.rollback()
        
        # Return processing error (don't raise exception to prevent Stripe retries)
        return {"status": "processing_error", "error": str(e)}

  
def handle_checkout_session_completed(db: Session, stripe_session: dict) -> dict:
    """
    Handle successful checkout session completion.
    
    Args:
        db: Database session
        stripe_session: Stripe session object from webhook
        
    Returns:
        Dict with processing status
    """
    email = stripe_session.get("customer_email")
    metadata = stripe_session.get("metadata", {})
    booking_id = metadata.get("booking_id")
    stripe_session_id = stripe_session.get("id")
    payment_intent_id = stripe_session.get("payment_intent")
    
    # Validate required data
    if not all([metadata, email, booking_id]):
        logger.warning(f"Missing required data - metadata: {bool(metadata)}, email: {bool(email)}, booking_id: {bool(booking_id)}")
        return {"status": "missing_required_data"}
    
    # Check for duplicate processing
    existing_payment = crud.payment.get_payment_by_transaction_id(db, payment_intent_id)
    if existing_payment and existing_payment.status == PaymentStatus.paid:
        logger.info(f"Webhook already processed for session {stripe_session_id}")
        return {"status": "already_processed"}
    
    # Find and update booking
    booking = crud.booking.read_booking_by_id(db, int(booking_id))
    if not booking:
        logger.error(f"Booking ID {booking_id} not found in database")
        return {"status": "booking_not_found"}
    
    # Update booking and payment status
    crud.booking.update_booking_status(
        db=db,
        booking=booking,
        booking_status=BookingStatus.confirmed,
        payment_status=PaymentStatus.paid,
        transaction_id=payment_intent_id
    )
    
    logger.info(f"Booking {booking_id} confirmed and paid. Stripe session: {stripe_session_id}")
    
    # Send confirmation email (non-blocking)
    try:
        crud.email.send_confirmation_email(email_to=email, metadata=metadata)
    except Exception as e:
        logger.error(f"Failed to send confirmation email for booking {booking_id}: {e}")
    
    return {"status": "success"}


def handle_checkout_session_expired(db: Session, stripe_session: dict) -> dict:
    """
    Handle expired checkout sessions (user didn't complete payment in time).
    
    Args:
        db: Database session
        stripe_session: Stripe session object from webhook
        
    Returns:
        Dict with processing status
    """
    metadata = stripe_session.get("metadata", {})
    booking_id = metadata.get("booking_id")
    stripe_session_id = stripe_session.get("id")
    
    if not booking_id:
        logger.warning(f"No booking_id in expired session {stripe_session_id} metadata")
        return {"status": "missing_booking_id"}
    
    booking = crud.booking.read_booking_by_id(db, int(booking_id))
    if not booking:
        logger.warning(f"Booking ID {booking_id} not found for expired session {stripe_session_id}")
        return {"status": "booking_not_found"}
    
    # Update booking and payment status
    crud.booking.update_booking_status(
        db=db,
        booking=booking,
        booking_status=BookingStatus.expired,
        payment_status=PaymentStatus.expired
    )
    
    logger.info(f"Booking {booking_id} marked as expired due to session timeout")
    return {"status": "success"}


def handle_payment_intent_failed(db: Session, payment_intent: dict) -> dict:
    """
    Handle failed payment intents (card declined, insufficient funds, etc.).
    
    Args:
        db: Database session
        payment_intent: Stripe payment intent object from webhook
        
    Returns:
        Dict with processing status
    """
    payment_intent_id = payment_intent.get("id")
    
    # Find booking associated with this payment intent
    booking = crud.booking.get_booking_by_payment_intent(db, payment_intent_id)
    if not booking:
        logger.warning(f"No booking found for failed payment intent: {payment_intent_id}")
        return {"status": "booking_not_found"}
    
    # Update booking and payment status
    crud.booking.update_booking_status(
        db=db,
        booking=booking,
        booking_status=BookingStatus.payment_failed,
        payment_status=PaymentStatus.failed
    )
    
    logger.info(f"Booking {booking.id} marked as payment failed")
    
    # Send payment failure notification (optional)
    # try:
    #     send_payment_failure_email(booking.user.email, booking)
    # except Exception as e:
    #     logger.error(f"Failed to send payment failure email for booking {booking.id}: {e}")
    
    return {"status": "success"}


def handle_invoice_payment_failed(db: Session, invoice: dict) -> dict:
    """
    Handle failed invoice payments (for subscription-based services).
    Currently logs the event - implement subscription logic as needed.
    
    Args:
        db: Database session
        invoice: Stripe invoice object from webhook
        
    Returns:
        Dict with processing status
    """
    customer_email = invoice.get("customer_email")
    invoice_id = invoice.get("id")
    
    logger.info(f"Invoice payment failed - Invoice: {invoice_id}, Customer: {customer_email}")
    
    # TODO: Implement payment failure logic
    # This might involve:
    # - Finding customer subscription records
    # - Updating subscription status
    # - Sending payment retry notifications
    # - Implementing grace periods
    
    return {"status": "logged"}