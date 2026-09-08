import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import theme from '../theme';

function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  width = '420px' 
}) {
  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Soft slate overlay backdrop
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end', // Aligns drawer panel to the right edge
      }}
      onClick={onClose}
    >
      {/* Sliding Right-Side Panel */}
      <div
        style={{
          width,
          maxWidth: '90vw',
          height: '100vh',
          backgroundColor: theme.colors.surface,
          borderLeft: `1px solid ${theme.colors.border}`,
          boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking drawer content
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.textPrimary,
            }}
          >
            {title}
          </h3>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textMuted)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            color: theme.colors.textSecondary,
            fontSize: '14px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;