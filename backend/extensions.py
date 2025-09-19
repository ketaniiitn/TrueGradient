from flask_jwt_extended import JWTManager
from pymongo import MongoClient, errors
from urllib.parse import urlparse
import logging

jwt = JWTManager()

mongo_client = None
mongo_db = None


def init_extensions(app):
    """Initialize JWT + Mongo with a connectivity check. Raises RuntimeError on failure."""
    global mongo_client, mongo_db
    jwt.init_app(app)

    mongo_uri = app.config['MONGO_URI']
    try:
        # Short timeouts for quick feedback; srv requires dnspython (added in requirements)
        mongo_client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
        )
        # Force connection attempt
        mongo_client.admin.command('ping')
    except errors.ServerSelectionTimeoutError as e:
        hint = []
        if mongo_uri.startswith('mongodb+srv://'):
            hint.append('Ensure dnspython is installed (pymongo[srv]) and your IP is whitelisted in Atlas.')
        else:
            hint.append('Is the Mongo service running on the specified host/port?')
        hint.append('Verify credentials & network access.')
        message = f"MongoDB connection failed for URI '{mongo_uri}': {e}. " + ' '.join(hint)
        logging.error(message)
        raise RuntimeError(message)

    # Derive DB name
    db_name = app.config.get('MONGO_DB_NAME')
    if not db_name:
        parsed = urlparse(mongo_uri)
        path = (parsed.path or '').strip('/')
        db_name = path or 'truegradient'

    mongo_db = mongo_client[db_name]
    app.db = mongo_db  # attach for easy access
    return mongo_db
