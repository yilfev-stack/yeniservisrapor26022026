from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    app_name: str = 'DEMART Servis Raporu API'
    mongodb_uri: str = 'mongodb://mongodb:27017'
    mongodb_db: str = 'demart'
    minio_endpoint: str = 'minio:9000'
    minio_access_key: str = 'minioadmin'
    minio_secret_key: str = 'minioadmin'
    redis_url: str = 'redis://redis:6379/0'
    jwt_secret: str = 'change-me'


settings = Settings()
