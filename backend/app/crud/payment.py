from sqlmodel import Session, select
from app.models import Payment, PaymentStatus, PaymentMethod, CheckoutRequest
from fastapi import HTTPException
from app.core.config import settings
import stripe


def create_payment(*, session: Session, booking_id: int, amount: float, method: PaymentMethod) -> Payment:
    payment = Payment(
        booking_id=booking_id,
        method=method,
        amount=amount,
        status=PaymentStatus.pending
    )
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment


def update_payment_status(*, session: Session, payment_id: int, new_status: PaymentStatus):
    payment = session.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment.status = new_status
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment


def read_payment_by_booking(*, session: Session, booking_id: int) -> Payment:
    statement = select(Payment).where(Payment.booking_id == booking_id)
    payment = session.exec(statement).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(*, data: CheckoutRequest):
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
            "name": data.name,
            "phone": data.phone,
            "pickup": data.pickup_location,
            "destination": data.destination,
            "time": data.scheduled_time,
        },
        success_url=settings.STRIPE_SUCCESS_URL,
        cancel_url=settings.STRIPE_CANCEL_URL,
    )
    return {"url": session.url}