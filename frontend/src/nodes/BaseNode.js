import React from 'react';
import { Handle, Position } from 'reactflow';
import './BaseNode.css';

/**
 * Base Node Abstraction
 * This abstraction provides a reusable structure for all node types,
 * reducing code duplication and making it easy to create new nodes.
 */
const BaseNode = ({
  id,
  data,
  type,
  title,
  icon,
  color = '#667eea',
  inputs = [],
  outputs = [],
  children,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`base-node ${className}`}
      style={{ 
        borderColor: color,
        ...style 
      }}
    >
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={`input-${input.id || index}`}
          type="target"
          position={Position.Left}
          id={input.id || `input-${index}`}
          style={{
            top: input.position || `${(index + 1) * (100 / (inputs.length + 1))}%`,
            background: input.color || color,
            ...input.style
          }}
        />
      ))}

      {/* Node Header */}
      <div className="node-header" style={{ background: color }}>
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title || type}</span>
      </div>

      {/* Node Content */}
      <div className="node-content">
        {children}
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={`output-${output.id || index}`}
          type="source"
          position={Position.Right}
          id={output.id || `output-${index}`}
          style={{
            top: output.position || `${(index + 1) * (100 / (outputs.length + 1))}%`,
            background: output.color || color,
            ...output.style
          }}
        />
      ))}
    </div>
  );
};

export default BaseNode;

