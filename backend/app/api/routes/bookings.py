from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.models import (
    Booking,
    BookingCreateMe,
    BookingCreateAdmin,
    BookingUpdate,
    BookingOut,
    BookingsOut,
    BookingFullOut,
    BookingEstimateRequest,
    BookingEstimateResponse,
    PricingRule,
    VehicleCategory,
    Message,
)

router = APIRouter()

# Passenger: list own bookings
@router.get(
    "/me",
    response_model=List[BookingFullOut]
)
def read_my_bookings(session: SessionDep, current_user: CurrentUser) -> List[BookingFullOut]:
    return crud.booking.read_bookings_by_user(session=session, user_id=current_user.id)


@router.get("/", response_model=BookingsOut)
def read_bookings(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    return crud.booking.read_bookings(session=session, skip=skip, limit=limit)

# Admin: list all bookings
@router.get(
    "/complete",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=BookingsOut
)
def read_bookings_complete(session: SessionDep, skip: int = 0, limit: int = 100) -> BookingsOut:
    return crud.booking.read_bookings_complete(session=session, skip=skip, limit=limit)


@router.get("/{booking_id}", response_model=BookingOut)
def read_booking(booking_id: int, session: SessionDep) -> Any:
    booking = crud.booking.read_booking_by_id(session=session, booking_id=booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# Passenger & Admin: get one booking
@router.get(
    "/{booking_id}/complete",
    response_model=BookingFullOut
)
def read_booking_complete(
    booking_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> BookingFullOut:
    booking = crud.booking.read_booking_by_id_complete(
        session=session, booking_id=booking_id
    )
    # Passengers can only see their own bookings
    if current_user.role != "admin" and booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return booking


# Admin: filter by driver
@router.get(
    "/by-driver/{driver_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=List[BookingFullOut]
)
def read_bookings_by_driver(driver_id: int, session: SessionDep) -> List[BookingFullOut]:
    return crud.booking.read_bookings_by_driver(session=session, driver_id=driver_id)


# Passenger: create own booking
@router.post("/me", response_model=BookingFullOut)
def create_booking_me(
    body: BookingCreateMe,
    session: SessionDep,
    current_user: CurrentUser
) -> BookingFullOut:
    return crud.booking.create_booking_me(
        session=session, booking_in=body, current_user=current_user
    )

# Admin: create for any user
@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=BookingFullOut
)
def create_booking_admin(
    body: BookingCreateAdmin,
    session: SessionDep
) -> BookingFullOut:
    return crud.booking.create_booking_admin(session=session, booking_in=body)


# Admin: update booking (assign driver, change status, cancel, etc.)
@router.patch(
    "/{booking_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=BookingOut
)
def update_booking(booking_id: int, booking_in: BookingUpdate, session: SessionDep) -> Any:
    db_booking = crud.booking.read_booking_by_id(session=session, booking_id=booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return crud.booking.update_booking(session=session, db_booking=db_booking, booking_in=booking_in)


# Passenger: cancel own booking
@router.post(
    "/{booking_id}/cancel",
    response_model=BookingFullOut
)
def cancel_booking(
    booking_id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> BookingFullOut:
    db_b = session.get(Booking, booking_id)
    if not db_b or db_b.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    return crud.booking.update_booking(
        session=session,
        db_booking=db_b,
        booking_in=BookingUpdate(status="canceled")
    )


@router.delete(
    "/{booking_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message
)
def delete_booking(booking_id: int, session: SessionDep) -> Message:
    db_booking = crud.booking.read_booking_by_id(session=session, booking_id=booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    crud.booking.delete_booking(session=session, db_booking=db_booking)
    return Message(message="Booking deleted successfully")

@router.post("/estimate", response_model=list[BookingEstimateResponse])
def estimate_booking_price(
    session: SessionDep,
    body: BookingEstimateRequest
) -> list[BookingEstimateResponse]:
    return crud.booking.estimate_booking_price(session=session, body=body)