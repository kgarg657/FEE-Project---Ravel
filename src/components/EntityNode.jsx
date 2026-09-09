import React from 'react';
import { Handle, Position } from '@xyflow/react';
import theme from '../theme';

function EntityNode({ data, selected }) {
  // Directly pull entity colors defined in theme.js
  const getCategoryStyles = (type) => {
    switch (type?.toLowerCase()) {
      case 'employee':
        return { 
          bg: theme.colors.employeeBlue, 
          border: theme.colors.accent 
        };
      case 'vendor':
        return { 
          bg: theme.colors.vendorGreen, 
          border: '#34D399' 
        };
      case 'invoice':
      case 'transaction':
      case 'txn':
        return { 
          bg: theme.colors.invoiceOrange, 
          border: '#FBBF24' 
        };
      case 'shell':
      case 'flagged':
      case 'critical':
        return { 
          bg: theme.colors.shellRed, 
          border: '#F87171' 
        };
      default:
        return { 
          bg: theme.colors.textMuted, 
          border: theme.colors.border 
        };
    }
  };

  const style = getCategoryStyles(data.type);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        backgroundColor: style.bg,
        border: `2px solid ${selected ? theme.colors.textPrimary : style.border}`,
        boxShadow: selected
          ? `0 0 0 4px rgba(6, 182, 212, 0.4), 0 8px 16px rgba(0, 0, 0, 0.5)`
          : '0 4px 12px rgba(0, 0, 0, 0.4)',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        padding: '8px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: theme.fonts.sans,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: 'transparent', border: 'none' }} />
      <span style={{ fontSize: '10px', opacity: 0.85, textTransform: 'capitalize' }}>
        {data.type}:
      </span>
      <span style={{ marginTop: '2px', wordBreak: 'break-word', lineHeight: '1.2' }}>
        {data.label}
      </span>
      <Handle type="source" position={Position.Bottom} style={{ background: 'transparent', border: 'none' }} />
    </div>
  );
}

export default EntityNode;