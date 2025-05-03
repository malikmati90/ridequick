""" Driver models """
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


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


# For update
class DriverUpdate(SQLModel):
    license_number: Optional[str] = None
    is_active: Optional[bool] = None


# For API output
class DriverOut(DriverBase):
    id: int
    user_id: int


# TO avoid circular import issues
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .vehicle import Vehicle
