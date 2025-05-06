from typing import List, Optional
from sqlmodel import Session, select, func

from app.models import (
    Vehicle,
    VehicleCreate,
    VehicleUpdate,
    VehiclesOut
)


def create_vehicle(*, session: Session, vehicle_in: VehicleCreate) -> Vehicle:
    vehicle = Vehicle.model_validate(vehicle_in)
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)
    return vehicle


def read_vehicle_by_id(session: Session, vehicle_id: int) -> Optional[Vehicle]:
    return session.get(Vehicle, vehicle_id)


def read_vehicles(*, session: Session, skip: int = 0, limit: int = 100) -> VehiclesOut:
    count = session.exec(select(func.count()).select_from(Vehicle)).one()
    vehicles = session.exec(select(Vehicle).offset(skip).limit(limit)).all()
    return VehiclesOut(data=vehicles, count=count)


def read_vehicles_by_driver(*, session: Session, driver_id: int) -> list[Vehicle]:
    statement = select(Vehicle).where(Vehicle.driver_id == driver_id)
    return session.exec(statement).all()


def read_company_owned_vehicles(*, session: Session) -> list[Vehicle]:
    statement = select(Vehicle).where(Vehicle.is_company_owned == True)
    return session.exec(statement).all()


def update_vehicle(*, session: Session, db_vehicle: Vehicle, vehicle_in: VehicleUpdate) -> Vehicle:
    vehicle_data = vehicle_in.model_dump(exclude_unset=True)
    db_vehicle.sqlmodel_update(vehicle_data)
    session.add(db_vehicle)
    session.commit()
    session.refresh(db_vehicle)
    return db_vehicle


def delete_vehicle(*, session: Session, db_vehicle: Vehicle):
    session.delete(db_vehicle)
    session.commit()
