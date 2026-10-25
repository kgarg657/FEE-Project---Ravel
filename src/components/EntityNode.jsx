import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  ArrowLeftRight,
  BadgeDollarSign,
  Landmark,
  Handshake,
  FileCheck2,
  ShieldAlert,
  UserRound,
  FileText,
} from 'lucide-react';

const iconByType = {
  account: Landmark,
  employee: UserRound,
  vendor: Handshake,
  invoice: FileCheck2,
  transaction: ArrowLeftRight,
  txn: ArrowLeftRight,
  shell: ShieldAlert,
  flagged: ShieldAlert,
  critical: ShieldAlert,
  entity: BadgeDollarSign,
};

function EntityNode({ data, selected }) {
  const type = data.type || 'entity';
  const normalizedType = type.toLowerCase();
  const tone = ['employee'].includes(normalizedType)
    ? 'blue'
    : ['vendor'].includes(normalizedType)
      ? 'green'
      : ['invoice'].includes(normalizedType)
        ? 'amber'
        : ['transaction', 'txn'].includes(normalizedType)
          ? 'violet'
        : ['shell', 'flagged', 'critical'].includes(normalizedType) ? 'red' : 'slate';
  const Icon = iconByType[normalizedType] || FileText;

  return (
    <div className={`entity-node entity-node-${tone} ${selected ? 'entity-node-selected' : ''}`} title={`${type}: ${data.label}`}>
      <Handle type="target" position={Position.Top} className="entity-handle" />
      <div className="entity-node-icon-shell">
        <div className="entity-node-icon">
          <Icon size={20} strokeWidth={1.7} />
        </div>
      </div>
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Bottom} className="entity-handle" />
    </div>
  );
}

export default EntityNode;
