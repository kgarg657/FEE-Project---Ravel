// src/components/ToggleSwitch.jsx
import React from 'react';
import theme from '../theme';

const ToggleSwitch = ({ checked = false, onChange, label, disabled = false, size = 'md' }) => {
    const sizeMap = {
        sm: { track: 'w-7 h-4', thumb: 'w-3 h-3', shift: 'translate-x-3', text: 'text-xs' },
        md: { track: 'w-9 h-5', thumb: 'w-4 h-4', shift: 'translate-x-4', text: 'text-sm' },
        lg: { track: 'w-11 h-6', thumb: 'w-5 h-5', shift: 'translate-x-5', text: 'text-base' },
    };

    const { track, thumb, shift, text } = sizeMap[size] || sizeMap.md;

    const handleToggle = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    return (
        <label className={`inline-flex items-center gap-2.5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} select-none`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={handleToggle}
                className={`relative inline-flex flex-shrink-0 items-center p-0.5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${track}`}
                style={{
                    backgroundColor: checked ? theme.colors.accent : theme.colors.surfaceHover,
                    boxShadow: checked ? `0 0 8px ${theme.colors.accent}40` : 'none',
                }}
            >
                <span
                    className={`inline-block transform rounded-full transition-transform duration-200 ease-in-out ${thumb} ${checked ? shift : 'translate-x-0'}`}
                    style={{ backgroundColor: theme.colors.textPrimary }}
                />
            </button>
            {label && (
                <span className={`${text} font-sans transition-colors duration-200`} style={{ color: checked ? theme.colors.textPrimary : theme.colors.textSecondary }}>
                    {label}
                </span>
            )}
        </label>
    );
};

export default ToggleSwitch;