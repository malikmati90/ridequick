from app.utils.utils import send_email, generate_booking_confirmation_email


def send_confirmation_email(*, email_to: str, metadata: dict):
    # Generate the confirmation email content
    new_email = generate_booking_confirmation_email(data=metadata)
    
    # send the email
    send_email(email_to=email_to, subject=new_email.subject, html_content=new_email.html_content)