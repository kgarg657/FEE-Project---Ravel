// src/components/Checkbox.jsx
import React from 'react';
import theme from '../theme';

const Checkbox = ({
    checked = false,
    onChange,
    label = '',
    disabled = false,
    id,
}) => {
    const handleChange = (e) => {
        if (!disabled && onChange) {
            onChange(e.target.checked);
        }
    };

    return (
        <label
            htmlFor={id}
            className={`inline-flex items-center gap-2.5 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
        >
            <div className="relative flex items-center justify-center">
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                    className="peer sr-only"
                />
                <div
                    className="w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center"
                    style={{
                        backgroundColor: checked ? theme.colors.accent : 'transparent',
                        borderColor: checked ? theme.colors.accent : theme.colors.border,
                        boxShadow: checked ? `0 0 6px ${theme.colors.accent}40` : 'none',
                    }}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 stroke-current"
                            style={{ color: '#FFFFFF' }}
                            viewBox="0 0 12 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 5L4.5 8L10.5 1.5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {label && (
                <span
                    className="text-sm font-sans transition-colors duration-150"
                    style={{
                        color: checked ? theme.colors.textPrimary : theme.colors.textSecondary,
                    }}
                >
                    {label}
                </span>
            )}
        </label>
    );
};

export default Checkbox;