import React from 'react';
import logoSvg from '../assets/logo.svg';
import theme from '../theme';

function Logo({ 
  iconSize = 32,      // Box footprint width/height
  scale = 1.8,        // Zoom factor to eliminate transparent padding in SVG
  showText = true, 
  fontSize = 20, 
  style = {} 
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Icon Wrapper that locks container bounds */}
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img
          src={logoSvg}
          alt="Ravel Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: `scale(${scale})`, // Zooms past the SVG's empty margins
            display: 'block',
          }}
        />
      </div>

      {showText && (
        <span
          style={{
            color: theme.colors.textPrimary,
            fontWeight: 700,
            fontSize: `${fontSize}px`,
            letterSpacing: '0.3px',
            lineHeight: 1,
          }}
        >
          Ravel
        </span>
      )}
    </div>
  );
}

export default Logo;