import React from 'react';
import theme from '../theme';

const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line' // Options: 'line' | 'pill'
}) => {
  const isPill = variant === 'pill';

  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isPill ? '4px' : '20px',
        backgroundColor: isPill ? theme.colors.surface : 'transparent',
        borderBottom: isPill ? 'none' : `1px solid ${theme.colors.border}`,
        padding: isPill ? '4px' : '0',
        borderRadius: isPill ? '6px' : '0',
        fontFamily: theme.fonts.sans,
        userSelect: 'none'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              padding: isPill ? '6px 12px' : '10px 4px',
              backgroundColor: isPill && isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              border: isPill && isActive ? `1px solid ${theme.colors.accent}` : 'none',
              borderRadius: isPill ? '4px' : '0',
              color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary,
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme.colors.textPrimary;
                if (isPill) e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = theme.colors.textSecondary;
                if (isPill) e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}

            {/* Active Cyan Bottom Indicator (Line Variant) */}
            {!isPill && isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-1px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: theme.colors.accent,
                  borderRadius: '2px 2px 0 0'
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;