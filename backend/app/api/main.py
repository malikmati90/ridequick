""" Main API routes definition """
from fastapi import APIRouter, Depends
from app.api.deps import get_current_active_superuser


from app.api.routes import (
    login,
    users,
    utils,
    drivers,
    vehicles,
    bookings,
    pricing,
    directions,
    payments
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])

api_router.include_router(
    vehicles.router,
    prefix="/vehicles",
    tags=["vehicles"],
    dependencies=[Depends(get_current_active_superuser)] # Admin access only
    )

api_router.include_router(
    pricing.router, 
    prefix="/pricing", 
    tags=["pricing"], 
    dependencies=[Depends(get_current_active_superuser)] # Admin access only
)

api_router.include_router(directions.router, prefix="/api", tags=["maps"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
