from flask import Flask, jsonify
from flask_cors import CORS

from config import get_config
from extensions import init_extensions
from routes.auth.routes import auth_bp
from models.user import create_indexes


def create_app():
    app = Flask(__name__)
    # Permissive CORS for deployment: allow all origins and common methods.
    # Be cautious: in production you may want to restrict origins and enable credentials safely.
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])

    # Load configuration
    cfg = get_config()
    app.config.from_object(cfg)

    # Initialize extensions (Mongo, JWT)
    init_extensions(app)

    # Ensure indexes
    with app.app_context():
        create_indexes()

    # Register blueprints
    app.register_blueprint(auth_bp)

    # Basic routes
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'TrueGradient Backend is running',
            'version': '1.0.0'
        }), 200

    @app.route('/api/test', methods=['GET'])
    def test_connection():
        return jsonify({
            'message': 'Backend connection successful',
            'data': 'Hello from Flask!'
        }), 200

    return app


if __name__ == '__main__':
    application = create_app()
    application.run(host='127.0.0.1', port=5000, debug=application.config.get('DEBUG', False))
