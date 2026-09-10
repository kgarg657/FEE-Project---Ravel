import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PanelRightClose, PanelRightOpen, GripVertical, Clock } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import AddEntitySidebar from '../components/AddEntitySidebar';
import PendingLinkSuggestions from '../components/PendingLinkSuggestions';
import NodeInspectorDrawer from '../components/NodeInspectorDrawer';
import aiService from '../services/aiService';
import theme from '../theme';

export default function InvestigationCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  onApproveEdge,
  onRejectEdge,
  onAddEntity,
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isTimelineView, setIsTimelineView] = useState(false);
  
  // Resizable Layout States
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Esc Key Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resizer Mouse Handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const calculatedWidth = containerRect.right - e.clientX;
      
      if (calculatedWidth >= 280 && calculatedWidth <= 520) {
        setSidebarWidth(calculatedWidth);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Derive Suggestions
  const pendingSuggestions = edges
    .filter((edge) => edge.data?.isSuggested)
    .map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      return {
        id: edge.id,
        description:
          edge.data?.reasoning ||
          `${sourceNode?.data?.type || 'Entity'}: ${sourceNode?.data?.label || edge.source} linked to ${targetNode?.data?.type || 'Entity'}: ${targetNode?.data?.label || edge.target}`,
      };
    });

  const handleRunAIDiscovery = async () => {
    const newDiscoveredEdges = await aiService.discoverHiddenLinks(nodes, edges);
    if (newDiscoveredEdges && newDiscoveredEdges.length > 0) {
      setEdges((prev) => [...prev, ...newDiscoveredEdges]);
    } else {
      alert('AI Scan complete: No unlinked relationships detected among current nodes.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflow: 'hidden' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h1 style={{ color: theme.colors.textPrimary, margin: '0 0 4px 0', fontSize: '1.4rem', fontFamily: theme.fonts.sans }}>
            Active Investigation: Procurement Audit Q3 2026
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: theme.colors.textSecondary, fontSize: '0.85rem' }}>
              Logged in: J. Doe (Senior Auditor)
            </span>
            
            {/* Timeline Toggle Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: theme.colors.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>
                {isTimelineView ? 'Timeline View' : 'Graph View'}
              </span>
              <button
                onClick={() => setIsTimelineView(!isTimelineView)}
                style={{
                  width: '40px',
                  height: '22px',
                  borderRadius: '11px',
                  backgroundColor: isTimelineView ? theme.colors.accent : theme.colors.surfaceHover,
                  border: `1px solid ${theme.colors.border}`,
                  position: 'relative',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background-color 0.2s',
                }}
                title="Toggle between Graph Network and Chronological Event Timeline"
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    top: '2px',
                    left: isTimelineView ? '20px' : '2px',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Panel Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isSidebarCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
          <span>{isSidebarCollapsed ? 'Show Side Panels' : 'Full Canvas'}</span>
        </button>
      </div>

      {/* Main Split Layout Container */}
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          width: '100%',
          flex: 1,
          minHeight: 0,
          position: 'relative',
          userSelect: isDragging ? 'none' : 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Canvas / Timeline Left Panel Container */}
        <div style={{ flex: 1, minWidth: 0, height: '100%', position: 'relative', overflow: 'hidden' }}>
          {isTimelineView ? (
            /* Timeline Chronological Mode */
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '8px',
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: '12px' }}>
                <Clock size={18} style={{ color: theme.colors.accent }} />
                <h3 style={{ margin: 0, color: theme.colors.textPrimary, fontSize: '1rem' }}>
                  Chronological Transaction Sequence (Q3 2026)
                </h3>
              </div>

              {nodes.map((n, idx) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  style={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '6px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', color: theme.colors.accent, fontWeight: 700 }}>
                      #0{idx + 1}
                    </span>
                    <div>
                      <strong style={{ color: theme.colors.textPrimary, display: 'block', fontSize: '13px' }}>
                        {n.data?.label}
                      </strong>
                      <span style={{ fontSize: '11px', color: theme.colors.textMuted }}>
                        Category: {n.data?.type}
                      </span>
                    </div>
                  </div>

                  {n.data?.amount && (
                    <span style={{ color: theme.colors.critical, fontWeight: 700, fontSize: '13px' }}>
                      ${parseFloat(n.data.amount).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Standard Graph Canvas Mode */
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
              <GraphCanvas
                initialNodes={nodes}
                initialEdges={edges}
                onNodesChangeParent={setNodes}
                onEdgesChangeParent={setEdges}
                onNodeClick={(node) => setSelectedNode(node)}
              />
            </div>
          )}
        </div>

        {/* Drag Resizer Bar */}
        {!isSidebarCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: '10px',
              cursor: 'col-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDragging ? theme.colors.accent : 'transparent',
              transition: 'background-color 0.15s',
              zIndex: 20,
              flexShrink: 0,
            }}
            title="Drag to resize panels"
          >
            <GripVertical size={14} style={{ color: theme.colors.textMuted }} />
          </div>
        )}

        {/* Right Sidebars Panel */}
        {!isSidebarCollapsed && (
          <div
            style={{
              width: `${sidebarWidth}px`,
              flexShrink: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
            }}
          >
            <AddEntitySidebar existingNodes={nodes} onAddEntity={onAddEntity} />
            <PendingLinkSuggestions
              suggestions={pendingSuggestions}
              onApprove={onApproveEdge}
              onReject={onRejectEdge}
              onRunAIDiscovery={handleRunAIDiscovery}
            />
          </div>
        )}
      </div>

      {/* Node Inspector Drawer */}
      <NodeInspectorDrawer
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        connectedEdges={edges.filter((e) => selectedNode && (e.source === selectedNode.id || e.target === selectedNode.id))}
        allNodes={nodes}
        onApproveEdge={onApproveEdge}
        onRejectEdge={onRejectEdge}
      />
    </div>
  );
}