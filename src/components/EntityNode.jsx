import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  ArrowLeftRight,
  Building2,
  CircleDot,
  FileText,
  ReceiptText,
  ShieldAlert,
  UserRound,
} from 'lucide-react';

const iconByType = {
  account: CircleDot,
  employee: UserRound,
  vendor: Building2,
  invoice: ReceiptText,
  transaction: ArrowLeftRight,
  txn: ArrowLeftRight,
  shell: ShieldAlert,
  flagged: ShieldAlert,
  critical: ShieldAlert,
  entity: FileText,
};

function EntityNode({ data, selected }) {
  const type = data.type || 'entity';
  const normalizedType = type.toLowerCase();
  const tone = ['employee'].includes(normalizedType)
    ? 'blue'
    : ['vendor'].includes(normalizedType)
      ? 'green'
      : ['invoice', 'transaction', 'txn'].includes(normalizedType)
        ? 'amber'
        : ['shell', 'flagged', 'critical'].includes(normalizedType) ? 'red' : 'slate';
  const Icon = iconByType[normalizedType] || FileText;

  return (
    <div className={`entity-node entity-node-${tone} ${selected ? 'entity-node-selected' : ''}`} title={`${type}: ${data.label}`}>
      <Handle type="target" position={Position.Top} className="entity-handle" />
      <div className="entity-node-icon-shell">
        <div className="entity-node-icon"><Icon size={20} strokeWidth={1.7} /></div>
      </div>
      <strong>{data.label}</strong>
      <span className="entity-node-type">{type}</span>
      <small>{data.status || data.amount || 'Observed record'}</small>
      <Handle type="source" position={Position.Bottom} className="entity-handle" />
    </div>
  );
}

export default EntityNode;
