// src/App.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import InvestigationCanvas from './pages/InvestigationCanvas';
import Analytics from './pages/Analytics';
import EntityRegistry from './pages/EntityRegistry';
import { initialNodes, initialEdges } from './data/mockData';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/canvas');
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

  // Handler Functions
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
    setCurrentPath(path);
  };

  return (
    <MainLayout currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)}>
      {(currentPath === '/canvas' || currentPath === '/investigations/1') && (
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
      )}

      {currentPath === '/analytics' && (
        <Analytics
          nodes={nodes}
          edges={edges}
          onNavigateToGraph={handleNavigateToGraph}
        />
      )}

      {(currentPath === '/registry' || currentPath === '/entities') && (
        <EntityRegistry
          nodes={nodes}
          edges={edges}
          onAddEntity={handleAddEntity}
          onNavigateToGraph={handleNavigateToGraph}
        />
      )}
    </MainLayout>
  );
}