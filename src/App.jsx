// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import MainLayout from './layouts/MainLayout';
// import theme from './theme';
// import Input from './components/Input';
// import Drawer from './components/Drawer';
// import { Sidebar } from 'lucide-react';
// import Table from './components/Table';




// // Sub-component rendering dashboard views based on custom state navigation
// function Dashboard() {
//   const [currentPath, setCurrentPath] = useState('/entities');

//   const handleLogout = () => {
//     alert('Logging out...');
//   };

//   return (


//     <MainLayout

//       currentPath={currentPath}
//       onNavigate={(path) => setCurrentPath(path)}
//       onLogout={handleLogout}
//     >





//       {/* 1. Investigation Canvas */}
//       {currentPath === '/investigations/1' && (
//         <div>
//           <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
//             Investigation Canvas
//           </h1>
//           <p style={{ color: theme.colors.textSecondary }}>
//             Active Investigation: Procurement Audit Q3 2026
//           </p>
//         </div>
//       )}

//       {/* 2. Entity Registry */}
//       {currentPath === '/entities' && (
//         <div>
//           <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
//             Entity Registry & Master Data
//           </h1>
//           <p style={{ color: theme.colors.textSecondary }}>
//             Logged in: J. Doe (Senior Auditor)
//           </p>
//         </div>
//       )}

//       {/* 3. Analytics */}
//       {currentPath === '/analytics' && (
//         <div>
//           <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
//             Forensic Analytics & Deep Insights
//           </h1>
//           <p style={{ color: theme.colors.textSecondary }}>
//             Logged in: J. Doe (Senior Auditor)
//           </p>
//         </div>
//       )}

//       {/* 4. Case Management */}
//       {currentPath === '/cases' && (
//         <div>
//           <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
//             Case Management & Workspace
//           </h1>
//           <p style={{ color: theme.colors.textSecondary }}>
//             Logged in: J. Doe (Senior Auditor)
//           </p>
//         </div>
//       )}

//       {/* 5. Settings */}
//       {currentPath === '/settings' && (
//         <div>
//           <h1 style={{ color: theme.colors.textPrimary, marginTop: 0 }}>
//             Platform Settings & Configurations
//           </h1>
//           <p style={{ color: theme.colors.textSecondary }}>
//             Logged in: J. Doe (Senior Auditor)
//           </p>
//         </div>
//       )}

//     </MainLayout>

//   );
// }

// // Main App component combining routing
// function App() {
//   return (


//     <Router>

//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/dashboard/*" element={<Dashboard />} />

//       </Routes>
//     </Router>

//   );
// }

// export default App;




// to check select and  searchBar

import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Select from './components/Select';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityType, setEntityType] = useState('');
  const [riskLevel, setRiskLevel] = useState('');

  // Sample options matching your theme.js entity & risk definitions
  const entityOptions = [
    { label: 'All Entities', value: '' },
    { label: 'Employee', value: 'employee' },
    { label: 'Vendor', value: 'vendor' },
    { label: 'Invoice', value: 'invoice' },
    { label: 'Shell / Flagged', value: 'shell' },
  ];

  const riskOptions = [
    { label: 'All Risk Levels', value: '' },
    { label: 'Critical Risk', value: 'critical' },
    { label: 'Warning / Review', value: 'warning' },
    { label: 'Verified / Clear', value: 'success' },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#0F172A', minHeight: '100vh' }}>
      <h1 style={{ color: '#F8FAFC', marginBottom: '16px' }}>Entity Registry</h1>

      {/* Controls Header Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entities..."
        />

        <Select
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          options={entityOptions}
          placeholder="Entity Type"
        />

        <Select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value)}
          options={riskOptions}
          placeholder="Risk Level"
        />
      </div>

      {/* Debug values to confirm state updates */}
      <div style={{ marginTop: '20px', color: '#94A3B8', fontSize: '0.85rem' }}>
        <p>Active Search: <strong>{searchQuery || 'None'}</strong></p>
        <p>Selected Type: <strong>{entityType || 'All'}</strong></p>
        <p>Selected Risk: <strong>{riskLevel || 'All'}</strong></p>
      </div>
    </div>
  );
}

export default Dashboard;