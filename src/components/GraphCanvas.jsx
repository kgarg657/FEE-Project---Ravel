import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link2 } from 'lucide-react';

import EntityNode from './EntityNode';
import EdgeBadge from './EdgeBadge';
import EdgeLegend from './EdgeLegend';
import Modal from './Modal';
import Button from './Button';
import theme from '../theme';

const nodeTypes = { entityNode: EntityNode };
const edgeTypes = { edgeBadge: EdgeBadge };

function GraphCanvas({ initialNodes = [], initialEdges = [], onNodeClick, onNodesChangeParent, onEdgesChangeParent }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedElements, setSelectedElements] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState(null);
  const [pendingConnection, setPendingConnection] = useState(null);

  const [edgeToDelete, setEdgeToDelete] = useState(null);
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleSelectionChange = useCallback(({ nodes: selNodes, edges: selEdges }) => {
    setSelectedElements([...selNodes, ...selEdges]);
  }, []);

  const handleConfirmDelete = () => {
    const selectedIds = new Set(selectedElements.map((el) => el.id));
    const updatedNodes = nodes.filter((node) => !selectedIds.has(node.id));
    const updatedEdges = edges.filter(
      (edge) =>
        !selectedIds.has(edge.id) &&
        !selectedIds.has(edge.source) &&
        !selectedIds.has(edge.target)
    );

    setNodes(updatedNodes);
    setEdges(updatedEdges);

    if (onNodesChangeParent) onNodesChangeParent(updatedNodes);
    if (onEdgesChangeParent) onEdgesChangeParent(updatedEdges);

    setSelectedElements([]);
    setShowDeleteModal(false);
  };

  const handleApproveEdge = useCallback((edgeId) => {
    setEdges((prevEdges) => {
      const updated = prevEdges.map((edge) => {
        if (edge.id === edgeId) {
          return {
            ...edge,
            data: { ...edge.data, isSuggested: false, label: 'Approved' },
          };
        }
        return edge;
      });
      if (onEdgesChangeParent) onEdgesChangeParent(updated);
      return updated;
    });
  }, [setEdges, onEdgesChangeParent]);

  const handleRejectEdge = useCallback((edgeId) => {
    setEdges((prevEdges) => {
      const updated = prevEdges.filter((edge) => edge.id !== edgeId);
      if (onEdgesChangeParent) onEdgesChangeParent(updated);
      return updated;
    });
  }, [setEdges, onEdgesChangeParent]);

  const interactiveEdges = edges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      onApprove: handleApproveEdge,
      onReject: handleRejectEdge,
    },
  }));

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_, node) => {
    if (!isInteractive) return;
    if (connectMode) {
      if (!connectSourceId) {
        setConnectSourceId(node.id);
      } else if (connectSourceId === node.id) {
        setConnectSourceId(null);
      } else {
        setPendingConnection({ source: connectSourceId, target: node.id });
      }
      return;
    }
    onNodeClick && onNodeClick(node);
  };

  const handleToggleConnectMode = () => {
    if (!isInteractive) return;
    setConnectMode((prev) => !prev);
    setConnectSourceId(null);
    setPendingConnection(null);
  };

  useEffect(() => {
    if (!isInteractive) {
      setConnectMode(false);
      setConnectSourceId(null);
      setPendingConnection(null);
    }
  }, [isInteractive]);

  const handleConfirmConnection = () => {
    if (!pendingConnection) return;
    const newEdge = {
      id: `edge-${Date.now()}`,
      source: pendingConnection.source,
      target: pendingConnection.target,
      type: 'edgeBadge',
      data: { isSuggested: true, label: 'Suggested' },
    };
    const updatedEdges = [...edges, newEdge];
    setEdges(updatedEdges);
    if (onEdgesChangeParent) onEdgesChangeParent(updatedEdges);

    setPendingConnection(null);
    setConnectSourceId(null);
  };

  const handleEdgeClick = (_, edge) => {
    if (!isInteractive) return;
    setEdgeToDelete(edge.id);
  };

  const handleConfirmEdgeDelete = () => {
    const updatedEdges = edges.filter((e) => e.id !== edgeToDelete);
    setEdges(updatedEdges);
    if (onEdgesChangeParent) onEdgesChangeParent(updatedEdges);
    setEdgeToDelete(null);
  };

  const edgeToDeleteInfo = edges.find((e) => e.id === edgeToDelete);
  const sourceNodeLabel = (id) => nodes.find((n) => n.id === id)?.data?.label || id;

  const displayNodes = nodes.map((n) => ({
    ...n,
    style:
      n.id === connectSourceId
        ? { ...(n.style || {}), boxShadow: `0 0 0 4px ${theme.colors.accent}`, borderRadius: '50%' }
        : n.style,
  }));

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.bg,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <EdgeLegend />

      {/* Toolbar top-left overlay */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', gap: '8px' }}>
        <button
          onClick={handleToggleConnectMode}
          disabled={!isInteractive}
          title={!isInteractive ? 'Unlock the canvas to edit' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: !isInteractive
              ? theme.colors.surfaceHover
              : connectMode
              ? theme.colors.accent
              : theme.colors.surface,
            color: !isInteractive
              ? theme.colors.textMuted
              : connectMode
              ? theme.colors.bg
              : theme.colors.textPrimary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: !isInteractive ? 'not-allowed' : 'pointer',
            opacity: !isInteractive ? 0.6 : 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            fontFamily: theme.fonts.sans,
          }}
        >
          <Link2 size={14} />
          {!isInteractive
            ? 'Locked'
            : connectMode
            ? connectSourceId
              ? 'Click target node...'
              : 'Click source node...'
            : 'Connect Nodes'}
        </button>

        {isInteractive && !connectMode && selectedElements.length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              backgroundColor: theme.colors.critical,
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              fontFamily: theme.fonts.sans,
            }}
          >
            Remove Selected ({selectedElements.length})
          </button>
        )}
      </div>

      <ReactFlow
        nodes={displayNodes}
        edges={interactiveEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={isInteractive ? handleEdgeClick : undefined}
        fitView
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={false}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={isInteractive && !connectMode}
        deleteKeyCode={isInteractive ? ['Backspace', 'Delete'] : []}
      >
        <Background color={theme.colors.surface} gap={20} size={1} />
        <Controls
          showInteractive={true}
          onInteractiveChange={setIsInteractive}
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            fill: theme.colors.textPrimary,
          }}
        />
      </ReactFlow>

      {/* Modals */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} title="Confirm Removal" onClose={() => setShowDeleteModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: theme.fonts.sans }}>
            <p style={{ fontSize: '13px', color: theme.colors.textPrimary, margin: 0 }}>
              Are you sure you want to remove the selected {selectedElements.length} element(s) from this investigation canvas?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="primary" style={{ backgroundColor: theme.colors.critical }} onClick={handleConfirmDelete}>
                Confirm Removal
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {pendingConnection && (
        <Modal isOpen={!!pendingConnection} title="Confirm New Connection" onClose={() => setPendingConnection(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: theme.fonts.sans }}>
            <p style={{ fontSize: '13px', color: theme.colors.textPrimary, margin: 0 }}>
              Create a connection between{' '}
              <strong style={{ color: theme.colors.accent }}>{sourceNodeLabel(pendingConnection.source)}</strong> and{' '}
              <strong style={{ color: theme.colors.accent }}>{sourceNodeLabel(pendingConnection.target)}</strong>?
            </p>
            <p style={{ fontSize: '12px', color: theme.colors.textMuted, margin: 0 }}>
              This will be added as a Suggested link, pending approval on the canvas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setPendingConnection(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmConnection}>Create Connection</Button>
            </div>
          </div>
        </Modal>
      )}

      {edgeToDelete && (
        <Modal isOpen={!!edgeToDelete} title="Remove Connection" onClose={() => setEdgeToDelete(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: theme.fonts.sans }}>
            <p style={{ fontSize: '13px', color: theme.colors.textPrimary, margin: 0 }}>
              Remove the connection between{' '}
              <strong style={{ color: theme.colors.accent }}>{sourceNodeLabel(edgeToDeleteInfo?.source)}</strong> and{' '}
              <strong style={{ color: theme.colors.accent }}>{sourceNodeLabel(edgeToDeleteInfo?.target)}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setEdgeToDelete(null)}>Cancel</Button>
              <Button variant="primary" style={{ backgroundColor: theme.colors.critical }} onClick={handleConfirmEdgeDelete}>
                Remove Connection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default GraphCanvas;