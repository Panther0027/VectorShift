import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const submitPipeline = async (nodes, edges) => {
  try {
    const response = await axios.post(`${API_URL}/pipelines/parse`, {
      nodes: nodes,
      edges: edges
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting pipeline:', error);
    throw error;
  }
};

export const showPipelineResults = (results) => {
  const { num_nodes, num_edge, is_dag } = results;
  
  const message = `
Pipeline Analysis Results:

📊 Number of Nodes: ${num_nodes}
🔗 Number of Edges: ${num_edge}
✅ Is DAG: ${is_dag ? 'Yes ✓' : 'No ✗'}

${is_dag 
  ? 'Your pipeline is a valid Directed Acyclic Graph!' 
  : 'Warning: Your pipeline contains cycles and is not a valid DAG.'}
  `.trim();

  alert(message);
  
  // Also log to console for debugging
  console.log('Pipeline Results:', results);
};

