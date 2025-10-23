from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Menyimpan semua konfigurasi aplikasi, dibaca dari file .env
    """
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # Memberitahu Pydantic untuk membaca dari file .env
    model_config = SettingsConfigDict(env_file=".env")

# Buat satu instance global yang akan dipakai di seluruh aplikasi
settings = Settings()
