from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'TrueGradient Backend is running',
        'version': '1.0.0'
    }), 200

@app.route('/api/test', methods=['GET'])
def test_connection():
    """Test connection endpoint"""
    return jsonify({
        'message': 'Backend connection successful',
        'data': 'Hello from Flask!'
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)