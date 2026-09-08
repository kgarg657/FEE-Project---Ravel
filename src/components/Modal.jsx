import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import theme from '../theme';

function Modal({ isOpen, onClose, title, children, width = '520px' }) {
  // Lock background body scroll when the modal is open
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

  // Handle ESC key to close modal
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
        backgroundColor: 'rgba(15, 23, 42, 0.75)', // Dimmed slate backdrop
        backdropFilter: 'blur(4px)',               // Smooth background blur
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose} // Click backdrop to close
    >
      {/* Modal Dialog Box */}
      <div
        style={{
          width,
          maxWidth: '90vw',
          maxHeight: '85vh',
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicking modal content from closing backdrop
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
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

          {/* Close Icon Button */}
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

        {/* Scrollable Modal Body */}
        <div
          style={{
            padding: '20px',
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

export default Modal;