from fastapi import APIRouter, HTTPException
from app.models import CheckoutRequest
from app import crud
import logging

router = APIRouter()
logger = logging.getLogger(__name__)  # creates logger for this file/module


@router.post("/create-checkout-session")
def create_checkout_session(data: CheckoutRequest):
    try:
        return crud.payment.create_checkout_session(data=data)
    except Exception as e:
        logger.error(f"Stripe session creation failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to initiate payment session: {str(e)}")
