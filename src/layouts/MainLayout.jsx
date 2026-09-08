import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import theme from '../theme';

function MainLayout({ children, currentPath, onNavigate, onLogout }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: theme.colors.bg,
        overflow: 'hidden', // Prevents the whole screen from scrolling unexpectedly
      }}
    >
      
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

      {/* Main Workspace Area (Navbar + Scrollable Page Content) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, 
          height: '100vh',
        }}
      >
        {/* Top Navbar */}
        <Navbar onLogout={onLogout} />

        {/* Dynamic Page Content (Renders whichever page is active) */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px',
            overflowY: 'auto', // Enables smooth page scrolling while Keeping Navbar fixed
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;