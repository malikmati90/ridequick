""" Driver models """
from datetime import date
from pydantic import EmailStr
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

from app.models import UserBase


# Shared properties
class DriverBase(SQLModel):
    license_number: str = Field(max_length=10)
    is_active: bool = True


# DB model
class Driver(DriverBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)

    user: "User" = Relationship(back_populates="driver_profile")
    vehicles: List["Vehicle"] = Relationship(back_populates="driver")
    bookings: List["Booking"] = Relationship(back_populates="driver")


# For creation
class DriverCreate(DriverBase):
    user_id: int

class AdminCreateDriver(SQLModel):
    # User fields
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=15)

    # Driver fields
    license_number: str = Field(max_length=50)


# For update
class DriverUpdate(SQLModel):
    license_number: Optional[str] = None
    is_active: Optional[bool] = None

class AdminUpdateDriver(SQLModel):
    # User fields
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    phone_number: Optional[str] = Field(default=None, max_length=15)

    # Driver fields
    license_number: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None


# For API output
class DriverOut(DriverBase):
    id: int
    user_id: int

class DriverFullOut(DriverBase, UserBase, SQLModel):
    id: int  # driver.id
    user_id: int

class DriversOut(SQLModel):
    data: list[DriverFullOut]
    count: int




# TO avoid circular import issues
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .vehicle import Vehicle
