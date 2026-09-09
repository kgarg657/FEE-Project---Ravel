import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import theme from '../theme';

function EdgeBadge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSuggested = data?.isSuggested ?? true;
  const labelText = data?.label || (isSuggested ? 'Suggested' : 'Approved');

  const handleApprove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (data?.onApprove) {
      data.onApprove(id);
    }
  };

  const handleReject = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (data?.onReject) {
      data.onReject(id);
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isSuggested ? theme.colors.textSecondary : theme.colors.accent,
          strokeDasharray: isSuggested ? '5,5' : 'none',
          strokeWidth: 2,
        }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            padding: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            zIndex: 1000,
            fontFamily: theme.fonts.sans,
          }}
          className="nodrag nopan"
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: isSuggested ? theme.colors.warning : theme.colors.accent,
            }}
          >
            {labelText}
          </span>

          {isSuggested && (
            <div style={{ display: 'flex', gap: '3px' }}>
              <button
                onClick={handleApprove}
                onMouseDown={(e) => e.stopPropagation()}
                title="Approve Link"
                style={{
                  background: theme.colors.success,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                A
              </button>
              <button
                onClick={handleReject}
                onMouseDown={(e) => e.stopPropagation()}
                title="Reject Link"
                style={{
                  background: theme.colors.critical,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                R
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default EdgeBadge;