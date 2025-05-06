from fastapi import APIRouter, Depends, HTTPException
from typing import Any

from app import crud
from app.api.deps import SessionDep, get_current_active_superuser
from app.models import (
    Driver,
    Vehicle,
    VehicleCreate,
    VehicleUpdate,
    VehicleOut,
    VehiclesOut,
    Message,
)

router = APIRouter()


@router.get(
    "/",
    response_model=VehiclesOut
)
def read_vehicles(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    return crud.vehicle.read_vehicles(session=session, skip=skip, limit=limit)


@router.get(
    "/{vehicle_id}",
    response_model=VehicleOut
)
def read_vehicle(vehicle_id: int, session: SessionDep) -> Any:
    vehicle = crud.vehicle.read_vehicle_by_id(session=session, vehicle_id=vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=VehicleOut
)
def create_vehicle(session: SessionDep, vehicle_in: VehicleCreate) -> Any:
    # Check if driver exists
    driver = session.get(Driver, vehicle_in.driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return crud.vehicle.create_vehicle(session=session, vehicle_in=vehicle_in)


@router.patch(
    "/{vehicle_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=VehicleOut
)
def update_vehicle(vehicle_id: int, vehicle_in: VehicleUpdate, session: SessionDep) -> Any:
    db_vehicle = crud.vehicle.read_vehicle_by_id(session=session, vehicle_id=vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return crud.vehicle.update_vehicle(session=session, db_vehicle=db_vehicle, vehicle_in=vehicle_in)


@router.delete(
    "/{vehicle_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message
)
def delete_vehicle(vehicle_id: int, session: SessionDep) -> Message:
    db_vehicle = crud.vehicle.read_vehicle_by_id(session=session, vehicle_id=vehicle_id)
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if db_vehicle.is_company_owned:
        raise HTTPException(status_code=403, detail="Company-owned vehicles cannot be deleted.")
    
    crud.vehicle.delete_vehicle(session=session, db_vehicle=db_vehicle)
    return Message(message="Vehicle deleted successfully")


####################################################################################
############################### Additional Endpoints ###############################
####################################################################################
@router.get(
    "/driver/{driver_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=VehiclesOut
)
def read_vehicles_by_driver(driver_id: int, session: SessionDep) -> VehiclesOut:
    # Check if driver exists
    driver = crud.driver.read_driver_by_id(session=session, driver_id=driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    vehicles = crud.vehicle.read_vehicles_by_driver(session=session, driver_id=driver_id)
    return VehiclesOut(data=vehicles, count=len(vehicles))


@router.get("/company", response_model=VehiclesOut)
def read_company_owned_vehicles(session: SessionDep) -> VehiclesOut:
    vehicles = crud.vehicle.read_company_owned_vehicles(session=session)
    return VehiclesOut(data=vehicles, count=len(vehicles))
