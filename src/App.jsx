import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import theme from './theme';

function App() {
  const [currentPath, setCurrentPath] = useState('/entities');

  const handleLogout = () => {
    alert('Logging out...');
  };

  return (
    <MainLayout
      currentPath={currentPath}
      onNavigate={(path) => setCurrentPath(path)}
      onLogout={handleLogout}
    >
      {/* 1. Investigation Canvas */}
      {currentPath === '/investigations/1' && (
        <div>
          <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
            Investigation Canvas
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Active Investigation: Procurement Audit Q3 2026
          </p>
        </div>
      )}

      {/* 2. Entity Registry */}
      {currentPath === '/entities' && (
        <div>
          <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
            Entity Registry & Master Data
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Logged in: J. Doe (Senior Auditor)
          </p>
        </div>
      )}

      {/* 3. Analytics */}
      {currentPath === '/analytics' && (
        <div>
          <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
            Forensic Analytics & Deep Insights
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Logged in: J. Doe (Senior Auditor)
          </p>
        </div>
      )}

      {/* 4. Case Management */}
      {currentPath === '/cases' && (
        <div>
          <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
            Case Management & Investigation Workspace
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Logged in: J. Doe (Senior Auditor)
          </p>
        </div>
      )}

      {/* 5. Settings */}
      {currentPath === '/settings' && (
        <div>
          <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
            Platform Settings & Configurations
          </h1>
          <p style={{ color: theme.colors.textSecondary }}>
            Logged in: J. Doe (Senior Auditor)
          </p>
        </div>
      )}
    </MainLayout>
  );
}

export default App;