import React from 'react';
import { Handle, Position } from '@xyflow/react';

function EntityNode({ data, selected }) {
  const type = data.type || 'entity';
  const tone = ['employee', 'vendor', 'invoice', 'transaction', 'txn'].includes(type.toLowerCase())
    ? type.toLowerCase() === 'employee' ? 'blue' : type.toLowerCase() === 'vendor' ? 'green' : 'amber'
    : ['shell', 'flagged', 'critical'].includes(type.toLowerCase()) ? 'red' : 'slate';

  return (
    <div className={`entity-card entity-card-${tone} ${selected ? 'entity-card-selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="entity-handle" />
      <div className="entity-card-topline"><span className="entity-mark" /><span>{type}</span></div>
      <strong>{data.label}</strong>
      <small>{data.status || data.amount || 'Observed record'}</small>
      <Handle type="source" position={Position.Bottom} className="entity-handle" />
    </div>
  );
}

export default EntityNode;
