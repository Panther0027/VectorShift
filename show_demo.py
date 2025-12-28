#!/usr/bin/env python3
"""
Interactive demonstration of the VectorShift Pipeline API
Shows detailed request/response for better understanding
"""
import requests
import json
import time

def print_section(title):
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_subsection(title):
    print(f"\n--- {title} ---")

def demo_api():
    base_url = "http://localhost:8000"
    
    print_section("VectorShift Pipeline API - Live Demonstration")
    
    # Load demo pipeline
    try:
        with open("demo_pipeline.json", "r") as f:
            demo_pipeline = json.load(f)
    except FileNotFoundError:
        print("[ERROR] demo_pipeline.json not found")
        return
    
    print_subsection("Demo Pipeline Structure")
    print(f"  Total Nodes: {len(demo_pipeline['nodes'])}")
    print(f"  Total Edges: {len(demo_pipeline['edges'])}")
    print("\n  Node Types:")
    for i, node in enumerate(demo_pipeline['nodes'], 1):
        print(f"    {i}. {node['type'].upper()} node (id: {node['id']})")
        if node['type'] == 'text' and 'value' in node['data']:
            text = node['data']['value']
            # Extract variables
            import re
            vars_found = re.findall(r'\[\[(\w+)\]\]', text)
            if vars_found:
                print(f"       Variables found: {', '.join(vars_found)}")
    
    print("\n  Edge Connections:")
    for i, edge in enumerate(demo_pipeline['edges'], 1):
        source_node = next(n for n in demo_pipeline['nodes'] if n['id'] == edge['source'])
        target_node = next(n for n in demo_pipeline['nodes'] if n['id'] == edge['target'])
        print(f"    {i}. {source_node['type']} -> {target_node['type']}")
    
    print_subsection("Sending Request to Backend")
    print(f"  URL: POST {base_url}/pipelines/parse")
    print(f"  Content-Type: application/json")
    print(f"  Payload size: {len(json.dumps(demo_pipeline))} bytes")
    
    try:
        print("\n  [Sending request...]")
        start_time = time.time()
        
        response = requests.post(
            f"{base_url}/pipelines/parse",
            json=demo_pipeline,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        elapsed = (time.time() - start_time) * 1000
        
        response.raise_for_status()
        result = response.json()
        
        print(f"  [Response received in {elapsed:.2f}ms]")
        print(f"  Status Code: {response.status_code}")
        
        print_subsection("Backend Analysis Results")
        print(f"\n  Number of Nodes: {result['num_nodes']}")
        print(f"  Number of Edges: {result['num_edge']}")
        print(f"  Is DAG: {result['is_dag']}")
        
        if result['is_dag']:
            print("\n  [SUCCESS] This pipeline is a valid Directed Acyclic Graph!")
            print("  -> No cycles detected")
            print("  -> Can be executed in topological order")
        else:
            print("\n  [WARNING] This pipeline contains cycles!")
            print("  -> Cannot be executed as a DAG")
            print("  -> May cause infinite loops")
        
        print_subsection("Full API Response")
        print(json.dumps(result, indent=2))
        
        print_subsection("How to Use in Frontend")
        print("\n  1. Open http://localhost:3000 in your browser")
        print("  2. You can:")
        print("     - Drag nodes from the sidebar")
        print("     - Connect them by dragging from output to input handles")
        print("     - Try the Text node with [[variable]] syntax")
        print("     - Click 'Submit Pipeline' to see these results")
        print("  3. Or import this demo_pipeline.json file using Ctrl+O")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("\n  [ERROR] Cannot connect to backend!")
        print("  Make sure the backend is running:")
        print("    cd backend")
        print("    python -m uvicorn main:app --reload")
        return False
    except requests.exceptions.RequestException as e:
        print(f"\n  [ERROR] Request failed: {e}")
        return False

if __name__ == "__main__":
    print("Waiting for backend to be ready...")
    time.sleep(1)
    demo_api()
    print("\n" + "=" * 70)
    print("  Demonstration Complete!")
    print("=" * 70 + "\n")

