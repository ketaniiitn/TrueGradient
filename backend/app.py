from flask import Flask, jsonify
from flask_cors import CORS
import os

from config import get_config
from extensions import init_extensions
from routes.auth.routes import auth_bp
from models.user import create_indexes


def create_app():
    app = Flask(__name__)
    # NOTE: credentials + wildcard origin is not allowed by browsers; if you later need cookies/auth headers
    # replace "*" with an explicit list or regex of your frontend origins.
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

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

    # Basic routes / health checks
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

# Expose a module-level app instance for WSGI servers (Gunicorn, etc.)
app = create_app()

if __name__ == '__main__':
    # Local/dev execution fallback. In production use Gunicorn.
    # Default port changed to 5001 for Docker / compose alignment.
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=app.config.get('DEBUG', False))
