from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    db_username: str
    db_password: str
    db_host: str
    db_name: str
    smtp_username: str
    smtp_password: str
    smtp_mail_from: str
    jwt_secret_key: str
    front_end_domain: str
    wkhtmltopdf_exe_path: str
    contact_recipient_email: str

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings():
    return Settings()