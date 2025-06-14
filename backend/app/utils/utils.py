""" Utility module """
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import emails  # type: ignore
from jinja2 import Template
import jwt
from jwt.exceptions import InvalidTokenError
from app.core.config import settings


@dataclass
class EmailData:
    html_content: str
    subject: str


def render_email_template(*, template_name: str, context: dict[str, Any]) -> str:
    base_dir = Path(__file__).resolve().parent.parent  # This goes from utils.py up to app/
    template_path = base_dir / "email-templates" / "html" / template_name
    template_str = template_path.read_text()
    html_content = Template(template_str).render(context)
    return html_content


def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> None:
    assert settings.emails_enabled, "no provided configuration for email variables"
    message = emails.Message(
        subject=subject,
        html=html_content,
        mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
    if settings.SMTP_TLS:
        smtp_options["tls"] = True
    elif settings.SMTP_SSL:
        smtp_options["ssl"] = True
    if settings.SMTP_USER:
        smtp_options["user"] = settings.SMTP_USER
    if settings.SMTP_PASSWORD:
        smtp_options["password"] = settings.SMTP_PASSWORD
    response = message.send(to=email_to, smtp=smtp_options)
    logging.info(f"send email result: {response}")


def generate_test_email(email_to: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Test email"
    html_content = render_email_template(
        template_name="test_email.html",
        context={"project_name": settings.PROJECT_NAME, "email": email_to},
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_reset_password_email(email_to: str, email: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Password recovery for user {email}"
    link = f"{settings.server_host}/reset-password?token={token}"
    html_content = render_email_template(
        template_name="reset_password.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_new_account_email(
    email_to: str, username: str, password: str
) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - New account for user {username}"
    html_content = render_email_template(
        template_name="new_account.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "username": username,
            "password": password,
            "email": email_to,
            "link": settings.server_host,
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_booking_confirmation_email(data: dict[str, str]) -> EmailData:
    subject = f"{settings.PROJECT_NAME} - Booking Confirmed"
    
    # Handle date and time as strings (since they come from metadata)
    try:
        # If date is in YYYY-MM-DD format, format it nicely
        if len(data.get("date", "")) == 10:  # YYYY-MM-DD format
            date_obj = datetime.strptime(data["date"], "%Y-%m-%d")
            formatted_date = date_obj.strftime("%d %B %Y")
        else:
            formatted_date = data.get("date", "Not specified")
    except (ValueError, KeyError):
        formatted_date = data.get("date", "Not specified")
    
    html_content = render_email_template(
        template_name="booking_confirmation.html",
        context={
            "project_name": settings.PROJECT_NAME,
            "frontend_host": settings.FRONTEND_HOST,
            "booking_id": data.get("booking_id", "Unknown"),
            "pickup": data.get("pickup", "Not specified"),
            "destination": data.get("destination", "Not specified"),
            "date": formatted_date,
            "time": data.get("time", "Not specified"),
            "vehicle": data.get("vehicle", "Not specified"),
            "fare": data.get("fare", "Not specified"),
            "passengers": data.get("passengers", "Not specified"),
            "name": data.get("name", "Not specified"),
            "phone": data.get("phone", "Not specified"),
        },
    )
    return EmailData(html_content=html_content, subject=subject)


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> str | None:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return str(decoded_token["sub"])
    except InvalidTokenError:
        return None