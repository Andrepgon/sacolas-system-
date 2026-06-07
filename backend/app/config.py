from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    APP_ENV: str = "development"
    APP_NAME: str = "Sacolas API"

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str
    SUPABASE_JWT_SECRET: str  # pra validar tokens do frontend

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"


settings = Settings()
