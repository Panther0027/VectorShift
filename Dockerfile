# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim AS backend

WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Final stage - serve frontend with backend
FROM python:3.11-slim

WORKDIR /app

# Copy backend
COPY --from=backend /app/backend ./backend

# Copy frontend build
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Install nginx to serve frontend
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Configure nginx
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /app/frontend/build; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://localhost:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/sites-available/default

# Start script
RUN echo '#!/bin/bash\n\
nginx &\n\
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
wait' > /start.sh && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]

