from app.utils.utils import send_email, generate_booking_confirmation_email
from datetime import datetime

data = {
    "name": "malik",
    "email": "marc595786@gmail.com", 
    "phone": "+34677799007",
    "price": 143.71,
    "selected_vehicle": "economy",
    "passengers": 3,
    "pickup_location": "Josep Tarradellas Barcelona-El Prat Airport - 08820 El Prat de Llobregat, Barcelona, Spain",
    "destination": "Girona–Costa Brava Airport - Aiguaviva, s/n, 17185 Vilobí d'Onyar, Girona, Spain",
    "scheduled_time": "2025-06-02T12:00:00.000Z",
    "estimatedDistance": 103.192,
    "estimatedDuration": 70
}

try:
    # Parse scheduled_time to separate date and time
    scheduled_datetime = datetime.fromisoformat(data["scheduled_time"].replace('Z', '+00:00'))
    date_str = scheduled_datetime.strftime("%Y-%m-%d")
    time_str = scheduled_datetime.strftime("%H:%M")
except (ValueError, AttributeError):
    # Fallback if parsing fails
    date_str = data["scheduled_time"]
    time_str = ""

# Transform data to match what the email function expects
email_metadata = {
    "booking_id": "TEST_123",  # Add a test booking ID
    "pickup": data["pickup_location"],
    "destination": data["destination"], 
    "date": date_str,
    "time": time_str,
    "vehicle": data["selected_vehicle"],
    "fare": f"{data['price']:.2f}",  # Convert to formatted string
    "passengers": str(data["passengers"]),
    "name": data["name"],
    "phone": data["phone"],
}

print("Email metadata:", email_metadata)

# Generate and send email
email_data = generate_booking_confirmation_email(email_metadata)
send_email(
    email_to="marc595786@gmail.com", 
    subject=email_data.subject, 
    html_content=email_data.html_content
)

print("Email sent successfully!")






eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDk0ODUyMzgsInN1YiI6IjkifQ.XweKIWsr1OC41nQPyUfbF2zoP1HGrcbORuP9eWHtL6I
