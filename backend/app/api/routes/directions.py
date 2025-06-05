from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
import httpx

router = APIRouter()

@router.get("/directions")
async def get_route_info(
    origin: str = Query(...),
    destination: str = Query(...)
):
    try:
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "origin": origin,
            "destination": destination,
            "key": settings.GOOGLE_MAPS_API_KEY,
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()

        if not data or "routes" not in data or not data["routes"]:
            raise HTTPException(status_code=404, detail="No route found")

        try:
            leg = data["routes"][0]["legs"][0]
        except (IndexError, KeyError):
            raise HTTPException(status_code=500, detail="Invalid route structure")

        return {
            "distance_km": leg["distance"]["value"] / 1000,
            "duration_min": leg["duration"]["value"] / 60,
        }

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail="Server error: " + str(e))
