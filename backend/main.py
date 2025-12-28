from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sort algorithm.
    """
    if not nodes or not edges:
        return True
    
    # Create adjacency list
    node_ids = {node['id'] for node in nodes}
    graph = {node_id: [] for node_id in node_ids}
    in_degree = {node_id: 0 for node_id in node_ids}
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in node_ids and target in node_ids:
            graph[source].append(target)
            in_degree[target] = in_degree.get(target, 0) + 1
    
    # Find all nodes with no incoming edges
    queue = [node_id for node_id in node_ids if in_degree[node_id] == 0]
    processed = 0
    
    # Process nodes
    while queue:
        node = queue.pop(0)
        processed += 1
        
        # Reduce in-degree of neighbors
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG
    return processed == len(node_ids)

@app.post("/pipelines/parse")
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse pipeline and return number of nodes, edges, and whether it's a DAG.
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag_result = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edge": num_edges,
        "is_dag": is_dag_result
    }

@app.get("/")
async def root():
    return {"message": "VectorShift Backend API"}

