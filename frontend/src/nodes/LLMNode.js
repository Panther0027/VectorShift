import React from 'react';
import BaseNode from './BaseNode';

const LLMNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="llm"
      title="LLM"
      icon="🤖"
      color="#8b5cf6"
      inputs={[{ id: 'input', color: '#8b5cf6' }]}
      outputs={[{ id: 'output', color: '#8b5cf6' }]}
    >
      <div className="llm-node-content">
        <label>Model</label>
        <select
          value={data.model || 'gpt-4'}
          onChange={(e) => data.onChange?.({ model: e.target.value })}
          className="node-select-field"
        >
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="claude">Claude</option>
        </select>
        <label style={{ marginTop: '12px' }}>Temperature</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={data.temperature || 0.7}
          onChange={(e) => data.onChange?.({ temperature: parseFloat(e.target.value) })}
          className="node-slider"
        />
        <span className="slider-value">{data.temperature || 0.7}</span>
      </div>
    </BaseNode>
  );
};

export default LLMNode;

