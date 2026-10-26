import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User } from 'lucide-react';
import { logout } from '../store/authSlice';
import theme from '../theme';

function Navbar({ onLogout }) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  // Read current logged-in user from Redux store with localStorage fallback
  const reduxUser = useSelector((state) => state.auth?.currentUser);
  const user = reduxUser || (() => {
    try {
      const raw = localStorage.getItem('ravel_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const displayName = user?.fullName || user?.name || 'J. Doe';
  const displayRole = user?.role || 'Senior Auditor';

  const handleLogoutClick = () => {
    localStorage.removeItem('ravel_user');
    localStorage.removeItem('ravel_auditor_id');
    localStorage.removeItem('ravel_keep_logged_in');
    dispatch(logout());
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div
      style={{
        height: '48px',
        backgroundColor: theme.colors.bg,
        borderBottom: `1px solid ${theme.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
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
            Ravel | {displayName} <span style={{ color: theme.colors.textMuted }}>({displayRole})</span>
          </span>
        </div>

        {/* Clickable Log Out Button */}
        <button
          onClick={handleLogoutClick}
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
