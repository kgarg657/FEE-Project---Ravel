import React from 'react';
import { useSelector } from 'react-redux';
import theme from '../../theme';

export default function EntityRegistryHeader() {
  const reduxUser = useSelector((state) => state.auth?.currentUser);
  const user = reduxUser || (() => {
    try {
      const raw = localStorage.getItem('ravel_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();
  const displayName = user?.fullName || user?.name || 'Auditor';
  const displayRole = user?.role || 'Senior Auditor';

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
            Logged in: {displayName} ({displayRole})
          </span>
        </div>
      </div>
    </div>
  );
}
