import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link2 } from 'lucide-react';

import EntityNode from './EntityNode';
import EdgeBadge from './EdgeBadge';
import EdgeLegend from './EdgeLegend';
import Modal from './Modal';
import Button from './Button';
import theme from '../theme';

// Redux & Supabase imports
import {
  setGraphData,
  setNodes as setReduxNodes,
  setEdges as setReduxEdges,
  addNode,
  addEdge,
  updateNodePosition,
  removeElements,
  approveEdge as approveEdgeAction,
  rejectEdge as rejectEdgeAction,
  setSelectedNodeId,
} from '../store/graphSlice';
import {
  saveEdge,
  deleteNodeFromDb,
  deleteEdgeFromDb,
  updateNodePositionInDb,
  fetchGraphData,
} from '../services/graphService';

const nodeTypes = {
  entityNode: EntityNode,
  default: EntityNode,
  Employee: EntityNode,
  Vendor: EntityNode,
  Invoice: EntityNode,
  Txn: EntityNode,
  Account: EntityNode,
  employee: EntityNode,
  vendor: EntityNode,
  invoice: EntityNode,
  txn: EntityNode,
  account: EntityNode,
};
const edgeTypes = { edgeBadge: EdgeBadge };

function GraphCanvas({
  initialNodes: propInitialNodes,
  initialEdges: propInitialEdges,
  onNodeClick,
  onNodesChangeParent,
  onEdgesChangeParent,
  highlightedNodeIds = [],
}) {
  const dispatch = useDispatch();

  // Read live nodes & edges from Redux Store
  const reduxNodes = useSelector((state) => state.graph.nodes);
  const reduxEdges = useSelector((state) => state.graph.edges);

  const [nodes, setNodes, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reduxEdges);
  const [selectedElements, setSelectedElements] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [connectMode, setConnectMode] = useState(false);
  const [connectSourceId, setConnectSourceId] = useState(null);
  const [pendingConnection, setPendingConnection] = useState(null);

  const [edgeToDelete, setEdgeToDelete] = useState(null);
  const [isInteractive, setIsInteractive] = useState(true);

  // 1. Initial Load: Fetch live nodes & edges from Supabase (or fallback) into Redux store
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const { nodes: dbNodes, edges: dbEdges } = await fetchGraphData();
      if (isMounted && dbNodes && dbNodes.length > 0) {
        dispatch(setGraphData({ nodes: dbNodes, edges: dbEdges }));
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // 2. Keep local React Flow canvas synced with Redux store
  useEffect(() => {
    if (reduxNodes && reduxNodes.length > 0) {
      setNodes(reduxNodes);
    }
  }, [reduxNodes, setNodes]);

  useEffect(() => {
    if (reduxEdges) {
      setEdges(reduxEdges);
    }
  }, [reduxEdges, setEdges]);

  const handleSelectionChange = useCallback(({ nodes: selNodes, edges: selEdges }) => {
    setSelectedElements([...selNodes, ...selEdges]);
  }, []);

  const handleConfirmDelete = async () => {
    const selectedNodeIds = selectedElements.filter((el) => !el.source).map((el) => String(el.id));
    const selectedEdgeIds = selectedElements.filter((el) => el.source).map((el) => String(el.id));

    dispatch(removeElements({ nodeIds: selectedNodeIds, edgeIds: selectedEdgeIds }));

    for (const id of selectedNodeIds) {
      await deleteNodeFromDb(id);
    }
    for (const id of selectedEdgeIds) {
      await deleteEdgeFromDb(id);
    }

    setSelectedElements([]);
    setShowDeleteModal(false);
  };

  const handleApproveEdge = useCallback(
    async (edgeId) => {
      dispatch(approveEdgeAction(edgeId));
      const edge = reduxEdges.find((e) => String(e.id) === String(edgeId));
      if (edge) {
        await saveEdge({
          ...edge,
          data: { ...edge.data, isSuggested: false, label: 'Approved' },
          is_suggested: false,
          label: 'Approved',
        });
      }
    },
    [dispatch, reduxEdges]
  );

  const handleRejectEdge = useCallback(
    async (edgeId) => {
      dispatch(rejectEdgeAction(edgeId));
      await deleteEdgeFromDb(edgeId);
    },
    [dispatch]
  );

  const interactiveEdges = useMemo(() => {
    return (edges || []).map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        onApprove: handleApproveEdge,
        onReject: handleRejectEdge,
      },
    }));
  }, [edges, handleApproveEdge, handleRejectEdge]);

  const onConnect = useCallback(
    async (params) => {
      const newEdge = {
        id: `edge-${Date.now()}`,
        source: String(params.source),
        target: String(params.target),
        type: 'edgeBadge',
        data: { isSuggested: false, label: 'Approved' },
        is_suggested: false,
        label: 'Approved',
      };
      dispatch(addEdge(newEdge));
      await saveEdge(newEdge);
    },
    [dispatch]
  );

  const handleNodeClick = (_, node) => {
    if (!isInteractive) return;

    // Dispatch clicked node ID to Redux Inspector Drawer
    dispatch(setSelectedNodeId(node.id));

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

  const handleNodeDragStop = useCallback(
    (event, node) => {
      dispatch(updateNodePosition({ id: node.id, position: node.position }));
      updateNodePositionInDb(node.id, node.position);
    },
    [dispatch]
  );

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

  const handleConfirmConnection = async () => {
    if (!pendingConnection) return;
    const newEdge = {
      id: `edge-${Date.now()}`,
      source: String(pendingConnection.source),
      target: String(pendingConnection.target),
      type: 'edgeBadge',
      data: { isSuggested: true, label: 'Suggested' },
      is_suggested: true,
      label: 'Suggested',
    };
    dispatch(addEdge(newEdge));
    await saveEdge(newEdge);

    setPendingConnection(null);
    setConnectSourceId(null);
  };

  const handleEdgeClick = (_, edge) => {
    if (!isInteractive) return;
    setEdgeToDelete(edge.id);
  };

  const handleConfirmEdgeDelete = async () => {
    if (!edgeToDelete) return;
    dispatch(rejectEdgeAction(edgeToDelete));
    await deleteEdgeFromDb(edgeToDelete);
    setEdgeToDelete(null);
  };

  const edgeToDeleteInfo = edges.find((e) => e.id === edgeToDelete);
  const sourceNodeLabel = (id) => nodes.find((n) => n.id === id)?.data?.label || id;

  const displayNodes = useMemo(() => {
    return (nodes || []).map((n) => {
      const isConnectSource = n.id === connectSourceId;
      const isHighlighted = highlightedNodeIds.includes(String(n.id));

      let updatedStyle = { ...(n.style || {}) };

      if (isConnectSource) {
        updatedStyle = {
          ...updatedStyle,
          boxShadow: `0 0 0 4px ${theme.colors.accent}`,
        };
      } else if (isHighlighted) {
        updatedStyle = {
          ...updatedStyle,
          boxShadow: `0 0 16px ${theme.colors.accent}`,
        };
      }

      const resolvedType = n.data?.type || n.entityType || n.type || 'Entity';
      const resolvedLabel = n.data?.label || n.label || `Entity #${n.id}`;

      return {
        ...n,
        type: 'entityNode',
        data: {
          ...(n.data || {}),
          label: resolvedLabel,
          type: resolvedType,
        },
        style: updatedStyle,
      };
    });
  }, [nodes, connectSourceId, highlightedNodeIds]);

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
        onNodeDragStop={handleNodeDragStop}
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