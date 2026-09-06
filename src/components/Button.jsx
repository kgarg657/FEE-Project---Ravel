import theme from "../theme";

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
}) {
  const baseStyles = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 0.2s ease',
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.accent,
      color: theme.colors.bg,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      border: `1px solid ${theme.colors.border}`,
    },
    danger: {
      backgroundColor: theme.colors.critical,
      color: theme.colors.textPrimary,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {children}
    </button>
  );
}

export default Button;