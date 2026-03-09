from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    groq_api_key: Optional[str] = None
    claude_api_key: Optional[str] = None
    tavily_api_key: Optional[str] = None
    athena_api_base: AnyHttpUrl = "https://api.bettermeals.in"
    env: str = "dev"
    
    # Firestore settings
    firebase_creds_path: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore" 

settings = Settings()
