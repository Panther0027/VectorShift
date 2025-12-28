import React from 'react';
import BaseNode from './BaseNode';

const OutputNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="output"
      title="Output"
      icon="📤"
      color="#ef4444"
      inputs={[{ id: 'input', color: '#ef4444' }]}
      outputs={[]}
    >
      <div className="output-node-content">
        <label>Output Result</label>
        <div className="output-display">
          {data.value || 'No output yet'}
        </div>
      </div>
    </BaseNode>
  );
};

export default OutputNode;

