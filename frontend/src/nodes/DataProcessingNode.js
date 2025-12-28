import React from 'react';
import BaseNode from './BaseNode';

const DataProcessingNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="dataProcessing"
      title="Data Processing"
      icon="⚙️"
      color="#6366f1"
      inputs={[{ id: 'input', color: '#6366f1' }]}
      outputs={[{ id: 'output', color: '#6366f1' }]}
    >
      <div className="data-processing-node-content">
        <label>Operation</label>
        <select
          value={data.operation || 'sort'}
          onChange={(e) => data.onChange?.({ operation: e.target.value })}
          className="node-select-field"
        >
          <option value="sort">Sort</option>
          <option value="group">Group By</option>
          <option value="aggregate">Aggregate</option>
          <option value="deduplicate">Deduplicate</option>
        </select>
        {data.operation === 'group' && (
          <>
            <label style={{ marginTop: '12px' }}>Group By Field</label>
            <input
              type="text"
              value={data.groupField || ''}
              onChange={(e) => data.onChange?.({ groupField: e.target.value })}
              placeholder="Field name..."
              className="node-input-field"
            />
          </>
        )}
      </div>
    </BaseNode>
  );
};

export default DataProcessingNode;

