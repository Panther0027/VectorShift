import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './nodeTypes';
import { submitPipeline, showPipelineResults } from './submit';
import './App.css';

// Get next node ID based on existing nodes
const getNextNodeId = (existingNodes) => {
  const maxId = existingNodes.reduce((max, node) => {
    const match = node.id.match(/node_(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      return Math.max(max, num);
    }
    return max;
  }, -1);
  return `node_${maxId + 1}`;
};

const STORAGE_KEY = 'vectorshift-pipeline';

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  // Load pipeline from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        if (savedNodes && savedEdges) {
          setNodes(savedNodes);
          setEdges(savedEdges);
        }
      } catch (e) {
        console.error('Error loading saved pipeline:', e);
      }
    }
  }, [setNodes, setEdges]);

  // Save pipeline to localStorage whenever it changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
    }
  }, [nodes, edges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Delete selected nodes
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedNodes.length > 0) {
        event.preventDefault();
        setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
        setEdges((eds) => 
          eds.filter(
            (edge) => 
              !selectedNodes.includes(edge.source) && 
              !selectedNodes.includes(edge.target)
          )
        );
        setSelectedNodes([]);
      }
      
      // Save (Ctrl+S / Cmd+S)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSavePipeline();
      }
      
      // Load (Ctrl+O / Cmd+O)
      if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
        event.preventDefault();
        handleLoadPipeline();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodes, nodes, edges, setNodes, setEdges]);

  // Track selected nodes
  const onSelectionChange = useCallback(({ nodes: selected }) => {
    setSelectedNodes(selected.map((n) => n.id));
  }, []);

  // Edge validation - prevent invalid connections
  const isValidConnection = useCallback((connection) => {
    // Prevent connecting a node to itself
    if (connection.source === connection.target) {
      return false;
    }
    
    // Prevent duplicate connections
    const existingEdge = edges.find(
      (e) => e.source === connection.source && 
            e.target === connection.target &&
            e.sourceHandle === connection.sourceHandle &&
            e.targetHandle === connection.targetHandle
    );
    
    return !existingEdge;
  }, [edges]);

  const onConnect = useCallback(
    (params) => {
      if (isValidConnection(params)) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        alert('Invalid connection: Cannot connect node to itself or duplicate connection exists');
      }
    },
    [setEdges, isValidConnection]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setNodes((nds) => {
        const newNode = {
          id: getNextNodeId(nds),
          type,
          position,
        data: {
          label: `${type} node`,
          onChange: (value) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNode.id
                  ? { ...node, data: { ...node.data, ...value } }
                  : node
              )
            );
          },
          onResize: (dimensions) => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === newNode.id
                  ? { 
                      ...node, 
                      style: { 
                        ...node.style,
                        width: dimensions.width,
                        height: dimensions.height
                      }
                    }
                  : node
              )
            );
          },
        },
        };
        return nds.concat(newNode);
      });
    },
    [reactFlowInstance, setNodes]
  );

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      alert('Please add at least one node to the pipeline');
      return;
    }
    
    try {
      const results = await submitPipeline(nodes, edges);
      showPipelineResults(results);
    } catch (error) {
      alert('Error submitting pipeline. Make sure the backend is running on http://localhost:8000');
      console.error(error);
    }
  };

  const handleSavePipeline = () => {
    const pipeline = { nodes, edges };
    const dataStr = JSON.stringify(pipeline, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipeline-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Pipeline exported successfully!');
  };

  const handleLoadPipeline = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const pipeline = JSON.parse(event.target.result);
            if (pipeline.nodes && pipeline.edges) {
              if (window.confirm('This will replace your current pipeline. Continue?')) {
                setNodes(pipeline.nodes);
                setEdges(pipeline.edges);
                alert('Pipeline loaded successfully!');
              }
            } else {
              alert('Invalid pipeline file format');
            }
          } catch (error) {
            alert('Error loading pipeline file: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearPipeline = () => {
    if (window.confirm('Are you sure you want to clear the entire pipeline?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem(STORAGE_KEY);
      alert('Pipeline cleared!');
    }
  };

  const nodeCategories = [
    {
      title: 'Basic Nodes',
      nodes: [
        { type: 'input', label: 'Input', icon: '📥' },
        { type: 'output', label: 'Output', icon: '📤' },
        { type: 'text', label: 'Text', icon: '📝' },
      ],
    },
    {
      title: 'AI Nodes',
      nodes: [
        { type: 'llm', label: 'LLM', icon: '🤖' },
      ],
    },
    {
      title: 'Processing Nodes',
      nodes: [
        { type: 'transform', label: 'Transform', icon: '🔄' },
        { type: 'filter', label: 'Filter', icon: '🔍' },
        { type: 'merge', label: 'Merge', icon: '🔀' },
        { type: 'condition', label: 'Condition', icon: '⚡' },
        { type: 'dataProcessing', label: 'Data Processing', icon: '⚙️' },
      ],
    },
  ];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>VectorShift</h2>
          <p className="subtitle">Pipeline Builder</p>
        </div>
        
        <div className="node-palette">
          {nodeCategories.map((category, idx) => (
            <div key={idx} className="node-category">
              <h3 className="category-title">{category.title}</h3>
              <div className="node-buttons">
                {category.nodes.map((node) => (
                  <button
                    key={node.type}
                    className="node-button"
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', node.type);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                    draggable
                  >
                    <span className="node-button-icon">{node.icon}</span>
                    <span className="node-button-label">{node.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="submit-section">
          <button className="submit-button" onClick={handleSubmit}>
            <span>🚀</span>
            Submit Pipeline
          </button>
          
          <div className="action-buttons">
            <button className="action-button" onClick={handleSavePipeline} title="Save pipeline (Ctrl+S)">
              <span>💾</span> Export
            </button>
            <button className="action-button" onClick={handleLoadPipeline} title="Load pipeline (Ctrl+O)">
              <span>📂</span> Import
            </button>
            <button className="action-button danger" onClick={handleClearPipeline} title="Clear pipeline">
              <span>🗑️</span> Clear
            </button>
          </div>
          
          <div className="pipeline-info">
            <p>Nodes: {nodes.length}</p>
            <p>Edges: {edges.length}</p>
            {selectedNodes.length > 0 && (
              <p className="selected-info">Selected: {selectedNodes.length}</p>
            )}
          </div>
          
          <div className="keyboard-shortcuts">
            <small>Shortcuts: Del (delete), Ctrl+S (save), Ctrl+O (load)</small>
          </div>
        </div>
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          isValidConnection={isValidConnection}
          nodeTypes={nodeTypes}
          fitView
          className="react-flow-wrapper"
          deleteKeyCode="Delete"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const colors = {
                input: '#10b981',
                output: '#ef4444',
                llm: '#8b5cf6',
                text: '#3b82f6',
                transform: '#f59e0b',
                filter: '#06b6d4',
                merge: '#ec4899',
                condition: '#14b8a6',
                dataProcessing: '#6366f1',
              };
              return colors[node.type] || '#667eea';
            }}
          />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;

