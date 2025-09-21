# Backend Dockerfile for TrueGradient
# Multi-stage to keep runtime image slim

FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# System deps (build essentials removed after build if installed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps separately to leverage caching
COPY requirements.txt ./requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy application source
COPY . .

# Expose backend port (use 5001 as requested)
EXPOSE 5001

# Environment defaults (can be overridden at runtime)
ENV PORT=5001 \
    FLASK_ENV=production

# Healthcheck (ping the /health endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:${PORT:-5001}/health || exit 1

# Use gunicorn for production serving
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5001", "--workers", "3", "--timeout", "90", "--log-level", "info"]
