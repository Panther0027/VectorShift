# 🚀 How to Use VectorShift Pipeline Builder

## Quick Start Guide

### Step 1: Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
python -m uvicorn main:app --reload
```

**What you'll see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ **Backend is now running on:** http://localhost:8000

**Test it:** Open http://localhost:8000 in your browser - you should see:
```json
{"message": "VectorShift Backend API"}
```

---

### Step 2: Start the Frontend Server

Open a **NEW** terminal/command prompt and run:

```bash
cd frontend
npm start
```

**What you'll see:**
- The React app will compile (takes 30-60 seconds first time)
- Your browser should automatically open to http://localhost:3000
- If not, manually open: http://localhost:3000

✅ **Frontend is now running on:** http://localhost:3000

---

## 🎨 Using the Application

### Basic Workflow

1. **Drag Nodes from Sidebar**
   - Look at the left sidebar
   - You'll see nodes organized in categories:
     - **Basic Nodes:** Input, Output, Text
     - **AI Nodes:** LLM
     - **Processing Nodes:** Transform, Filter, Merge, Condition, Data Processing
   - Click and drag any node onto the canvas

2. **Connect Nodes**
   - Each node has **handles** (small circles on the sides)
   - **Output handles** (right side) = data flows OUT
   - **Input handles** (left side) = data flows IN
   - Click and drag from an output handle to an input handle to connect

3. **Configure Nodes**
   - Click on a node to see its configuration options
   - Different nodes have different settings:
     - **Input Node:** Enter input data
     - **Text Node:** Type text, use `[[variable]]` for variables
     - **LLM Node:** Select model and temperature
     - **Transform Node:** Choose transformation type
     - etc.

4. **Submit Pipeline**
   - Click the **"Submit Pipeline"** button at the bottom of the sidebar
   - You'll see an alert showing:
     - Number of nodes
     - Number of edges
     - Whether it's a valid DAG (Directed Acyclic Graph)

---

## 🎯 Feature Tutorials

### Tutorial 1: Create a Simple Pipeline

**Goal:** Create Input → Text → Output

1. Drag an **Input** node onto the canvas
2. Drag a **Text** node next to it
3. Drag an **Output** node after the Text node
4. Connect them:
   - Drag from Input's output handle (right) to Text's input handle (left)
   - Drag from Text's output handle (right) to Output's input handle (left)
5. Click **Submit Pipeline**
6. You should see: "3 nodes, 2 edges, Is DAG: Yes ✓"

---

### Tutorial 2: Text Node with Variables

**Goal:** Use the Text node's variable feature

1. Drag a **Text** node onto the canvas
2. Click on the Text node
3. In the text area, type: `Hello [[name]], welcome to [[place]]!`
4. **Watch what happens:**
   - Two new input handles appear on the left side!
   - One for `name`, one for `place`
   - The node shows: "Variables: name, place"
5. Now you can connect other nodes to these variable handles
6. Try connecting an Input node to the `name` handle

**Variable Rules:**
- Must be valid JavaScript variable names
- Format: `[[variableName]]`
- Examples: `[[user]]`, `[[data]]`, `[[score123]]`
- Invalid: `[[123abc]]`, `[[my-var]]` (no hyphens, can't start with number)

---

### Tutorial 3: Create a Complex Pipeline

**Goal:** Input → Text → LLM → Transform → Output

1. Drag these nodes in order:
   - Input
   - Text
   - LLM
   - Transform
   - Output
2. Connect them in sequence (each node's output to the next node's input)
3. Configure:
   - **Text node:** Type some text with `[[variable]]` if you want
   - **LLM node:** Select a model (GPT-4, GPT-3.5, etc.)
   - **Transform node:** Choose transformation (uppercase, lowercase, etc.)
4. Click **Submit Pipeline**
5. Result: "5 nodes, 4 edges, Is DAG: Yes ✓"

---

### Tutorial 4: Test DAG Validation (Cycle Detection)

**Goal:** Create a pipeline with a cycle to see validation fail

1. Create 3 nodes: Input → Text → Output
2. Connect them normally
3. **Now create a cycle:**
   - Connect Output back to Input
   - (This creates a loop)
4. Click **Submit Pipeline**
5. Result: "3 nodes, 3 edges, Is DAG: No ✗"
6. The alert will warn you about cycles!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` or `Backspace` | Delete selected nodes |
| `Ctrl+S` (Windows) / `Cmd+S` (Mac) | Export pipeline as JSON |
| `Ctrl+O` (Windows) / `Cmd+O` (Mac) | Import pipeline from JSON |

