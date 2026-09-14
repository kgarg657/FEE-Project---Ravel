import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InvestigationCanvas from './pages/InvestigationCanvas';
import Analytics from './pages/Analytics';
import EntityRegistry from './pages/EntityRegistry';
import { initialNodes, initialEdges } from './data/mockData';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedNodeIds, setHighlightedNodeIds] = useState([]);

  const [nodes, setNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('ravel_nodes');
      return saved ? JSON.parse(saved) : initialNodes;
    } catch {
      return initialNodes;
    }
  });

  const [edges, setEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('ravel_edges');
      return saved ? JSON.parse(saved) : initialEdges;
    } catch {
      return initialEdges;
    }
  });

  useEffect(() => {
    localStorage.setItem('ravel_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('ravel_edges', JSON.stringify(edges));
  }, [edges]);

  const handleApproveEdge = (edgeId) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, isSuggested: false, label: 'Approved' } }
          : edge
      )
    );
  };

  const handleRejectEdge = (edgeId) => {
    setEdges((prev) => prev.filter((edge) => edge.id !== edgeId));
  };

  const handleAddEntity = (newEntity) => {
    const newId = String(newEntity.id || Date.now());
    const newNode = {
      id: newId,
      type: 'entityNode',
      position: { x: 280 + Math.random() * 80, y: 180 + Math.random() * 80 },
      data: { 
        label: newEntity.label || newEntity.name, 
        type: newEntity.type, 
        gst: newEntity.gst,
        status: newEntity.status,
        ...newEntity.metadata 
      },
    };

    setNodes((prev) => [...prev, newNode]);

    if (newEntity.targetIds && newEntity.targetIds.length > 0) {
      const isSuggested = newEntity.linkType === 'suggested';
      const newEdges = newEntity.targetIds.map((targetId, index) => ({
        id: `edge-${Date.now()}-${index}`,
        source: newId,
        target: String(targetId),
        type: 'edgeBadge',
        data: { isSuggested, label: isSuggested ? 'Suggested' : 'Approved' },
      }));
      setEdges((prev) => [...prev, ...newEdges]);
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
    </Routes>
  );
}