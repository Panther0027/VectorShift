import React from 'react';
import BaseNode from './BaseNode';

const InputNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="input"
      title="Input"
      icon="📥"
      color="#10b981"
      inputs={[]}
      outputs={[{ id: 'output', color: '#10b981' }]}
    >
      <div className="input-node-content">
        <label>Input Data</label>
        <input
          type="text"
          value={data.value || ''}
          onChange={(e) => data.onChange?.(e.target.value)}
          placeholder="Enter input..."
          className="node-input-field"
        />
      </div>
    </BaseNode>
  );
};

export default InputNode;

