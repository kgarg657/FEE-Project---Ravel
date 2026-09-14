// src/components/Slider.jsx
import React from 'react';
import theme from '../theme';

const Slider = ({
    value = 50,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    label,
    disabled = false,
}) => {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e) => {
        if (!disabled && onChange) {
            onChange(Number(e.target.value));
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full select-none">
            {label && (
                <div className="flex justify-between items-center text-xs font-medium">
                    <span style={{ color: theme.colors.textSecondary }}>{label}</span>
                    <span className="font-mono" style={{ color: theme.colors.accent }}>
                        {value}
                    </span>
                </div>
            )}

            <div className="relative flex items-center h-5">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                        background: `linear-gradient(to right, ${theme.colors.accent} ${percentage}%, ${theme.colors.surfaceHover} ${percentage}%)`,
                    }}
                />
            </div>
        </div>
    );
};

export default Slider;