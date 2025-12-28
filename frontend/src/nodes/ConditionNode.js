import React from 'react';
import BaseNode from './BaseNode';

const ConditionNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="condition"
      title="Condition"
      icon="⚡"
      color="#14b8a6"
      inputs={[{ id: 'input', color: '#14b8a6' }]}
      outputs={[
        { id: 'true', color: '#10b981', position: '30%' },
        { id: 'false', color: '#ef4444', position: '70%' }
      ]}
    >
      <div className="condition-node-content">
        <label>Condition Expression</label>
        <input
          type="text"
          value={data.expression || ''}
          onChange={(e) => data.onChange?.({ expression: e.target.value })}
          placeholder="e.g., value > 10"
          className="node-input-field"
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', fontSize: '12px' }}>
          <span style={{ color: '#10b981' }}>✓ True</span>
          <span style={{ color: '#ef4444' }}>✗ False</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default ConditionNode;

