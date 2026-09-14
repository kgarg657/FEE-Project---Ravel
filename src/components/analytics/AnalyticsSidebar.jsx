import React from 'react';
import { Sliders, Search } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import theme from '../../theme'; // Step out of analytics (1) -> components (2) -> src/theme

export default function AnalyticsSidebar({
  algorithm = 'BFS',
  onAlgorithmChange,
  maxHops = 3,
  onMaxHopsChange,
}) {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <div>
          <h3 style={{ margin: '0 0 2px 0', color: theme.colors.textPrimary, fontSize: '0.95rem', fontFamily: theme.fonts.sans }}>
            Analytics Tools & Controls
          </h3>
          <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: '0.75rem' }}>
            Graph traversal algorithms & query parameters
          </p>
        </div>
      </div>

      {/* Full Width Horizontal Tools Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'center',
          backgroundColor: theme.colors.bg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '6px',
          padding: '12px 16px',
        }}
      >
        {/* Tool 1: Query Builder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Search size={12} /> Query Target ID
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select
              style={{
                flex: 1,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                padding: '6px 8px',
                fontSize: '11px',
              }}
            >
              <option value="">Select Query ID...</option>
              <option value="q1">Q-101 (High Risk Nodes)</option>
              <option value="q2">Q-204 (Unlinked Invoices)</option>
            </select>
          </div>
        </div>

        {/* Tool 2: Algorithm Switcher (BFS / DFS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sliders size={12} /> Traversal Algorithm
          </label>
          <div style={{ display: 'flex', backgroundColor: theme.colors.surface, borderRadius: '4px', padding: '2px', border: `1px solid ${theme.colors.border}` }}>
            <button
              onClick={() => onAlgorithmChange && onAlgorithmChange('BFS')}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: algorithm === 'BFS' ? theme.colors.accent : 'transparent',
                color: algorithm === 'BFS' ? '#ffffff' : theme.colors.textMuted,
              }}
            >
              BFS
            </button>
            <button
              onClick={() => onAlgorithmChange && onAlgorithmChange('DFS')}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: algorithm === 'DFS' ? theme.colors.accent : 'transparent',
                color: algorithm === 'DFS' ? '#ffffff' : theme.colors.textMuted,
              }}
            >
              DFS
            </button>
          </div>
        </div>

        {/* Tool 3: Hop Depth Limit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.textSecondary }}>
            Hop Depth Limit
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="secondary"
              style={{ padding: '2px 8px', height: '26px' }}
              onClick={() => onMaxHopsChange && onMaxHopsChange(Math.max(1, maxHops - 1))}
            >
              -
            </Button>
            <span style={{ fontSize: '12px', fontWeight: 700, color: theme.colors.textPrimary, minWidth: '16px', textAlign: 'center' }}>
              {maxHops}
            </span>
            <Button
              variant="secondary"
              style={{ padding: '2px 8px', height: '26px' }}
              onClick={() => onMaxHopsChange && onMaxHopsChange(maxHops + 1)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}