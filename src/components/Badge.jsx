import React from 'react';
import theme from '../theme';

function Badge({ 
  children, 
  variant = 'default', // 'verified', 'suggested', 'flagged', 'critical', 'info', 'default'
  showDot = false, 
  size = 'md',        
  style = {} 
}) {
  // Map variants directly to central design tokens
  const variantStyles = {
    verified: {
      bg: `${theme.colors.success}1A`, //makes it semi transparent
      text: theme.colors.success,
      border: `${theme.colors.success}33`,
    },
    suggested: {
      bg: `${theme.colors.warning}1A`,
      text: theme.colors.warning,
      border: `${theme.colors.warning}33`,
    },
    flagged: {
      bg: `${theme.colors.critical}1A`,
      text: theme.colors.critical,
      border: `${theme.colors.critical}33`,
    },
    critical: {
      bg: `${theme.colors.critical}1A`,
      text: theme.colors.critical,
      border: `${theme.colors.critical}33`,
    },
    info: {
      bg: `${theme.colors.accent}1A`,
      text: theme.colors.accent,
      border: `${theme.colors.accent}33`,
    },
    default: {
      bg: theme.colors.surfaceHover,
      text: theme.colors.textSecondary,
      border: theme.colors.border,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '11px', dotSize: '5px' },
    md: { padding: '4px 10px', fontSize: '12px', dotSize: '6px' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: 600,
        borderRadius: '4px',
        backgroundColor: currentVariant.bg,
        color: currentVariant.text,
        border: `1px solid ${currentVariant.border}`,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
    >
      
      {showDot && (
        <span
          style={{
            width: currentSize.dotSize,
            height: currentSize.dotSize,
            borderRadius: '50%',
            backgroundColor: currentVariant.text,
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;