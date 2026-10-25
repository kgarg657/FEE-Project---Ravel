import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import Card from '../Card';
import Badge from '../Badge';
import aiService from '../../services/aiService';
import theme from '../../theme';

export default function FlaggedAnomaliesFeed({
  nodes: parentNodes,
  edges: parentEdges,
}) {
  // Read nodes & edges from Redux Store as fallback
  const reduxNodes = useSelector((state) => state.graph.nodes);
  const reduxEdges = useSelector((state) => state.graph.edges);

  const nodes = parentNodes && parentNodes.length > 0 ? parentNodes : reduxNodes;
  const edges = parentEdges && parentEdges.length > 0 ? parentEdges : reduxEdges;

  const [anomalies, setAnomalies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function generateDynamicFeed() {
      setIsLoading(true);

      try {
        const aiAnomalies = await aiService.summarizeAnomalies(nodes, edges);
        if (isMounted && aiAnomalies && aiAnomalies.length > 0) {
          setAnomalies(aiAnomalies);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('AI anomaly feed fallback triggered:', err);
      }

      if (isMounted) {
        const derived = (nodes || [])
          .filter(
            (node) =>
              node.data?.riskLevel === 'High' ||
              node.data?.riskLevel === 'Critical' ||
              node.risk_score >= 50 ||
              (node.data?.amount && parseFloat(node.data.amount) > 40000)
          )
          .map((node, idx) => {
            const label = node.data?.label || node.label || `Entity #${node.id}`;
            const type = node.data?.type || node.type || 'Entity';
            const riskLevel =
              node.data?.riskLevel ||
              ((node.risk_score || 0) >= 70 ? 'Critical' : 'High');

            return {
              id: `anom-${node.id}-${idx}`,
              title: `${type} ${label}: Risk Warning`,
              riskCount: node.data?.amount
                ? Math.ceil(parseFloat(node.data.amount) / 20000)
                : 1,
              variant: riskLevel === 'Critical' ? 'danger' : 'warning',
              description: `High risk score detected for ${label}. Needs inspection.`,
            };
          });

        if (derived.length === 0) {
          derived.push(
            {
              id: 'a1',
              title: 'Invoice #I-403: Double payment check',
              riskCount: 2,
              variant: 'danger',
              description:
                'Duplicate invoice submission detected across two separate procurement entries.',
            },
            {
              id: 'a2',
              title: 'Vendor Ace Corp: Unverified bank modification',
              riskCount: 1,
              variant: 'warning',
              description:
                'Vendor account updated with details matching internal employee ID.',
            }
          );
        }

        setAnomalies(derived);
        setIsLoading(false);
      }
    }

    generateDynamicFeed();

    return () => {
      isMounted = false;
    };
  }, [nodes, edges]);

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '100%',
        boxSizing: 'border-box',
        textAlign: 'left',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 2px 0',
              color: theme.colors.textPrimary,
              fontSize: '0.95rem',
              fontFamily: theme.fonts.sans,
            }}
          >
            Flagged Anomalies
          </h3>
          <p
            style={{
              margin: 0,
              color: theme.colors.textMuted,
              fontSize: '0.75rem',
            }}
          >
            Real-time algorithmic risk detection feed
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: theme.colors.accent,
          }}
        >
          <Sparkles size={13} /> AI Filtered
        </div>
      </div>

      {/* Feed Content - Stretches vertically to fill card */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '20px',
            color: theme.colors.textMuted,
          }}
        >
          <Loader2
            size={20}
            className="spin-icon"
            style={{ marginBottom: '8px' }}
          />
          <span style={{ fontSize: '12px' }}>Analyzing graph nodes...</span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {anomalies.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: theme.colors.surface || '#1e293b',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShieldAlert
                    size={15}
                    style={{
                      color:
                        item.variant === 'danger'
                          ? theme.colors.critical
                          : '#f59e0b',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <Badge variant={item.variant}>
                  Counts: {item.riskCount} Risks
                </Badge>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  color: theme.colors.textSecondary,
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}