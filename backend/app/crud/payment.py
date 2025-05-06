from sqlmodel import Session, select
from app.models import Payment, PaymentStatus, PaymentMethod
from fastapi import HTTPException


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
