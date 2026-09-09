import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import theme from '../theme';

function PendingLinkSuggestions({ suggestions = [], onApprove, onReject, onRunAIDiscovery }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAI = async () => {
    if (!onRunAIDiscovery) return;
    setIsAnalyzing(true);
    await onRunAIDiscovery();
    setIsAnalyzing(false);
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Pending Link Suggestions</span>
          <Button
            variant="secondary"
            onClick={handleRunAI}
            disabled={isAnalyzing}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            {isAnalyzing ? 'Scanning...' : '⚡ Run AI Scan'}
          </Button>
        </div>
      }
    >
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
            No pending suggestions. Click <strong>⚡ Run AI Scan</strong> to discover hidden links.
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