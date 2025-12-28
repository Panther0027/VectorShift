# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The backend will start on `http://localhost:8000`

### 2. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Testing the Application

1. **Create a Pipeline:**
   - Drag nodes from the sidebar onto the canvas
   - Connect nodes by dragging from output handles to input handles

2. **Test Text Node Variables:**
   - Add a Text node
   - Type text with variables like: `Hello [[name]], welcome to [[place]]!`
   - Notice how input handles are automatically created for `name` and `place`

3. **Submit Pipeline:**
   - Create a pipeline with multiple nodes and connections
   - Click the "Submit Pipeline" button
   - You should see an alert with:
     - Number of nodes
     - Number of edges
     - Whether it's a valid DAG

## Troubleshooting

### Backend not connecting?
- Make sure the backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify the API URL in `frontend/src/submit.js`

### Frontend not starting?
- Make sure all dependencies are installed: `npm install`
- Check if port 3000 is available
- Try clearing node_modules and reinstalling: `rm -rf node_modules && npm install`

### Nodes not appearing?
- Check browser console for errors
- Verify all node files are in `frontend/src/nodes/`
- Make sure `nodeTypes.js` exports all node types

## API Testing

You can test the backend API directly:

```bash
curl -X POST "http://localhost:8000/pipelines/parse" \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [{"id": "1"}, {"id": "2"}],
    "edges": [{"source": "1", "target": "2"}]
  }'
```

Expected response:
```json
{
  "num_nodes": 2,
  "num_edge": 1,
  "is_dag": true
}
```

