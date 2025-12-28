# VectorShift Frontend Technical Assessment

A complete pipeline builder application built with React and FastAPI, featuring a node-based visual interface for creating and validating data pipelines.

## Features

### Part 1: Node Abstraction ✅
- Created a reusable `BaseNode` component that eliminates code duplication
- All nodes extend from the base abstraction, making it easy to create new node types
- 5 new demonstration nodes: Transform, Filter, Merge, Condition, and Data Processing

### Part 2: Styling ✅
- Modern, unified design with gradient backgrounds
- Responsive sidebar with node palette
- Beautiful node cards with hover effects
- Professional color scheme and typography

### Part 3: Text Node Logic ✅
- Dynamic width/height adjustment based on text input
- Variable extraction using `[[variableName]]` syntax
- Automatic handle creation for valid JavaScript variable names
- Real-time variable detection and display

### Part 4: Backend Integration ✅
- Frontend sends pipeline data to backend `/pipelines/parse` endpoint
- Backend calculates number of nodes and edges
- DAG (Directed Acyclic Graph) validation using topological sort
- User-friendly alert displaying results

## Project Structure

```
.
├── backend/
│   ├── main.py              # FastAPI backend server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── nodes/          # Node components
│   │   │   ├── BaseNode.js # Node abstraction
│   │   │   ├── InputNode.js
│   │   │   ├── OutputNode.js
│   │   │   ├── LLMNode.js
│   │   │   ├── TextNode.js # With dynamic variables
│   │   │   ├── TransformNode.js
│   │   │   ├── FilterNode.js
│   │   │   ├── MergeNode.js
│   │   │   ├── ConditionNode.js
│   │   │   └── DataProcessingNode.js
│   │   ├── App.js          # Main application
│   │   ├── App.css         # Main styles
│   │   ├── submit.js       # Backend integration
│   │   ├── nodeTypes.js    # Node type registry
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Create Nodes**: Drag nodes from the sidebar onto the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles
3. **Configure Nodes**: Click on nodes to configure their settings
4. **Text Variables**: In Text nodes, use `[[variableName]]` to create dynamic input handles
5. **Submit Pipeline**: Click the "Submit Pipeline" button to validate your pipeline

## Node Types

### Basic Nodes
- **Input**: Data input node
- **Output**: Data output node
- **Text**: Text processing with variable support

### AI Nodes
- **LLM**: Large Language Model node with model selection

### Processing Nodes
- **Transform**: Data transformation (uppercase, lowercase, etc.)
- **Filter**: Filter data based on conditions
- **Merge**: Merge multiple data streams
- **Condition**: Conditional branching (true/false outputs)
- **Data Processing**: Advanced data operations (sort, group, aggregate)

## API Endpoints

### POST `/pipelines/parse`
Validates a pipeline and returns analysis results.

**Request Body:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

## Technologies Used

- **Frontend**: React, ReactFlow, Axios
- **Backend**: Python, FastAPI, Uvicorn
- **Styling**: CSS3 with modern design patterns

## Extra Features ✨

Beyond the core requirements, the project includes:

- **Node Deletion**: Press Delete/Backspace to remove selected nodes
- **Save/Load**: Automatic localStorage persistence + Export/Import JSON files
- **Edge Validation**: Prevents invalid connections (self-loops, duplicates)
- **Keyboard Shortcuts**: 
  - `Delete/Backspace`: Delete selected nodes
  - `Ctrl+S / Cmd+S`: Export pipeline
  - `Ctrl+O / Cmd+O`: Import pipeline
- **Docker Support**: Full Docker and Docker Compose configuration
- **Error Handling**: Comprehensive validation and user feedback
- **Auto-save**: Pipeline automatically saves to browser storage

## Notes

- The Text node automatically creates input handles for variables defined with `[[variableName]]` syntax
- All nodes use the BaseNode abstraction for consistent styling and behavior
- The DAG validation ensures pipelines don't contain cycles
- The application features a modern, professional UI with smooth animations
- Pipelines are automatically saved to localStorage and can be exported as JSON

