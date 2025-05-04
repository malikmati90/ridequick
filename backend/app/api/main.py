""" Main API routes definition """
from fastapi import APIRouter

from app.api.routes import (
    login,
    users,
    utils,
    drivers,
    vehicles,
    bookings,
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
