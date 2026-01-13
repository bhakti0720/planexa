from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )
    
    google_api_key: str
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash-exp"
    backend_cors_origins: str = "*"

settings = Settings()