---

## 💾 Save and Load Pipelines

### Auto-Save
- Pipelines automatically save to your browser's localStorage
- When you refresh the page, your pipeline will still be there!

### Export Pipeline
1. Create your pipeline
2. Press `Ctrl+S` (or `Cmd+S` on Mac)
3. A JSON file will download
4. You can share this file or use it as a backup

### Import Pipeline
1. Press `Ctrl+O` (or `Cmd+O` on Mac)
2. Select a JSON file (like `demo_pipeline.json`)
3. Your pipeline will load!

### Clear Pipeline
1. Click the **"Clear"** button in the sidebar
2. Confirm when asked
3. Pipeline will be cleared

---

## 🎨 UI Features

### Sidebar
- **Node Palette:** Drag nodes from here
- **Submit Button:** Validate your pipeline
- **Action Buttons:** Export, Import, Clear
- **Pipeline Info:** Shows current node/edge count
- **Keyboard Shortcuts:** Help text at bottom

### Canvas
- **Pan:** Click and drag empty space
- **Zoom:** Use mouse wheel or controls
- **Select:** Click on nodes
- **Delete:** Select nodes and press Delete
- **MiniMap:** Bottom-right corner shows overview

### Node Controls
- **Move:** Click and drag nodes
- **Configure:** Click on node to see settings
- **Connect:** Drag from output to input handles
- **Delete:** Select and press Delete key

---

## 🔧 Troubleshooting

### Backend Not Working?
```bash
# Check if it's running
curl http://localhost:8000

# If not, restart it
cd backend
python -m uvicorn main:app --reload
```

### Frontend Not Loading?
- Wait 30-60 seconds for first compile
- Check terminal for errors
- Make sure port 3000 is not in use
- Try: `npm install` again

### Can't Connect Nodes?
- Make sure you're dragging from output (right) to input (left)
- Check that handles are visible (small circles)
- Some nodes may not have certain handles

### Submit Button Not Working?
- Make sure backend is running on port 8000
- Check browser console for errors (F12)
- Try refreshing the page

---

## 📝 Example Pipelines

### Example 1: Simple Data Flow
```
Input → Transform → Output
```
- Input: Enter some text
- Transform: Convert to uppercase
- Output: See the result

### Example 2: Text Processing
```
Input → Text (with [[vars]]) → LLM → Output
```
- Input: Provides data
- Text: Formats with variables
- LLM: Processes the text
- Output: Final result

### Example 3: Conditional Flow
```
Input → Condition → [True Branch] → Output
                  → [False Branch] → Output
```
- Condition node splits flow based on condition
- Two different outputs possible

---

## 🎯 Tips & Best Practices

1. **Start Simple:** Begin with 2-3 nodes, then add more
2. **Name Variables Clearly:** Use descriptive names like `[[userName]]` not `[[x]]`
3. **Check DAG Status:** Always submit to verify your pipeline is valid
4. **Save Often:** Export your work regularly
5. **Use MiniMap:** Helps navigate large pipelines
6. **Test Incrementally:** Add nodes one at a time and test

---

## 🚀 Next Steps

1. **Try the demo pipeline:**
   - Import `demo_pipeline.json` (Ctrl+O)
   - See a complete example

2. **Experiment:**
   - Try all 9 node types
   - Create different pipeline structures
   - Test edge cases (cycles, empty pipelines)

3. **Explore Features:**
   - Test variable extraction in Text nodes
   - Try different node configurations
   - Export and share pipelines

---

## 📞 Quick Reference

| Action | How To |
|--------|--------|
| Add Node | Drag from sidebar |
| Connect Nodes | Drag from output handle to input handle |
| Configure Node | Click on node |
| Delete Node | Select + Delete key |
| Submit Pipeline | Click "Submit Pipeline" button |
| Export | Ctrl+S / Cmd+S |
| Import | Ctrl+O / Cmd+O |
| Clear | Click "Clear" button |
| Zoom | Mouse wheel or controls |
| Pan | Click and drag canvas |

---

**Happy Pipeline Building! 🎉**

