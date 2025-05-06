from app.models import PricingRule, VehicleCategory
from datetime import datetime


def is_night_time(hour: int) -> bool:
    return hour < 8 or hour >= 20


def estimate_fare(
    rule: PricingRule,
    distance_km: float,
    duration_minutes: int,
    scheduled_time: datetime,
    passenger_count: int,
    is_airport: bool,
    is_holiday: bool
) -> float:
    
    scheduled_hour = scheduled_time.hour
    price_per_km = rule.price_per_km_night if is_night_time(scheduled_hour) else rule.price_per_km_day
    fare = rule.base_fare + (price_per_km * distance_km)

    if is_airport:
        fare += rule.airport_surcharge
    if is_holiday:
        fare += rule.holiday_surcharge
    if passenger_count > 4:
        fare += (passenger_count - 4) * rule.passenger_surcharge

    if is_airport:
        fare = max(fare, rule.min_fare_airport)
    else:
        fare = max(fare, rule.min_fare)

    return round(fare, 2)
