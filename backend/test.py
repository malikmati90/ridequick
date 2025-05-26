from app.utils.utils import send_email, generate_booking_confirmation_email
from datetime import date, time

ex_date = date(2025, 10, 10)
ex_time = time(14, 00)

data = {
    "pickup": "Sagrada Família",
    "destination": "Barcelona Airport",
    "date": ex_date,
    "time": ex_time,
    "vehicle": "Standard",
    "fare": "24.50",
    "booking_id": "893442"
}

email_data = generate_booking_confirmation_email(data)
send_email(email_to="marc595786@gmail.com", subject=email_data.subject, html_content=email_data.html_content)
