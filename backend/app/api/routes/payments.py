from fastapi import APIRouter, HTTPException, Request
from app.models import CheckoutRequest
from app import crud
import logging

from app.api.deps import (
    CurrentUser,
    SessionDep,
)

router = APIRouter()
logger = logging.getLogger(__name__)  # creates logger for this file/module


@router.post("/create-checkout-session")
def create_checkout_session(session: SessionDep, data: CheckoutRequest, current_user: CurrentUser):
    try:
        # Create a pending booking and payment
        new_booking = crud.booking.create_booking_me(
            session=session,
            booking_in=data.to_booking_create_me(),
            current_user=current_user
        )

        return crud.stripe.create_checkout_session(
            data=data,
            booking_id = new_booking.id
            )
    except Exception as e:
        logger.error(f"Stripe session creation failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to initiate payment session: {str(e)}")


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, session: SessionDep):
    return await crud.stripe.stripe_webhook(request=request, db=session)