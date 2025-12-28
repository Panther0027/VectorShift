import React from 'react';
import BaseNode from './BaseNode';

const TransformNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="transform"
      title="Transform"
      icon="🔄"
      color="#f59e0b"
      inputs={[{ id: 'input', color: '#f59e0b' }]}
      outputs={[{ id: 'output', color: '#f59e0b' }]}
    >
      <div className="transform-node-content">
        <label>Transformation Type</label>
        <select
          value={data.transformation || 'uppercase'}
          onChange={(e) => data.onChange?.({ transformation: e.target.value })}
          className="node-select-field"
        >
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="reverse">Reverse</option>
          <option value="trim">Trim</option>
        </select>
      </div>
    </BaseNode>
  );
};

export default TransformNode;

