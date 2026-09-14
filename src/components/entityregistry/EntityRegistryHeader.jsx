import React from 'react';
import theme from '../../theme';

export default function EntityRegistryHeader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '4px',
        fontFamily: theme.fonts.sans,
      }}
    >
      <div style={{ textAlign: 'left' }}>
        <h1
          style={{
            color: theme.colors.textPrimary,
            margin: '0 0 4px 0',
            fontSize: '1.4rem',
            fontWeight: 700,
          }}
        >
          Entity Registry & Data
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: theme.colors.textSecondary, fontSize: '0.85rem' }}>
            Logged in: J. Doe (Senior Auditor)
          </span>
        </div>
      </div>
    </div>
  );
}