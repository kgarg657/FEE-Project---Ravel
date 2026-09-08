import { Share2, Database, BarChart3, FolderKanban, Settings } from 'lucide-react';
import theme from '../theme';
import Logo from './Logo';

const navItems = [
  { label: 'Investigation Canvas', path: '/investigations/1', icon: Share2 },
  { label: 'Entity Registry', path: '/entities', icon: Database },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Case Management', path: '/cases', icon: FolderKanban },
  { label: 'Settings', path: '/settings', icon: Settings },
];

function Sidebar({ currentPath = '/entities', onNavigate }) {
  return (
    <div
      style={{
        width: '240px',
        height: '100vh',
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '0 20px', marginBottom: '28px', display: 'flex', alignItems: 'center' }}>
          <Logo iconSize={32} scale={1.8} fontSize={20} />
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => onNavigate && onNavigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isActive ? theme.colors.accent : theme.colors.textSecondary,
                backgroundColor: isActive ? theme.colors.surfaceHover : 'transparent',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} />
              {item.label}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;