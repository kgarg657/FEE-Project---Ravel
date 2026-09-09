// import React, { useState, useRef, useEffect } from 'react';
// import theme from '../theme';

// const Select = ({
//     value = '',
//     onChange,
//     options = [],
//     placeholder = 'Select option...',
//     style = {},
//     className = ''
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef(null);

//     // Extracting colors and fonts from theme.js
//     const colors = theme?.colors || {};
//     const fonts = theme?.fonts || {};

//     const bgSurface = colors.surface || '#1E293B';
//     const bgHover = colors.surfaceHover || '#334155';
//     const borderColor = colors.border || '#334155';
//     const accentColor = colors.accent || '#06B6D4';
//     const textPrimary = colors.textPrimary || '#F8FAFC';
//     const textSecondary = colors.textSecondary || '#94A3B8';
//     const textMuted = colors.textMuted || '#64748B';

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const selectedOption = options.find((opt) => opt.value === value);

//     const handleSelect = (optionValue) => {
//         if (onChange) {
//             onChange({ target: { value: optionValue } });
//         }
//         setIsOpen(false);
//     };

//     return (
//         <div
//             ref={dropdownRef}
//             className={`custom-select-wrapper ${className}`}
//             style={{
//                 position: 'relative',
//                 display: 'inline-flex',
//                 width: '180px',
//                 fontFamily: fonts.sans || 'Inter, sans-serif',
//                 ...style
//             }}
//         >
//             {/* Select Trigger Box */}
//             <button
//                 type="button"
//                 onClick={() => setIsOpen(!isOpen)}
//                 aria-haspopup="listbox"
//                 aria-expanded={isOpen}
//                 style={{
//                     width: '100%',
//                     height: '32px',
//                     paddingLeft: '12px',
//                     paddingRight: '28px',
//                     backgroundColor: 'rgba(30, 41, 59, 0.65)',
//                     border: `1px solid ${isOpen ? accentColor : borderColor}`,
//                     borderRadius: '4px',
//                     color: selectedOption ? textPrimary : textMuted,
//                     fontSize: '0.8rem',
//                     fontFamily: 'inherit',
//                     outline: 'none',
//                     textAlign: 'left',
//                     cursor: 'pointer',
//                     boxSizing: 'border-box',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     boxShadow: isOpen ? `0 0 0 2px ${accentColor}33` : 'none',
//                     transition: 'all 0.2s ease'
//                 }}
//             >
//                 <span
//                     style={{
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis'
//                     }}
//                 >
//                     {selectedOption ? selectedOption.label : placeholder}
//                 </span>

//                 {/* Chevron Arrow Icon */}
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke={isOpen ? accentColor : textSecondary}
//                     strokeWidth={2}
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     style={{
//                         position: 'absolute',
//                         right: '8px',
//                         width: '14px',
//                         height: '14px',
//                         pointerEvents: 'none',
//                         transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//                         transition: 'transform 0.2s ease, stroke 0.2s ease'
//                     }}
//                 >
//                     <polyline points="6 9 12 15 18 9" />
//                 </svg>
//             </button>

//             {/* Dropdown Options List */}
//             {isOpen && (
//                 <ul
//                     role="listbox"
//                     style={{
//                         position: 'absolute',
//                         top: 'calc(100% + 4px)',
//                         left: 0,
//                         width: '100%',
//                         maxHeight: '200px',
//                         overflowY: 'auto',
//                         backgroundColor: bgSurface,
//                         border: `1px solid ${borderColor}`,
//                         borderRadius: '4px',
//                         padding: '4px 0',
//                         margin: 0,
//                         listStyle: 'none',
//                         zIndex: 50,
//                         boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.3)'
//                     }}
//                 >
//                     {options.map((option) => {
//                         const isSelected = option.value === value;
//                         return (
//                             <li
//                                 key={option.value}
//                                 onClick={() => handleSelect(option.value)}
//                                 role="option"
//                                 aria-selected={isSelected}
//                                 style={{
//                                     padding: '6px 12px',
//                                     fontSize: '0.8rem',
//                                     color: isSelected ? accentColor : textPrimary,
//                                     backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
//                                     cursor: 'pointer',
//                                     transition: 'background-color 0.15s ease, color 0.15s ease'
//                                 }}
//                                 onMouseEnter={(e) => {
//                                     if (!isSelected) e.currentTarget.style.backgroundColor = bgHover;
//                                 }}
//                                 onMouseLeave={(e) => {
//                                     if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
//                                 }}
//                             >
//                                 {option.label}
//                             </li>
//                         );
//                     })}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Select;


import React, { useState, useRef, useEffect } from 'react';
import theme from '../theme';

const Select = ({ value, onChange, options = [], placeholder = 'Select...', label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div ref={dropdownRef} style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px', width: '180px' }}>
            {label && (
                <label style={{ fontSize: '11px', color: theme.colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}

            <div style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '100%',
                        height: '34px',
                        padding: '0 10px',
                        backgroundColor: theme.colors.surface,
                        border: `1px solid ${isOpen ? theme.colors.accent : theme.colors.border}`,
                        borderRadius: '6px',
                        color: selectedOption ? theme.colors.textPrimary : theme.colors.textMuted,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                    <span style={{ fontSize: '10px', color: theme.colors.textSecondary }}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                    <ul
                        style={{
                            position: 'absolute',
                            top: '38px',
                            left: 0,
                            width: '100%',
                            backgroundColor: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: '6px',
                            padding: '4px 0',
                            margin: 0,
                            listStyle: 'none',
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                        }}
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    onChange({ target: { value: opt.value } });
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '13px',
                                    color: opt.value === value ? theme.colors.accent : theme.colors.textPrimary,
                                    cursor: 'pointer',
                                    backgroundColor: opt.value === value ? 'rgba(6, 182, 212, 0.1)' : 'transparent'
                                }}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Select;