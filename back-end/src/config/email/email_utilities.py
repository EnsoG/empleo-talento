import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from typing import Literal

from schemas.extras import ContactEmail
from ..settings import get_settings

settings = get_settings()

config = ConnectionConfig(
    MAIL_USERNAME=settings.smtp_username,
    MAIL_PASSWORD=settings.smtp_password,
    MAIL_FROM=settings.smtp_mail_from,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True,
    TEMPLATE_FOLDER=os.path.join(os.path.dirname(__file__), "email_templates")
)
# Email Functions
async def send_register_email(email: str, password: str, user_type: Literal["candidate", "company"]):
    # Create Message Schema
    message = MessageSchema(
        subject="¡Bienvenido a Empleo Talento!",
        recipients=[email],
        template_body={
            "email": email,
            "password": password,
            "user_type": user_type
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="register.html")

async def send_reset_password_email(email: str, reset_url: str):
    # Create Message Schema
    message = MessageSchema(
        subject="Solicitud Cambio Contraseña",
        recipients=[email],
        template_body={
            "reset_url": reset_url
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="reset-password.html")

async def send_change_password_email(email: str, new_password: str):
    # Create Message Schema
    message = MessageSchema(
        subject="Cambio Contraseña",
        recipients=[email],
        template_body={
            "new_password": new_password
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="change-password.html")

async def send_sender_contact_email(email: str, full_name: str):
    # Create Message Schema
    message = MessageSchema(
        subject="Consulta Enviada",
        recipients=[email],
        template_body={
            "full_name": full_name
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="sender-contact.html")

async def send_recipient_contact_email(sender_data: ContactEmail):
    # Create Message Schema
    message = MessageSchema(
        subject="Consulta Recibida",
        recipients=[settings.contact_recipient_email],
        template_body={
            "full_name": sender_data.full_name,
            "subject": sender_data.subject,
            "email": sender_data.email,
            "message": sender_data.message
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="recipient-contact.html")

async def send_postulation_email_confirmation(title: str):
    # Create Message Schema
    message = MessageSchema(
        subject="Postulacion Confirmada",
        recipients=[settings.contact_recipient_email],
        template_body={
            "title": title
        },
        subtype=MessageType.html
    )
    # Send Email
    fm = FastMail(config)
    await fm.send_message(message, template_name="postulation-confirmation.html")