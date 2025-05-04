from sqlmodel import SQLModel, Field
from .vehicle import VehicleCategory


class PriceConfig(SQLModel, table=True):
    category: VehicleCategory = Field(primary_key=True)
    base_fare: float
    price_per_km_day: float
    price_per_km_night: float
    airport_surcharge: float
    holiday_surcharge: float
    passenger_surcharge: float  # per extra pax beyond 4
    min_fare: float
    min_fare_airport: float
    is_active: bool = True
