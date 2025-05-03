""" Booking models """
from zoneinfo import ZoneInfo
from sqlmodel import Relationship, SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


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
    vehicle_type: Optional[str] = None
    fare: Optional[float] = None
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

    created_at: datetime = Field(default_factory=lambda: datetime.now(ZoneInfo("Europe/Madrid")))

    user: "User" = Relationship(back_populates="bookings")
    driver: Optional["Driver"] = Relationship(back_populates="bookings")

# For API input (creating a booking)
class BookingCreate(SQLModel):
    pickup_location: str
    dropoff_location: str
    scheduled_time: datetime
    vehicle_type: Optional[str] = None


# For API response
class BookingOut(BookingBase):
    id: int
    user_id: int
    driver_id: Optional[int]
    created_at: datetime


# For admin updates (e.g., assigning driver)
class BookingUpdate(SQLModel):
    driver_id: Optional[int] = None
    fare: Optional[float] = None
    status: Optional[BookingStatus] = None
    cancellation_reason: Optional[str] = None
