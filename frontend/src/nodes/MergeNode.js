import React from 'react';
import BaseNode from './BaseNode';

const MergeNode = ({ data, id }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      type="merge"
      title="Merge"
      icon="🔀"
      color="#ec4899"
      inputs={[
        { id: 'input1', color: '#ec4899', position: '30%' },
        { id: 'input2', color: '#ec4899', position: '70%' }
      ]}
      outputs={[{ id: 'output', color: '#ec4899' }]}
    >
      <div className="merge-node-content">
        <label>Merge Strategy</label>
        <select
          value={data.strategy || 'concat'}
          onChange={(e) => data.onChange?.({ strategy: e.target.value })}
          className="node-select-field"
        >
          <option value="concat">Concatenate</option>
          <option value="union">Union</option>
          <option value="intersection">Intersection</option>
          <option value="zip">Zip</option>
        </select>
      </div>
    </BaseNode>
  );
};

export default MergeNode;

