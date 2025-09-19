import os
from datetime import timedelta
from dotenv import load_dotenv

# Ensure .env is loaded before reading environment variables
load_dotenv()


class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-string-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    MONGO_URI = os.environ.get('DATABASE_URL') 
    MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
    ENV = os.environ.get('FLASK_ENV', 'development')
    DEBUG = ENV == 'development'


def get_config():
    return BaseConfig()
