import React from 'react';
import Card from './Card';
import theme from '../theme';

function PendingLinkSuggestions({ suggestions = [], onApprove, onReject }) {
  return (
    <Card title="Pending Link Suggestions">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '320px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {suggestions.length === 0 ? (
          <p
            style={{
              fontSize: '12px',
              color: theme.colors.textMuted,
              margin: 0,
              fontFamily: theme.fonts.sans,
            }}
          >
            No pending link suggestions available.
          </p>
        ) : (
          suggestions.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontFamily: theme.fonts.sans,
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  color: theme.colors.textPrimary,
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                <strong style={{ color: theme.colors.invoiceOrange }}>Suggested:</strong> {item.description}
              </p>

              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                <span
                  onClick={() => onApprove && onApprove(item.id)}
                  style={{
                    color: theme.colors.accent,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Approve
                </span>
                <span style={{ color: theme.colors.textMuted }}>/</span>
                <span
                  onClick={() => onReject && onReject(item.id)}
                  style={{
                    color: theme.colors.critical,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reject
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default PendingLinkSuggestions;