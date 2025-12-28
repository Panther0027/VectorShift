import React from 'react';
import BaseNode from './BaseNode';

const FilterNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="filter"
      title="Filter"
      icon="🔍"
      color="#06b6d4"
      inputs={[{ id: 'input', color: '#06b6d4' }]}
      outputs={[{ id: 'output', color: '#06b6d4' }, { id: 'rejected', color: '#ef4444', position: '70%' }]}
    >
      <div className="filter-node-content">
        <label>Filter Condition</label>
        <input
          type="text"
          value={data.condition || ''}
          onChange={(e) => data.onChange?.({ condition: e.target.value })}
          placeholder="Enter filter condition..."
          className="node-input-field"
        />
        <small style={{ marginTop: '8px', color: '#6b7280' }}>
          Items matching condition pass through output
        </small>
      </div>
    </BaseNode>
  );
};

export default FilterNode;

