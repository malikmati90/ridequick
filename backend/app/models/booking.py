""" Booking models """
from zoneinfo import ZoneInfo
from pydantic import field_validator
from sqlalchemy import Column, DateTime
from sqlmodel import Relationship, SQLModel, Field
from typing import Optional, Union
from enum import Enum
from datetime import datetime

from .vehicle import VehicleCategory

def now_madrid():
    return datetime.now(ZoneInfo("Europe/Madrid"))


class BookingStatus(str, Enum):
    pending = "pending"
    assigned = "assigned"
    completed = "completed"
    canceled = "canceled"


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
    user_id: int = Field(foreign_key="user.id")
    driver_id: Optional[int] = Field(default=None, foreign_key="driver.id")

    payment_method: Optional[str] = None
    payment_status: Optional[str] = None
    cancellation_reason: Optional[str] = None
    rating_given: Optional[int] = None
    distance_km: Optional[float] = None
    duration_minutes: Optional[int] = None

    created_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=datetime.now, nullable=False)
    )

    updated_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now, nullable=False)
    )
    
    user: "User" = Relationship(back_populates="bookings")
    driver: Optional["Driver"] = Relationship(back_populates="bookings")


class BookingCreateMe(SQLModel):
    pickup_location: str
    dropoff_location: str
    scheduled_time: datetime
    vehicle_category: VehicleCategory
    passenger_count: int = Field(default=1)

    @field_validator("scheduled_time")
    def must_be_future(cls, v: datetime):
        if v <= datetime.now(ZoneInfo("Europe/Madrid")):
            raise ValueError("scheduled_time must be in the future")
        return v

    @field_validator("passenger_count")
    def min_passengers(cls, v: int):
        if v < 1:
            raise ValueError("passenger_count must be at least 1")
        return v


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
    user_full_name: str
    driver_id: Optional[int]
    driver_license_number: Optional[str]
    distance_km: Optional[float]
    duration_minutes: Optional[int]
    created_at: datetime
    updated_at: datetime

class BookingsOut(SQLModel):
    data: list[Union[BookingOut, BookingFullOut]]
    count: int