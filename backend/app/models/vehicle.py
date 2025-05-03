""" Vehicle models """
from enum import Enum
from sqlmodel import Relationship, SQLModel, Field
from typing import Optional
from datetime import date


class VehicleCategory(str, Enum):
    economy = "economy"
    standard = "standard"
    premium = "premium"

# Shared properties
class VehicleBase(SQLModel):
    model: str
    plate_number: str = Field(unique=True, max_length=20)
    capacity: int = Field(default=4)  # passengers
    category: VehicleCategory = Field(default=VehicleCategory.economy)
    is_active: bool = True


# DB model
class Vehicle(VehicleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    driver_id: int = Field(foreign_key="driver.id")

    driver: Optional["Driver"] = Relationship(back_populates="vehicles")

# For creation
class VehicleCreate(VehicleBase):
    driver_id: int


# For update
class VehicleUpdate(SQLModel):
    model: Optional[str] = None
    plate_number: Optional[str] = None
    capacity: Optional[int] = None
    category: Optional[VehicleCategory] = None
    is_active: Optional[bool] = None
    driver_id: Optional[int] = None



# For API output
class VehicleOut(VehicleBase):
    id: int
    driver_id: int


# To avoid circular import issues 
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .driver import Driver
