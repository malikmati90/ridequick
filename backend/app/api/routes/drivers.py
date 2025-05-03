""" Driver management routes """
from fastapi import APIRouter, Depends, HTTPException
from typing import Any

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.models import (
    Message,
    DriverCreate,
    DriverUpdate,
    DriverOut,
    DriversOut,
    AdminCreateDriver,
    AdminUpdateDriver,
    DriverFullOut
)
from app.utils import flatten_driver_data


router = APIRouter()

@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=DriversOut
)
def read_drivers(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    return crud.driver.read_drivers(session=session, skip=skip, limit=limit)


@router.get(
    "/{driver_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=DriverFullOut
)
def read_driver(driver_id: int, session: SessionDep) -> Any:
    driver = crud.driver.read_driver_by_id(session=session, driver_id=driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    session.refresh(driver, attribute_names=["user"])  # ensure user is loaded
    return flatten_driver_data(driver)


# @router.post(
#     "/", 
#     #dependencies=[Depends(get_current_active_superuser)], 
#     response_model=DriverOut
# )
# def create_driver(session: SessionDep, driver_in: DriverCreate) -> Any:
#     return crud.driver.create_driver(session=session, driver_in=driver_in)


@router.post(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=DriverFullOut
)
def create_user_and_driver(session: SessionDep, body: AdminCreateDriver) -> Any:
    user = crud.user.get_user_by_email(session=session, email=body.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    return crud.driver.create_driver_and_user(session=session, body=body)


# @router.patch(
#     "/{driver_id}", 
#     dependencies=[Depends(get_current_active_superuser)], 
#     response_model=DriverOut
# )
# def update_driver(driver_id: int, driver_in: DriverUpdate, session: SessionDep) -> Any:
#     db_driver = crud.driver.read_driver_by_id(session=session, driver_id=driver_id)
#     if not db_driver:
#         raise HTTPException(status_code=404, detail="Driver not found")
#     return crud.driver.update_driver(session=session, db_driver=db_driver, driver_in=driver_in)

@router.patch(
    "/{driver_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=DriverFullOut
)
def admin_update_driver(driver_id: int,
    body: AdminUpdateDriver,
    session: SessionDep
) -> DriverFullOut:
    driver = crud.driver.read_driver_by_id(session=session, driver_id=driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    return crud.driver.update_driver_and_user(session=session, body=body, driver=driver)




@router.delete(
    "/{driver_id}", 
    dependencies=[Depends(get_current_active_superuser)],
    response_model=Message
)
def delete_driver(driver_id: int, session: SessionDep, user_delete: bool = False) -> Message:
    db_driver = crud.driver.read_driver_by_id(session=session, driver_id=driver_id)
    if not db_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    if user_delete:
        user = crud.user.read_user_by_id(session=session, user_id=db_driver.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Associated user not found")
        session.delete(db_driver)  # delete driver first (FK constraint)
        session.delete(user)
        session.commit()
        return Message(message="Driver and user deleted successfully")

    # If not deleting user
    crud.driver.delete_driver(session=session, db_driver=db_driver)
    return Message(message="Driver deleted successfully")
