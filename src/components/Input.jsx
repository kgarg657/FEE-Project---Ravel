import theme from "../theme";

function Input({
  label,         // name of input field
  type = 'text',  // HTML input type 
  placeholder = '', // greyed-out hint text inside the box
  value,         // current text typed in the box
  onChange,      // fn that runs every time user types a character
  error = '',    // optional error message string to show below
  required = false // controls display of red * indicator
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '6px',
      marginBottom: '16px' 
    }}>
      {/* Render label only if label prop is passed */}
      {label && (
        <label style={{ 
          fontSize: '13px',
          color: theme.colors.textSecondary,
          fontWeight: 500
        }}>
          {label} {required && <span style={{ color: theme.colors.critical }}>*</span>}
        </label>
      )}

      {/* Actual HTML input element */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${error ? theme.colors.critical : theme.colors.border}`,
          borderRadius: '8px',
          padding: '10px 14px',
          color: theme.colors.textPrimary,
          fontSize: '14px',
          outline: 'none',
        }}
      />

      {/* Render error text under box if error prop exists */}
      {error && (
        <span style={{ fontSize: '12px', color: theme.colors.critical }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default Input;