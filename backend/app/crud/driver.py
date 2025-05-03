""" Driver related CRUD methods """
from typing import Optional

from sqlmodel import Session, select, func
from app.crud.user import create_user, update_user

from app.models import (
    UserCreate,
    UserUpdate,
    UserRole,
    Driver, 
    DriverCreate, 
    DriverUpdate, 
    DriversOut, 
    AdminCreateDriver,
    AdminUpdateDriver,
    DriverFullOut,
    Message
)
from app.utils import flatten_driver_data


def read_drivers(*, session: Session, skip: int = 0, limit: int = 100) -> DriversOut:
    count = session.exec(select(func.count()).select_from(Driver)).one()
    drivers = session.exec(select(Driver).offset(skip).limit(limit)).all()
    combined_data = [flatten_driver_data(driver) for driver in drivers]
    return DriversOut(data=combined_data, count=count)


def read_driver_by_id(session: Session, driver_id: int) -> Optional[Driver]:
    return session.get(Driver, driver_id)


def create_driver(*, session: Session, driver_in: DriverCreate) -> Driver:
    db_driver = Driver.model_validate(driver_in)
    session.add(db_driver)
    session.commit()
    session.refresh(db_driver)
    return db_driver


def create_driver_and_user(*, session: Session, body: AdminCreateDriver) -> DriverFullOut:
    # Step 2: Create the user
    user_create = UserCreate(
        email=body.email,
        password=body.password,
        full_name=body.full_name,
        phone_number=body.phone_number,
        role=UserRole.driver
    )
    user = create_user(session=session, user_create=user_create)

    # Step 3: Create the driver profile
    driver_create = DriverCreate(
        user_id=user.id,
        license_number=body.license_number
    )
    driver = create_driver(session=session, driver_in=driver_create)

    return flatten_driver_data(driver)


def update_driver(*, session: Session, db_driver: Driver, driver_in: DriverUpdate) -> Driver:
    driver_data = driver_in.model_dump(exclude_unset=True)
    db_driver.sqlmodel_update(driver_data)
    session.add(db_driver)
    session.commit()
    session.refresh(db_driver)
    return db_driver


def update_driver_and_user(*, session: Session, body: AdminUpdateDriver, driver: Driver) -> DriverFullOut:
    # Load related user
    session.refresh(driver, attribute_names=["user"])
    user = driver.user

    # Extract and apply user updates
    user_data = body.model_dump(include={"email", "full_name", "phone_number"}, exclude_unset=True)
    if user_data:
        update_user(session=session, db_user=user, user_in=UserUpdate(**user_data))

    # Extract and apply driver updates
    driver_data = body.model_dump(include={"license_number", "license_expiry", "is_active"}, exclude_unset=True)
    if driver_data:
        update_driver(session=session, db_driver=driver, driver_in=DriverUpdate(**driver_data))

    return flatten_driver_data(driver)


def delete_driver(*, session: Session, db_driver: Driver):
    session.delete(db_driver)
    session.commit()
