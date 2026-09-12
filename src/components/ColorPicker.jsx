// src/components/ColorPicker.jsx
import React, { useState } from 'react';
import theme from '../theme';

const DEFAULT_SWATCHES = [
    '#06B6D4', // Ravel Cyan (Default Accent)
    '#3B82F6', // Employee Blue
    '#10B981', // Vendor Green
    '#F59E0B', // Invoice Orange
    '#EF4444', // Shell Red
    '#8B5CF6', // Purple Accent
];

const ColorPicker = ({
    value = '#06B6D4',
    onChange,
    label = 'Primary Accent Color',
    swatches = DEFAULT_SWATCHES,
    disabled = false,
}) => {
    const [hexInput, setHexInput] = useState(value);

    const handleSelectColor = (color) => {
        if (disabled) return;
        setHexInput(color);
        if (onChange) onChange(color);
    };

    const handleTextChange = (e) => {
        const val = e.target.value;
        setHexInput(val);
        // Validate standard hex format (#RGB or #RRGGBB) before emitting update
        if (/^#([0-9A-F]{3}){1,2}$/i.test(val) && onChange) {
            onChange(val);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full select-none">
            {label && (
                <span className="text-xs font-medium" style={{ color: theme.colors.textSecondary }}>
                    {label}
                </span>
            )}

            <div className="flex items-center gap-3">
                {/* Native Color Input Preview Badge */}
                <div className="relative flex-shrink-0">
                    <input
                        type="color"
                        value={value}
                        disabled={disabled}
                        onChange={(e) => handleSelectColor(e.target.value)}
                        className="w-8 h-8 rounded-md border cursor-pointer opacity-0 absolute inset-0 z-10 disabled:cursor-not-allowed"
                    />
                    <div
                        className="w-8 h-8 rounded-md border flex items-center justify-center transition-shadow"
                        style={{
                            backgroundColor: value,
                            borderColor: theme.colors.border,
                            boxShadow: `0 0 8px ${value}40`,
                        }}
                    />
                </div>

                {/* Manual Hex Text Field */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={hexInput}
                        disabled={disabled}
                        onChange={handleTextChange}
                        maxLength={7}
                        placeholder="#000000"
                        className="w-full px-2.5 py-1.5 text-xs font-mono rounded border focus:outline-none transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: theme.colors.bg,
                            borderColor: theme.colors.border,
                            color: theme.colors.textPrimary,
                        }}
                    />
                </div>
            </div>

            {/* Preset Swatches */}
            {swatches && swatches.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                    {swatches.map((color) => {
                        const isSelected = value.toLowerCase() === color.toLowerCase();
                        return (
                            <button
                                key={color}
                                type="button"
                                disabled={disabled}
                                onClick={() => handleSelectColor(color)}
                                className={`w-5 h-5 rounded-full border transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'
                                    } disabled:cursor-not-allowed`}
                                style={{
                                    backgroundColor: color,
                                    borderColor: isSelected ? theme.colors.textPrimary : 'transparent',
                                    boxShadow: isSelected ? `0 0 6px ${color}80` : 'none',
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ColorPicker;