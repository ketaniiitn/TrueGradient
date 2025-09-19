# TrueGradient Backend

Flask backend for the TrueGradient chat application.

## Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Run the application:
   ```bash
   python app.py
   ```

The server will start on `http://127.0.0.1:5000`

## API Endpoints

- `GET /health` - Health check
- `GET /api/test` - Test connection