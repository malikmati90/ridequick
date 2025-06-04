""" Booking models """
from pydantic import BaseModel
from sqlalchemy import Column, DateTime
from sqlmodel import Relationship, SQLModel, Field
from typing import Optional, Union
from enum import Enum
from datetime import datetime

from .payment import PaymentMethod
from .vehicle import VehicleCategory
from app.utils.time import now_madrid


class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    assigned = "assigned"
    completed = "completed"
    canceled = "canceled"
    expired = "expired"                 # When checkout session expires (user didn't pay in time)
    payment_failed = "payment_failed"   # When payment processing fails (card declined, etc.)


# Shared properties
class BookingBase(SQLModel):
    pickup_location: str
    dropoff_location: str
    scheduled_time: datetime
    vehicle_category: VehicleCategory
    fare: Optional[float] = None
    passenger_count: int = Field(default=1)
    status: BookingStatus = Field(default=BookingStatus.pending)


# DB table
class Booking(BookingBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    driver_id: Optional[int] = Field(default=None, foreign_key="driver.id")

    cancellation_reason: Optional[str] = None
    rating_given: Optional[int] = None
    distance_km: Optional[float] = None
    duration_minutes: Optional[int] = None

    created_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, nullable=False)
    )

    updated_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, onupdate=now_madrid, nullable=False)
    )
    
    user: "User" = Relationship(back_populates="bookings")
    driver: Optional["Driver"] = Relationship(back_populates="bookings")
    payment: Optional["Payment"] = Relationship(back_populates="booking")



class BookingCreateMe(SQLModel):
    pickup_location: str
    dropoff_location: str
    scheduled_time: datetime
    vehicle_category: VehicleCategory
    passenger_count: int = Field(default=1)
    distance_km: float
    duration_minutes: int
    fare: float
    payment_method: PaymentMethod = Field(default=PaymentMethod.card)


class BookingCreateAdmin(BookingCreateMe):
    user_id: int

    
# For admin updates (e.g., assigning driver)
class BookingUpdate(SQLModel):
    driver_id: Optional[int] = None
    fare: Optional[float] = None
    status: Optional[BookingStatus] = None
    cancellation_reason: Optional[str] = None


class BookingOut(BookingBase):
    id: int
    user_id: int
    driver_id: Optional[int]
    created_at: datetime

# Flat, admin-friendly output
class BookingFullOut(BookingBase):
    id: int
    user_id: int
    user_email: str
    user_full_name: Optional[str]
    driver_id: Optional[int]
    driver_license_number: Optional[str]
    distance_km: Optional[float]
    duration_minutes: Optional[int]
    created_at: datetime
    updated_at: datetime

class BookingsOut(SQLModel):
    data: list[Union[BookingOut, BookingFullOut]]
    count: int


class BookingEstimateRequest(SQLModel):
    distance_km: float
    duration_minutes: int
    scheduled_time: datetime
    passenger_count: int = Field(default=1, ge=1)
    is_airport: bool = False
    is_holiday: bool = False


class BookingEstimateResponse(SQLModel):
    category: VehicleCategory
    estimated_fare: float


class CheckoutRequest(BaseModel):
    name: str
    email: str
    phone: str
    price: float
    selected_vehicle: str
    passengers: int
    pickup_location: str
    destination: str
    scheduled_time: str
    estimatedDistance: float
    estimatedDuration: int

    def to_booking_create_me(self) -> BookingCreateMe:
        return BookingCreateMe(
            pickup_location=self.pickup_location,
            dropoff_location=self.destination,
            scheduled_time=self.scheduled_time,
            passenger_count=self.passengers,
            fare=self.price,
            vehicle_category=self.selected_vehicle,
            distance_km=self.estimatedDistance,
            duration_minutes=self.estimatedDuration,
        )