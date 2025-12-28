import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from './BaseNode';
import './TextNode.css';

const TextNode = ({ data, id }) => {
  const [text, setText] = useState(data.value || '');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const MIN_WIDTH = 250;
  const MIN_HEIGHT = 100;

  // Extract variables from text (format: [[variableName]])
  useEffect(() => {
    const variableRegex = /\[\[([a-zA-Z_$][a-zA-Z0-9_$]*)\]\]/g;
    const matches = [...text.matchAll(variableRegex)];
    const extractedVars = matches.map(match => ({
      name: match[1],
      fullMatch: match[0],
      isValid: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(match[1])
    }));

    // Remove duplicates and keep only valid variable names
    const uniqueVars = Array.from(
      new Map(extractedVars.filter(v => v.isValid).map(v => [v.name, v])).values()
    );

    setVariables(uniqueVars);
    
    // Update data
    if (data.onChange) {
      data.onChange({ value: text, variables: uniqueVars.map(v => v.name) });
    }
  }, [text, data]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to calculate scroll height
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.max(MIN_HEIGHT, scrollHeight + 20);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Calculate width based on content (with max limit)
      const textLength = text.length;
      const calculatedWidth = Math.min(Math.max(MIN_WIDTH, textLength * 8 + 50), 400);
      
      // Update node dimensions
      if (data.onResize) {
        data.onResize({ 
          height: newHeight,
          width: calculatedWidth 
        });
      }
    }
  }, [text, data]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div 
      className="text-node-wrapper"
      style={{
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT
      }}
    >
      {/* Dynamic Input Handles for Variables */}
      {variables.map((variable, index) => (
        <Handle
          key={`var-${variable.name}`}
          type="target"
          position={Position.Left}
          id={`var-${variable.name}`}
          style={{
            top: `${(index + 1) * (100 / (variables.length + 1))}%`,
            background: '#3b82f6',
            border: '2px solid white'
          }}
        />
      ))}

      <BaseNode
        id={id}
        data={data}
        type="text"
        title="Text"
        icon="📝"
        color="#3b82f6"
        inputs={[]}
        outputs={[{ id: 'output', color: '#3b82f6' }]}
        style={{
          minHeight: MIN_HEIGHT
        }}
      >
        <div className="text-node-content">
          <label>Text Input</label>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text... Use [[variableName]] for variables"
            className="text-node-textarea"
            style={{
              minHeight: MIN_HEIGHT - 60,
              resize: 'vertical'
            }}
          />
          {variables.length > 0 && (
            <div className="variables-list">
              <small>Variables: {variables.map(v => v.name).join(', ')}</small>
            </div>
          )}
        </div>
      </BaseNode>
    </div>
  );
};

export default TextNode;

