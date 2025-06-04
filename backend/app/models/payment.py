from sqlalchemy import Column, DateTime
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from datetime import datetime
from typing import Optional

from app.utils.time import now_madrid 


class PaymentMethod(str, Enum):
    card = "card"
    cash = "cash"

class PaymentStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"
    canceled = "canceled"
    expired = "expired"     # When checkout session expires before payment


class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    booking_id: int = Field(foreign_key="booking.id")
    method: PaymentMethod
    status: PaymentStatus = PaymentStatus.pending
    amount: float
    transaction_id: Optional[str] = None  # Stripe ID

    created_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, nullable=False)
    )

    updated_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, onupdate=now_madrid, nullable=False)
    )

    booking: "Booking" = Relationship(back_populates="payment")