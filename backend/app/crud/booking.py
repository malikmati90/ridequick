from typing import List, Optional
from sqlmodel import Session, select, func
from fastapi import HTTPException

from app.utils.time import now_madrid

from .payment import create_payment
from app.services.fare import estimate_fare
from app.models import (
    Booking,
    BookingCreateMe,
    BookingCreateAdmin,
    BookingUpdate,
    BookingsOut,
    BookingFullOut,
    BookingEstimateRequest,
    BookingEstimateResponse,
    PricingRule,
    User,
    Driver,
    Payment
)

def _flatten(b: Booking) -> BookingFullOut:
    # ensure relationships loaded
    # (Session.refresh should have been called where needed)
    u = b.user
    d = b.driver
    p = b.payment
    return BookingFullOut(
        pickup_location=b.pickup_location,
        dropoff_location=b.dropoff_location,
        scheduled_time=b.scheduled_time,
        id=b.id,
        user_id=b.user_id,
        user_email=u.email,
        user_full_name=(u.full_name if u.full_name else None),
        driver_id=b.driver_id,
        driver_license_number=(d.license_number if d else None),
        status=b.status,
        fare=b.fare,
        vehicle_category=b.vehicle_category,
        duration_minutes=b.duration_minutes,
        distance_km=(b.distance_km if b.distance_km else None),
        payment_status=(p.status if p else None),
        payment_method=(p.method if p else None),
        created_at=b.created_at,
        updated_at=b.updated_at
    )


def create_booking_me(
    *, session: Session, booking_in: BookingCreateMe, current_user: User
) -> BookingFullOut:
    
    booking_data = booking_in.model_dump(exclude={"payment_method"})
    booking = Booking(**booking_data)
    booking.user_id = current_user.id

    session.add(booking)
    session.commit()
    session.refresh(booking)

    # Create payment linked to this booking
    create_payment(
        session=session,
        booking_id=booking.id,
        amount=booking.fare,
        method=booking_in.payment_method
    )

    session.refresh(booking, attribute_names=["user", "driver", "payment"])
    return booking


def create_booking_admin(
    *, session: Session, booking_in: BookingCreateAdmin
) -> BookingFullOut:
    # validate passenger
    if not session.get(User, booking_in.user_id):
        raise HTTPException(status_code=404, detail="Passenger not found")
    # validate optional driver
    if booking_in.driver_id and not session.get(Driver, booking_in.driver_id):
        raise HTTPException(status_code=404, detail="Assigned driver not found")

    # dist_km, dur_min = get_route_info(booking_in.pickup_location, booking_in.dropoff_location)
    # fare = calculate_fare(
    #     category=booking_in.vehicle_category,
    #     distance_km=dist_km,
    #     scheduled_time=booking_in.scheduled_time,
    #     is_airport=False,
    #     is_holiday=False,
    #     passenger_count=booking_in.passenger_count
    # )

    b = Booking.model_validate(booking_in)
    # b.distance_km = dist_km
    # b.duration_minutes = dur_min
    # b.fare = fare

    session.add(b)
    session.commit()
    session.refresh(b)
    session.refresh(b, attribute_names=["user", "driver"])
    return _flatten(b)


def read_booking_by_id(session: Session, booking_id: int) -> Optional[Booking]:
    return session.get(Booking, booking_id)

def read_booking_by_id_complete(*, session: Session, booking_id: int) -> BookingFullOut:
    b = session.get(Booking, booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    session.refresh(b, attribute_names=["user", "driver"])
    return _flatten(b)


def read_bookings(*, session: Session, skip: int = 0, limit: int = 100) -> BookingsOut:
    count = session.exec(select(func.count()).select_from(Booking)).one()
    bookings = session.exec(select(Booking).offset(skip).limit(limit)).all()
    return BookingsOut(data=bookings, count=count)

def read_bookings_complete(*, session: Session, skip: int = 0, limit: int = 100) -> BookingsOut:
    total = session.exec(select(func.count()).select_from(Booking)).one()
    rows = session.exec(select(Booking).offset(skip).limit(limit)).all()
    for b in rows:
        session.refresh(b, attribute_names=["user", "driver"])
    return BookingsOut(data=[_flatten(b) for b in rows], count=total)


def read_bookings_by_user(*, session: Session, user_id: int) -> List[BookingFullOut]:
    rows = session.exec(select(Booking).where(Booking.user_id == user_id)).all()
    for b in rows:
        session.refresh(b, attribute_names=["user", "driver"])
    return [_flatten(b) for b in rows]


def read_bookings_by_driver(*, session: Session, driver_id: int) -> List[BookingFullOut]:
    rows = session.exec(select(Booking).where(Booking.driver_id == driver_id)).all()
    for b in rows:
        session.refresh(b, attribute_names=["user", "driver"])
    return [_flatten(b) for b in rows]


def update_booking(*, session: Session, db_booking: Booking, booking_in: BookingUpdate) -> List[BookingFullOut]:
    booking_data = booking_in.model_dump(exclude_unset=True)

    # If driver_id is being changed, validate
    if "driver_id" in booking_data and booking_data["driver_id"] is not None:
        driver = session.get(Driver, booking_data["driver_id"])
        if not driver:
            raise HTTPException(status_code=404, detail="Assigned driver not found")

    db_booking.sqlmodel_update(booking_data)
    session.add(db_booking)
    session.commit()
    session.refresh(db_booking)
    session.refresh(db_booking, attribute_names=["user", "driver"])
    # return db_booking
    return _flatten(db_booking)


def delete_booking(*, session: Session, db_booking: Booking):
    session.delete(db_booking)
    session.commit()


def estimate_booking_price(*, session: Session, body: BookingEstimateRequest) -> List[BookingEstimateResponse]:
    rules = session.exec(select(PricingRule).where(PricingRule.is_active == True)).all()

    estimates = []
    for rule in rules:
        price = estimate_fare(
            rule=rule,
            distance_km=body.distance_km,
            duration_minutes=body.duration_minutes,
            scheduled_time=body.scheduled_time,
            passenger_count=body.passenger_count,
            is_airport=body.is_airport,
            is_holiday=body.is_holiday,
        )
        estimates.append(BookingEstimateResponse(
            category=rule.category,
            estimated_fare=price
        ))

    return estimates


def update_booking_status (
    db: Session, 
    booking: Booking, 
    booking_status: str, 
    payment_status: str | None = None,
    transaction_id: str | None = None
) -> None:
    """
    Update booking and payment status with timestamp.
    
    Args:
        db: Database session
        booking: Booking object to update
        booking_status: New booking status (confirmed, expired, payment_failed, etc.)
        payment_status: New payment status (paid, failed, expired, etc.)
        transaction_id: Transaction ID to store in payment record
    """
    
    # Update booking
    booking.status = booking_status
    booking.updated_at = now_madrid()
    
    # Update payment if it exists and payment_status is provided
    if booking.payment and payment_status:
        booking.payment.status = payment_status
        booking.payment.updated_at = now_madrid()
        
        # Update transaction ID if provided
        if transaction_id:
            booking.payment.transaction_id = transaction_id
    
    db.commit()


def get_booking_by_payment_intent(db: Session, payment_intent_id: str) -> Booking | None:
    """
    Find a booking by its associated payment intent ID.
    
    Args:
        db: Database session
        payment_intent_id: Stripe payment intent ID
        
    Returns:
        Booking object if found, None otherwise
    """
    return db.exec(
        select(Booking).join(Payment).where(
            Payment.transaction_id == payment_intent_id
        )
    ).first()