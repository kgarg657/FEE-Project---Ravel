import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, Trash2, RefreshCw } from 'lucide-react';
import theme from '../theme';
import Badge from './Badge';
import aiService from '../services/aiService';

export default function NodeInspectorDrawer({
  node,
  connectedEdges = [],
  allNodes = [],
  isOpen,
  onClose,
  onApproveEdge,
  onRejectEdge,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (node && isOpen) {
      fetchNodeRisk();
    }
  }, [node, isOpen]);

  const fetchNodeRisk = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.analyzeNodeRisk(node, connectedEdges);
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to analyze node risk:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !node) return null;

  const nodeType = node.data?.type || 'Entity';
  const nodeLabel = node.data?.label || node.id;

  const getRiskStyles = (rating) => {
    if (rating === 'Critical') return { bg: `${theme.colors.critical}20`, color: theme.colors.critical, border: `${theme.colors.critical}40` };
    if (rating === 'Medium') return { bg: `${theme.colors.invoiceOrange}20`, color: theme.colors.invoiceOrange, border: `${theme.colors.invoiceOrange}40` };
    return { bg: `${theme.colors.accent}20`, color: theme.colors.accent, border: `${theme.colors.accent}40` };
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '380px',
        height: '100vh',
        backgroundColor: theme.colors.surface,
        borderLeft: `1px solid ${theme.colors.border}`,
        boxShadow: '-4px 0 16px rgba(0,0,0,0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: theme.fonts.sans,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.colors.bg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="neutral">{nodeType}</Badge>
          <h2 style={{ margin: 0, fontSize: '1rem', color: theme.colors.textPrimary }}>
            {nodeLabel}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.textMuted,
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Audit Remarks Card */}
        <div
          style={{
            backgroundColor: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.textSecondary }}>
              ⚡ Forensic Audit Assessment
            </span>
            {isLoading ? (
              <RefreshCw size={14} className="spin" style={{ color: theme.colors.accent }} />
            ) : (
              analysis && (() => {
                const style = getRiskStyles(analysis.rating);
                return (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: style.bg,
                      color: style.color,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {analysis.rating} Risk
                  </span>
                );
              })()
            )}
          </div>

          {isLoading ? (
            <p style={{ fontSize: '12px', color: theme.colors.textMuted, margin: 0 }}>
              Evaluating entity metadata against compliance policy rules...
            </p>
          ) : analysis ? (
            <>
              <p style={{ fontSize: '12px', color: theme.colors.textPrimary, margin: 0, lineHeight: '1.5', wordBreak: 'break-word' }}>
                {analysis.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.textMuted, letterSpacing: '0.5px' }}>
                  AUDIT REMARKS & COMPLIANCE FLAGS
                </span>
                {analysis.redFlags.map((flag, idx) => {
                  const isLowRisk = analysis.rating === 'Low';
                  const flagColor = isLowRisk ? theme.colors.accent : (analysis.rating === 'Critical' ? theme.colors.critical : theme.colors.invoiceOrange);
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '11px',
                        lineHeight: '1.4',
                        color: flagColor,
                        backgroundColor: `${flagColor}12`,
                        border: `1px solid ${flagColor}30`,
                        padding: '8px 10px',
                        borderRadius: '6px',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ flex: 1 }}>{flag}</span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>

        {/* Entity Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.textSecondary }}>
            Entity Metadata
          </span>
          <div
            style={{
              backgroundColor: theme.colors.bg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '12px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: theme.colors.textMuted, display: 'block', fontSize: '10px' }}>ID</span>
              <strong style={{ color: theme.colors.textPrimary }}>{node.id}</strong>
            </div>
            {node.data?.gst && (
              <div>
                <span style={{ color: theme.colors.textMuted, display: 'block', fontSize: '10px' }}>GSTIN</span>
                <strong style={{ color: theme.colors.textPrimary }}>{node.data.gst}</strong>
              </div>
            )}
            {node.data?.amount && (
              <div>
                <span style={{ color: theme.colors.textMuted, display: 'block', fontSize: '10px' }}>Amount</span>
                <strong style={{ color: theme.colors.textPrimary }}>${parseFloat(node.data.amount).toLocaleString()}</strong>
              </div>
            )}
            {node.data?.dept && (
              <div>
                <span style={{ color: theme.colors.textMuted, display: 'block', fontSize: '10px' }}>Department</span>
                <strong style={{ color: theme.colors.textPrimary }}>{node.data.dept}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Connected Edges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.textSecondary }}>
            Connected Relationships ({connectedEdges.length})
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {connectedEdges.length === 0 ? (
              <p style={{ fontSize: '12px', color: theme.colors.textMuted, margin: 0 }}>
                No active links connected to this entity.
              </p>
            ) : (
              connectedEdges.map((edge) => {
                const otherNodeId = edge.source === node.id ? edge.target : edge.source;
                const otherNode = allNodes.find((n) => n.id === otherNodeId);
                const isSuggested = edge.data?.isSuggested;
                const linkColor = isSuggested ? theme.colors.invoiceOrange : theme.colors.accent;

                return (
                  <div
                    key={edge.id}
                    style={{
                      backgroundColor: theme.colors.bg,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '6px',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: theme.colors.textPrimary, fontWeight: 500 }}>
                        {otherNode?.data?.label || otherNodeId}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: linkColor,
                          backgroundColor: `${linkColor}15`,
                          border: `1px solid ${linkColor}30`,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          width: 'fit-content',
                        }}
                      >
                        {isSuggested ? 'Suggested Link' : 'Approved Link'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {isSuggested && (
                        <button
                          onClick={() => onApproveEdge && onApproveEdge(edge.id)}
                          style={{
                            background: `${theme.colors.accent}20`,
                            border: 'none',
                            borderRadius: '4px',
                            color: theme.colors.accent,
                            padding: '4px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Approve Link"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => onRejectEdge && onRejectEdge(edge.id)}
                        style={{
                          background: `${theme.colors.critical}20`,
                          border: 'none',
                          borderRadius: '4px',
                          color: theme.colors.critical,
                          padding: '4px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete Link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}