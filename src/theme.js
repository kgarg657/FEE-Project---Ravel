// src/theme.js
// Central design tokens for Ravel.

// - Every entity type has exactly 1 color, used everywhere it appears:
// - Employee = blue, Vendor = green, Invoice = orange, Flagged/Shell = red.
// - Status pills (Verified/Suggested/Flagged) reuse success/warning/critical
//   directly — they are not separate colors from the ones below.

export const theme = {
  colors: {
    // Canvas & Dark UI Base
    bg: '#0F172A',            // Deep slate dark background
    surface: '#1E293B',       // Card, panel, and sidebar background
    surfaceHover: '#334155',  // Hover states for list items & table rows
    border: '#334155',        // Subdued borders for dark mode

    // Core Accent & Branding
    accent: '#06B6D4',        // active state
    accentHover: '#0891B2',   // Active/hover button 

    
    employeeBlue: '#3B82F6',  // Employees — graph nodes AND table icons
    vendorGreen: '#10B981',   // Vendors — graph nodes AND table icons
    invoiceOrange: '#F59E0B', // Invoices — graph nodes AND table icons
    shellRed: '#EF4444',      // Flagged / circular / shell entities

    // Text Hierarchy
    textPrimary: '#F8FAFC',   // High-contrast primary text
    textSecondary: '#94A3B8', // Labels, metadata, and subtitles
    textMuted: '#64748B',     // Placeholders and inactive states

    // Status & Risk Alerts (reused for pills, banners, risk badges —
    
    critical: '#EF4444',      // High Risk / Anomaly / Flagged
    warning: '#F59E0B',       // Under Review / Suggested
    success: '#10B981',       // Clear / Clean Audit / Verified
  },

  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'Fira Code, monospace',
  }
};

export default theme;