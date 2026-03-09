"""
Unified Configuration Manager for SuperMeals.ai

Centralized configuration that:
- Loads secrets from SecretsManager
- Handles environment variables
- Validates config integrity
"""

import os
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass, field
from enum import Enum

from .secrets import secrets_manager

logger = logging.getLogger(__name__)

class Environment(Enum):
    """Supported environments"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

@dataclass
class DatabaseConfig:
    """Database configuration"""
    firebase_creds: Dict[str, Any]
    storage_bucket: str = "bettermeals-f47b8.firebasestorage.app"
    web_api_key: Optional[str] = None

@dataclass
class ServerConfig:
    """Server configuration"""
    debug: bool = False
    log_level: str = "INFO"
    environment: Environment = Environment.DEVELOPMENT
    athena_api_url: str = "http://athena-prod-dev.ap-south-1.elasticbeanstalk.com"
    # Add other server settings as needed (host, port mainly relevance for web apps)

@dataclass
class UnifiedConfig:
    """Unified configuration container"""
    database: DatabaseConfig
    server: ServerConfig
    # Add other sections (AWS, LLM) as needed

class ConfigurationError(Exception):
    """Raised when configuration is invalid or missing"""
    pass

class UnifiedConfigManager:
    """
    Unified configuration manager that handles all configuration needs.
    """
    
    def __init__(self):
        self._config_cache: Optional[UnifiedConfig] = None
        self._environment = self._detect_environment()
        
    def _detect_environment(self) -> Environment:
        """Detect the current environment"""
        env_str = os.getenv('ENVIRONMENT', 'development').lower()
        try:
            return Environment(env_str)
        except ValueError:
            logger.warning(f"Unknown environment '{env_str}', defaulting to development")
            return Environment.DEVELOPMENT

    def get_config(self) -> UnifiedConfig:
        """Get the unified configuration, loading from cache if available."""
        if self._config_cache is None:
            self._config_cache = self._load_config()
        return self._config_cache

    def _load_config(self) -> UnifiedConfig:
        """Load configuration from all sources and validate."""
        logger.info(f"Loading configuration for environment: {self._environment.value}")
        
        # 1. Server Config
        server_config = ServerConfig(
            debug=os.getenv('DEBUG', 'false').lower() == 'true',
            log_level=os.getenv('LOG_LEVEL', 'INFO'),
            environment=self._environment,
            athena_api_url=os.getenv('ATHENA_API_URL', 'http://athena-prod-dev.ap-south-1.elasticbeanstalk.com')
        )

        # 2. Database Config (Firebase)
        try:
            # This logic inside secrets_manager handles all the complexity
            # (Secrets Manager, Env Vars, File Paths, Base64)
            firebase_creds = secrets_manager.get_firebase_credentials()
            web_api_key = secrets_manager.get_firebase_web_api_key()
            
            database_config = DatabaseConfig(
                firebase_creds=firebase_creds,
                storage_bucket=os.getenv('FIREBASE_STORAGE_BUCKET', 'bettermeals-f47b8.firebasestorage.app'),
                web_api_key=web_api_key
            )
        except ValueError as e:
            # If we are in dev, maybe we can survive without it? 
            # But the agent relies on it, so we should probably fail or warn.
            logger.error(f"Failed to load Firebase credentials: {e}")
            raise ConfigurationError(f"Critical configuration missing: {e}")

        return UnifiedConfig(
            database=database_config,
            server=server_config
        )

# Global instance
config_manager = UnifiedConfigManager()
