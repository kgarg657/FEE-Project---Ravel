import React from 'react';
import Card from '../Card';
import theme from '../../theme';

export default function RegistrySidebar({ nodes = [], edges = [] }) {
  // Compute dynamic stats from live nodes/edges
  const totalEntities = nodes.length;
  const flaggedCount = nodes.filter(
    (n) => n.data?.riskLevel === 'Critical' || n.data?.riskLevel === 'High'
  ).length;
  const suggestedLinksCount = edges.filter((e) => e.data?.isSuggested).length;

  // Derive dynamic flagged feed items from live graph nodes
  const flaggedEntitiesFeed = nodes
    .filter((n) => n.data?.riskLevel === 'Critical' || n.data?.riskLevel === 'High')
    .map((n) => ({
      id: `feed-${n.id}`,
      title: `${n.data?.type || 'Entity'} ${n.data?.label || n.id} associated with unverified details`,
      riskScore: n.data?.riskLevel === 'Critical' ? 'Critical' : 'High',
    }));

  // Fallback feed if current node set has no high-risk flags
  if (flaggedEntitiesFeed.length === 0) {
    flaggedEntitiesFeed.push({
      id: 'f-fallback',
      title: 'Invoice #I-808 (Ace) associated with Vendor: Ace Corp',
      riskScore: 'High',
    });
  }

  const activityLogs = (nodes || []).slice(-4).map((n) => ({
    id: `log-${n.id}`,
    text: `${n.data?.type || 'Entity'} ${n.data?.label || n.id} updated recently`,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Registry Statistics */}
      <Card style={{ padding: '16px', textAlign: 'left' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '0.95rem',
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.sans,
            fontWeight: 700,
          }}
        >
          Registry Statistics
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.colors.textSecondary }}>Total Entities:</span>
            <strong style={{ color: theme.colors.textPrimary }}>{totalEntities}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.colors.textSecondary }}>Flagged Entities:</span>
            <strong style={{ color: theme.colors.critical }}>
              {flaggedCount} (Critical)
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: theme.colors.textSecondary }}>Suggested Links:</span>
            <strong style={{ color: theme.colors.textPrimary }}>{suggestedLinksCount}</strong>
          </div>
        </div>
      </Card>

      {/* 2. Flagged Entities Feed */}
      <Card style={{ padding: '16px', textAlign: 'left' }}>
        <h3
          style={{
            margin: '0 0 2px 0',
            fontSize: '0.95rem',
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.sans,
            fontWeight: 700,
          }}
        >
          Flagged Entities Feed
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: theme.colors.textMuted }}>
          Most critical unverified entities
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {flaggedEntitiesFeed.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '10px',
                fontSize: '0.78rem',
                color: theme.colors.textPrimary, // Clean readable text
                lineHeight: 1.35,
              }}
            >
              {item.title}
              <div style={{ marginTop: '4px', color: theme.colors.critical, fontWeight: 600 }}>
                (Risk Score: {item.riskScore})
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Registration Activity Log */}
      <Card style={{ padding: '16px', textAlign: 'left' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '0.95rem',
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.sans,
            fontWeight: 700,
          }}
        >
          Registration Activity Log
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        >
          {activityLogs.map((log) => (
            <div
              key={log.id}
              style={{
                fontSize: '0.76rem',
                color: theme.colors.textMuted,
                borderBottom: `1px dashed ${theme.colors.border}`,
                paddingBottom: '6px',
                lineHeight: 1.3,
              }}
            >
              {log.text}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}