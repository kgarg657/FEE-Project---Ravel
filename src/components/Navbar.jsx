import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import theme from '../theme';

function Navbar({ onLogout }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        height: '48px',
        backgroundColor: theme.colors.bg,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Aligns user info and log out to the far right
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Right Action Cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* User Identity Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: theme.colors.surfaceHover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={14} color={theme.colors.textSecondary} />
          </div>

          <span style={{ color: theme.colors.textPrimary, fontSize: '13px', fontWeight: 500 }}>
            Ravel | J. Doe <span style={{ color: theme.colors.textMuted }}>(Senior Auditor)</span>
          </span>
        </div>

        {/* Clickable Log Out Button with Hover Transition */}
        <button
          onClick={onLogout}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isHovered ? theme.colors.accent : theme.colors.textSecondary,
            backgroundColor: isHovered ? theme.colors.surfaceHover : 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <LogOut size={15} />
          Log Out
        </button>

      </div>
    </div>
  );
}

export default Navbar;