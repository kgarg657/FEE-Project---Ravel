import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InvestigationCanvas from './pages/InvestigationCanvas';
import Analytics from './pages/Analytics';
import EntityRegistry from './pages/EntityRegistry';
import CaseManagement from './pages/CaseManagement';
import Settings from './pages/Settings';
import {
  setNodes as setReduxNodes,
  setEdges as setReduxEdges,
  addNode,
  addEdge,
  approveEdge,
  rejectEdge,
} from './store/graphSlice';
import { saveNode, saveEdge, deleteEdgeFromDb } from './services/graphService';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [highlightedNodeIds, setHighlightedNodeIds] = useState([]);

  // Read single source of truth from Redux
  const nodes = useSelector((state) => state.graph.nodes);
  const edges = useSelector((state) => state.graph.edges);

  const setNodes = (newNodes) => {
    dispatch(setReduxNodes(typeof newNodes === 'function' ? newNodes(nodes) : newNodes));
  };

  const setEdges = (newEdges) => {
    dispatch(setReduxEdges(typeof newEdges === 'function' ? newEdges(edges) : newEdges));
  };

  const handleApproveEdge = async (edgeId) => {
    dispatch(approveEdge(edgeId));
    const edge = edges.find((e) => String(e.id) === String(edgeId));
    if (edge) {
      await saveEdge({
        ...edge,
        data: { ...edge.data, isSuggested: false, label: 'Approved' },
        is_suggested: false,
        label: 'Approved',
      });
    }
  };

  const handleRejectEdge = async (edgeId) => {
    dispatch(rejectEdge(edgeId));
    await deleteEdgeFromDb(edgeId);
  };

  const handleAddEntity = async (newEntity) => {
    const newId = String(newEntity.id || Date.now());
    const randomPosition = newEntity.position || {
      x: 280 + Math.random() * 80,
      y: 180 + Math.random() * 80,
    };

    const newNode = {
      id: newId,
      type: 'entityNode',
      position: randomPosition,
      data: {
        label: newEntity.label || newEntity.name,
        type: newEntity.type,
        role: newEntity.role || newEntity.dept || newEntity.type,
        dept: newEntity.dept || newEntity.role || '',
        gst: newEntity.gst || '',
        riskScore: newEntity.riskScore || 30,
        riskLevel: newEntity.riskLevel || 'Low',
        amount: newEntity.amount || '',
        status: newEntity.status || 'Active',
        ...(newEntity.metadata || {}),
      },
    };

    dispatch(addNode(newNode));
    await saveNode(newNode);

    if (newEntity.targetIds && newEntity.targetIds.length > 0) {
      const isSuggested = newEntity.linkType === 'suggested';
      for (const [index, targetId] of newEntity.targetIds.entries()) {
        const edgeId = `edge-${Date.now()}-${index}`;
        const newEdge = {
          id: edgeId,
          source: newId,
          target: String(targetId),
          type: 'edgeBadge',
          data: { isSuggested, label: isSuggested ? 'Suggested' : 'Approved' },
          is_suggested: isSuggested,
          label: isSuggested ? 'Suggested' : 'Approved',
        };
        dispatch(addEdge(newEdge));
        await saveEdge(newEdge);
      }
    }
  };

  const handleNavigateToGraph = (path, nodeIds = []) => {
    setHighlightedNodeIds(nodeIds);
    navigate(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Routes>
      {/* Standalone Public Pages */}
      <Route path="/" element={<Landing onNavigate={handleNavigate} />} />
      <Route path="/landing" element={<Landing onNavigate={handleNavigate} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Internal Protected Pages */}
      <Route
        path="/canvas"
        element={
          <MainLayout currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout}>
            <InvestigationCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onApproveEdge={handleApproveEdge}
              onRejectEdge={handleRejectEdge}
              onAddEntity={handleAddEntity}
              highlightedNodeIds={highlightedNodeIds}
              onClearHighlights={() => setHighlightedNodeIds([])}
            />
          </MainLayout>
        }
      />

      <Route
        path="/investigations/1"
        element={
          <MainLayout currentPath="/investigations/1" onNavigate={handleNavigate} onLogout={handleLogout}>
            <InvestigationCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              onApproveEdge={handleApproveEdge}
              onRejectEdge={handleRejectEdge}
              onAddEntity={handleAddEntity}
              highlightedNodeIds={highlightedNodeIds}
              onClearHighlights={() => setHighlightedNodeIds([])}
            />
          </MainLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <MainLayout currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout}>
            <Analytics
              nodes={nodes}
              edges={edges}
              onNavigateToGraph={handleNavigateToGraph}
            />
          </MainLayout>
        }
      />

      <Route
        path="/registry"
        element={
          <MainLayout currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout}>
            <EntityRegistry
              nodes={nodes}
              edges={edges}
              onAddEntity={handleAddEntity}
              onNavigateToGraph={handleNavigateToGraph}
            />
          </MainLayout>
        }
      />

      <Route
        path="/entities"
        element={
          <MainLayout currentPath="/entities" onNavigate={handleNavigate} onLogout={handleLogout}>
            <EntityRegistry
              nodes={nodes}
              edges={edges}
              onAddEntity={handleAddEntity}
              onNavigateToGraph={handleNavigateToGraph}
            />
          </MainLayout>
        }
      />

      {/* Case Management Route */}
      <Route
        path="/cases"
        element={
          <MainLayout currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout}>
            <CaseManagement onNavigate={handleNavigate} />
          </MainLayout>
        }
      />

      {/* Settings Route */}
      <Route
        path="/settings"
        element={
          <MainLayout currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout}>
            <Settings />
          </MainLayout>
        }
      />
    </Routes>
  );
}