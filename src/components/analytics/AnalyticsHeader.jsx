import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Button from '../Button';
import theme from '../../theme';

export default function AnalyticsHeader({ onRefresh }) {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '4px',
        fontFamily: theme.fonts.sans,
      }}
    >
      <div>
        <h1
          style={{
            color: theme.colors.textPrimary,
            margin: '0 0 4px 0',
            fontSize: '1.4rem',
            fontWeight: 700,
          }}
        >
          Forensic Analytics & Deep Insights
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: theme.colors.textSecondary, fontSize: '0.85rem' }}>
            Logged in: J. Doe (Senior Auditor)
          </span>
          <span style={{ color: theme.colors.textMuted, fontSize: '0.82rem' }}>
            System Sync: <strong style={{ color: theme.colors.textPrimary }}>{timestamp}</strong>
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleRefreshClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: theme.colors.accent,
        }}
      >
        <RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />
        {isRefreshing ? 'Refreshing Data...' : 'Data Refresh'}
      </Button>
    </div>
  );
}