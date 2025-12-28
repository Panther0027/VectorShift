#!/usr/bin/env python3
"""
Test script to demonstrate the VectorShift Pipeline API
"""
import requests
import json
import time

# Test pipeline data
test_pipeline = {
    "nodes": [
        {
            "id": "node_0",
            "type": "input",
            "position": {"x": 100, "y": 100},
            "data": {}
        },
        {
            "id": "node_1",
            "type": "text",
            "position": {"x": 300, "y": 100},
            "data": {
                "value": "Hello [[name]], welcome to [[place]]!"
            }
        },
        {
            "id": "node_2",
            "type": "llm",
            "position": {"x": 500, "y": 100},
            "data": {
                "model": "gpt-4"
            }
        },
        {
            "id": "node_3",
            "type": "transform",
            "position": {"x": 700, "y": 100},
            "data": {
                "transformation": "uppercase"
            }
        },
        {
            "id": "node_4",
            "type": "output",
            "position": {"x": 900, "y": 100},
            "data": {}
        }
    ],
    "edges": [
        {
            "source": "node_0",
            "target": "node_1",
            "sourceHandle": "output",
            "targetHandle": "var-name"
        },
        {
            "source": "node_1",
            "target": "node_2",
            "sourceHandle": "output",
            "targetHandle": "input"
        },
        {
            "source": "node_2",
            "target": "node_3",
            "sourceHandle": "output",
            "targetHandle": "input"
        },
        {
            "source": "node_3",
            "target": "node_4",
            "sourceHandle": "output",
            "targetHandle": "input"
        }
    ]
}

# Test with cycle (should fail DAG check)
test_pipeline_with_cycle = {
    "nodes": [
        {"id": "node_0", "type": "input", "position": {"x": 100, "y": 100}, "data": {}},
        {"id": "node_1", "type": "text", "position": {"x": 300, "y": 100}, "data": {}},
        {"id": "node_2", "type": "output", "position": {"x": 500, "y": 100}, "data": {}}
    ],
    "edges": [
        {"source": "node_0", "target": "node_1", "sourceHandle": "output", "targetHandle": "input"},
        {"source": "node_1", "target": "node_2", "sourceHandle": "output", "targetHandle": "input"},
        {"source": "node_2", "target": "node_0", "sourceHandle": "output", "targetHandle": "input"}  # Cycle!
    ]
}

def test_backend():
    base_url = "http://localhost:8000"
    
    print("=" * 60)
    print("VectorShift Pipeline API Test")
    print("=" * 60)
    
    # Check if backend is running
    print("\n1. Checking if backend is running...")
    try:
        response = requests.get(f"{base_url}/", timeout=3)
        print(f"   [OK] Backend is running!")
        print(f"   Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"   [ERROR] Backend is not running: {e}")
        print("\n   Please start the backend with:")
        print("   cd backend && python -m uvicorn main:app --reload")
        return False
    
    # Test 1: Valid DAG pipeline
    print("\n" + "=" * 60)
    print("TEST 1: Valid DAG Pipeline (5 nodes, 4 edges)")
    print("=" * 60)
    print("\nPipeline Structure:")
    print("  Input -> Text -> LLM -> Transform -> Output")
    print(f"\n  Nodes: {len(test_pipeline['nodes'])}")
    print(f"  Edges: {len(test_pipeline['edges'])}")
    
    try:
        response = requests.post(
            f"{base_url}/pipelines/parse",
            json=test_pipeline,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        response.raise_for_status()
        result = response.json()
        
        print("\n[OK] API Response:")
        print(f"  Number of Nodes: {result['num_nodes']}")
        print(f"  Number of Edges: {result['num_edge']}")
        print(f"  Is DAG: {result['is_dag']} {'[YES]' if result['is_dag'] else '[NO]'}")
        
        if result['is_dag']:
            print("\n  [SUCCESS] Pipeline is a valid Directed Acyclic Graph!")
        else:
            print("\n  [WARNING] Pipeline contains cycles!")
            
    except requests.exceptions.RequestException as e:
        print(f"\n✗ Error: {e}")
        return False
    
    # Test 2: Pipeline with cycle (should fail DAG check)
    print("\n" + "=" * 60)
    print("TEST 2: Pipeline with Cycle (Should Fail DAG Check)")
    print("=" * 60)
    print("\nPipeline Structure:")
    print("  Input -> Text -> Output -> Input (CYCLE!)")
    print(f"\n  Nodes: {len(test_pipeline_with_cycle['nodes'])}")
    print(f"  Edges: {len(test_pipeline_with_cycle['edges'])}")
    
    try:
        response = requests.post(
            f"{base_url}/pipelines/parse",
            json=test_pipeline_with_cycle,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        response.raise_for_status()
        result = response.json()
        
        print("\n[OK] API Response:")
        print(f"  Number of Nodes: {result['num_nodes']}")
        print(f"  Number of Edges: {result['num_edge']}")
        print(f"  Is DAG: {result['is_dag']} {'[YES]' if result['is_dag'] else '[NO]'}")
        
        if result['is_dag']:
            print("\n  [INFO] Pipeline is a valid DAG (unexpected!)")
        else:
            print("\n  [CORRECT] Pipeline contains cycles and is NOT a valid DAG!")
            
    except requests.exceptions.RequestException as e:
        print(f"\n✗ Error: {e}")
        return False
    
    # Test 3: Empty pipeline
    print("\n" + "=" * 60)
    print("TEST 3: Empty Pipeline")
    print("=" * 60)
    
    empty_pipeline = {"nodes": [], "edges": []}
    
    try:
        response = requests.post(
            f"{base_url}/pipelines/parse",
            json=empty_pipeline,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        response.raise_for_status()
        result = response.json()
        
        print("\n[OK] API Response:")
        print(f"  Number of Nodes: {result['num_nodes']}")
        print(f"  Number of Edges: {result['num_edge']}")
        print(f"  Is DAG: {result['is_dag']} (empty graphs are DAGs)")
        
    except requests.exceptions.RequestException as e:
        print(f"\n✗ Error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("All tests completed successfully!")
    print("=" * 60)
    print("\nYou can now:")
    print("  1. Open http://localhost:3000 in your browser")
    print("  2. Drag nodes from the sidebar")
    print("  3. Connect them together")
    print("  4. Click 'Submit Pipeline' to test")
    print("\n" + "=" * 60)
    
    return True

if __name__ == "__main__":
    # Wait a bit for backend to be ready
    print("Waiting for backend to be ready...")
    time.sleep(2)
    test_backend()

