from datetime import datetime
from typing import Optional
from sqlalchemy import Column, DateTime
from sqlmodel import SQLModel, Field

from app.utils.time import now_madrid
from app.models import VehicleCategory


class PricingRuleBase(SQLModel):
    category: VehicleCategory = Field(unique=True)
    base_fare: float
    price_per_km_day: float
    price_per_km_night: float
    airport_surcharge: float
    holiday_surcharge: float
    passenger_surcharge: float  # per extra pax beyond 4
    min_fare: float
    min_fare_airport: float
    is_active: bool = True


class PricingRule(PricingRuleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    created_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, nullable=False)
    )

    updated_at: datetime = Field(
        default_factory=now_madrid,
        sa_column=Column(DateTime(timezone=True), default=now_madrid, onupdate=now_madrid, nullable=False)
    )


class PricingRuleUpdate(SQLModel):
    base_fare: Optional[float] = None
    price_per_km_day: Optional[float] = None
    price_per_km_night: Optional[float] = None
    airport_surcharge: Optional[float] = None
    holiday_surcharge: Optional[float] = None
    passenger_surcharge: Optional[float] = None
    min_fare: Optional[float] = None
    min_fare_airport: Optional[float] = None
    is_active: Optional[bool] = None



class PricingRuleItem(PricingRuleBase):
    id: int
    created_at: datetime
    updated_at: datetime

class PricingRuleOut(SQLModel):
    data: list[PricingRuleItem]

