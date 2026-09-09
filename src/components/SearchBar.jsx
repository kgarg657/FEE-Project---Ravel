import React, { useState } from 'react';
import theme from '../theme';

const SearchBar = ({
    value = '',
    onChange,
    onSearch,
    placeholder = 'Search entities...',
    style = {},
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Dynamic Theme extraction with fallbacks
    const colors = theme?.colors || {};
    const fonts = theme?.fonts || {};

    const bgSurface = colors.surface || '#1E293B';
    const borderColor = colors.border || '#334155';
    const accentColor = colors.accent || '#06B6D4';
    const textPrimary = colors.textPrimary || '#F8FAFC';
    const textMuted = colors.textMuted || '#64748B';

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange({ target: { value: '' } });
        }
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div
            className={`searchbar-wrapper ${className}`}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                width: '220px',
                fontFamily: fonts.sans || 'Inter, sans-serif',
                ...style
            }}
        >
            {/* Search Icon (Magnifying Glass) */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isFocused ? accentColor : textMuted}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    position: 'absolute',
                    left: '10px',
                    width: '14px',
                    height: '14px',
                    pointerEvents: 'none',
                    transition: 'stroke 0.2s ease'
                }}
            >
                <circle cx={11} cy={11} r={8} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>

            {/* Input Field */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                aria-label="Search entities"
                style={{
                    width: '100%',
                    height: '32px',
                    paddingLeft: '30px',
                    paddingRight: value ? '28px' : '10px',
                    backgroundColor: 'rgba(30, 41, 59, 0.65)',
                    border: `1px solid ${isFocused ? accentColor : borderColor}`,
                    borderRadius: '4px',
                    color: textPrimary,
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: isFocused ? `0 0 0 2px ${accentColor}33` : 'none',
                    transition: 'all 0.2s ease'
                }}
            />

            {/* Clear Button (X) */}
            {Boolean(value) && (
                <button
                    type="button"
                    onClick={handleClear}
                    title="Clear search"
                    aria-label="Clear search"
                    style={{
                        position: 'absolute',
                        right: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '3px',
                        color: textMuted,
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: '12px', height: '12px' }}
                    >
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;