# Deployment Guide

This guide covers different deployment options for the VectorShift Pipeline Builder.

## Option 1: Docker Compose (Recommended for Development)

The easiest way to run both frontend and backend together:

```bash
# Build and start both services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Option 2: Production Docker Build

Build a single production image:

```bash
# Build the image
docker build -t vectorshift-pipeline .

# Run the container
docker run -p 80:80 vectorshift-pipeline
```

The application will be available at http://localhost

## Option 3: Manual Deployment

### Backend Deployment

#### Using Uvicorn (Production)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Using Gunicorn (Recommended for Production)
```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

#### Build for Production
```bash
cd frontend
npm install
npm run build
```

The `build` folder contains static files that can be served by:
- **Nginx**: Copy `build` folder to `/var/www/html`
- **Apache**: Copy `build` folder to web root
- **Netlify/Vercel**: Connect your repo and set build command to `npm run build`
- **AWS S3 + CloudFront**: Upload `build` folder to S3 bucket

#### Environment Variables
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Option 4: Cloud Platform Deployment

### Heroku

#### Backend
```bash
cd backend
heroku create your-app-name
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
git push heroku main
```

#### Frontend
```bash
cd frontend
heroku create your-frontend-name
heroku buildpacks:set mars/create-react-app
git push heroku main
```

### Railway

1. Connect your GitHub repository
2. Select the backend folder for backend service
3. Select the frontend folder for frontend service
4. Set environment variables
5. Deploy!

### Render

#### Backend
- New Web Service
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### Frontend
- New Static Site
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

## Environment Configuration

### Backend (.env)
```env
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://your-frontend-url.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## CORS Configuration

Update `backend/main.py` to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-production-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## SSL/HTTPS

For production, always use HTTPS:
- Use a reverse proxy (Nginx, Apache) with Let's Encrypt
- Or use a platform that provides SSL (Heroku, Railway, Render)

## Monitoring

Consider adding:
- Health check endpoint: `GET /health`
- Logging middleware
- Error tracking (Sentry)
- Performance monitoring

## Scaling

- Backend: Use multiple workers with Gunicorn
- Frontend: Use CDN for static assets
- Database: Add if you need to persist pipelines (currently uses localStorage)

## Troubleshooting

### CORS Errors
- Ensure backend CORS settings include your frontend URL
- Check that API_URL environment variable is correct

### Connection Refused
- Verify backend is running and accessible
- Check firewall/security group settings
- Ensure ports are correctly exposed

### Build Failures
- Check Node.js and Python versions match requirements
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables

