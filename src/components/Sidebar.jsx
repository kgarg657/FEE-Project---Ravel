import { useState } from 'react';
import { 
  Share2, 
  Database, 
  BarChart3, 
  FolderKanban, 
  Settings, 
  Menu 
} from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Clean collapse toggle resetting hover state simultaneously
  const handleCollapse = () => {
    setIsHovered(false);
    setIsCollapsed(true);
  };

  // Clean expand toggle resetting hover state
  const handleExpand = () => {
    setIsHovered(false);
    setIsCollapsed(false);
  };

  return (
    <div
      style={{
        width: isCollapsed ? '68px' : '240px',
        height: '100vh',
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        boxSizing: 'border-box',
        transition: 'width 0.25s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div 
        style={{ 
          padding: '0 16px', 
          marginBottom: '28px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          height: '32px',
        }}
      >
        {isCollapsed ? (
          /* CLOSED SIDEBAR: Show ONLY Logo icon box. Swap to 3-lines on hover. */
          <div
            onClick={handleExpand}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isHovered ? theme.colors.surfaceHover : 'transparent',
              transition: 'background-color 0.15s ease',
            }}
            title="Expand sidebar"
          >
            {isHovered ? (
              /* Hovered state: 3-lines menu icon */
              <Menu size={22} color={theme.colors.accent} />
            ) : (
              /* Normal state: Clipped logo so ONLY the icon symbol shows */
              <div style={{ width: '32px', height: '32px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <Logo iconSize={32} scale={1.8} fontSize={20} />
              </div>
            )}
          </div>
        ) : (
          /* OPEN SIDEBAR: Both Logo and Menu icon sit independently side-by-side */
          <>
            <Logo iconSize={32} scale={1.8} fontSize={20} />
            
            <button
              onClick={handleCollapse}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.colors.textSecondary,
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease',
              }}
              title="Collapse sidebar"
            >
              <Menu size={22} />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <div
              key={item.path}
              onClick={() => onNavigate && onNavigate(item.path)}
              title={isCollapsed ? item.label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isActive ? theme.colors.accent : theme.colors.textSecondary,
                backgroundColor: isActive ? theme.colors.surfaceHover : 'transparent',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon size={20} style={{ minWidth: '20px' }} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;