from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from utils.security import hash_password, verify_password, validate_password
from models.user import (
    find_user_by_username,
    find_user_by_id,
    create_user,
    user_to_dict,
)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username:
            return jsonify({'error': 'Username is required'}), 400
        if not password:
            return jsonify({'error': 'Password is required'}), 400

        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400

        # Check existing
        if find_user_by_username(username):
            return jsonify({'error': 'Username already exists'}), 409

        password_hash = hash_password(password)
        doc, err = create_user(username, password_hash)
        if err:
            return jsonify({'error': err}), 409

        access_token = create_access_token(identity=str(doc['_id']))
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user_to_dict(doc)
        }), 201
    except Exception:
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json() or {}
        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user_doc = find_user_by_username(username)
        if not user_doc or not verify_password(user_doc['password_hash'], password):
            return jsonify({'error': 'Invalid username or password'}), 401

        access_token = create_access_token(identity=str(user_doc['_id']))
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user_to_dict(user_doc)
        }), 200
    except Exception:
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user_id = get_jwt_identity()
        user_doc = find_user_by_id(user_id)
        if not user_doc:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user_to_dict(user_doc)}), 200
    except Exception:
        return jsonify({'error': 'Failed to get profile'}), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logout successful'}), 200
