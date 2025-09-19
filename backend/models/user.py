from datetime import datetime
from bson import ObjectId
from flask import current_app
from pymongo.errors import DuplicateKeyError


def get_collection():
    return current_app.db['users']


def create_indexes():
    col = get_collection()
    # Unique index on username
    col.create_index('username', unique=True)


def user_to_dict(doc):
    if not doc:
        return None
    return {
        'id': str(doc.get('_id')),
        'username': doc.get('username'),
        'created_at': doc.get('created_at').isoformat() if isinstance(doc.get('created_at'), datetime) else doc.get('created_at')
    }


def find_user_by_username(username: str):
    return get_collection().find_one({'username': username})


def find_user_by_id(user_id: str):
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    return get_collection().find_one({'_id': oid})


def create_user(username: str, password_hash: str):
    doc = {
        'username': username,
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    col = get_collection()
    try:
        result = col.insert_one(doc)
        doc['_id'] = result.inserted_id
        return doc, None
    except DuplicateKeyError:
        return None, 'Username already exists'
