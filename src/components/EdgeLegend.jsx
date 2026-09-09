import React from 'react';
import theme from '../theme';

function EdgeLegend() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '6px',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Approved Line Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '28px', height: '2px', backgroundColor: theme.colors.accent }} />
        <span style={{ fontSize: '12px', color: theme.colors.textSecondary, fontWeight: 500 }}>
          Approved
        </span>
      </div>

      {/* Suggested Line Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '28px', height: '0px', borderTop: `2px dashed ${theme.colors.textMuted}` }} />
        <span style={{ fontSize: '12px', color: theme.colors.textSecondary, fontWeight: 500 }}>
          Suggested
        </span>
      </div>
    </div>
  );
}

export default EdgeLegend;