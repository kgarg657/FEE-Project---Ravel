import React, { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import InvestigationCanvas from './pages/InvestigationCanvas';
import theme from './theme';

// Baseline Mock Data
const defaultNodes = [
  { id: '1', type: 'entityNode', position: { x: 80, y: 160 }, data: { label: 'B. Patel', type: 'Employee', dept: 'Procurement' } },
  { id: '2', type: 'entityNode', position: { x: 280, y: 80 }, data: { label: 'A. Sharma', type: 'Employee', dept: 'Finance' } },
  { id: '3', type: 'entityNode', position: { x: 480, y: 80 }, data: { label: 'Ace Corp', type: 'Vendor', gst: '07AAAAA0000A1Z5' } },
  { id: '4', type: 'entityNode', position: { x: 260, y: 320 }, data: { label: 'Global Trade', type: 'Vendor', gst: '09BBBBB1111B2Y6' } },
  { id: '5', type: 'entityNode', position: { x: 460, y: 260 }, data: { label: '#I-402 (Ace)', type: 'Invoice', amount: '45000' } },
  { id: '6', type: 'entityNode', position: { x: 520, y: 440 }, data: { label: '#T-505', type: 'Txn', amount: '85000', sender: 'B. Patel' } },
  { id: '7', type: 'entityNode', position: { x: 680, y: 220 }, data: { label: '#I-808 (Ace)', type: 'Invoice', amount: '85000', gst: '07AAAAA0000A1Z5' } },
  { id: '8', type: 'entityNode', position: { x: 120, y: 420 }, data: { label: 'Global Trade Sub-Contract', type: 'Invoice', amount: '12000', gst: '09BBBBB1111B2Y6' } },
];

const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e2-3', source: '2', target: '3', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e1-4', source: '1', target: '4', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e3-5', source: '3', target: '5', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState('/canvas');

  // Persistent Canvas State
  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem('ravel_nodes');
    return saved ? JSON.parse(saved) : defaultNodes;
  });

  const [edges, setEdges] = useState(() => {
    const saved = localStorage.getItem('ravel_edges');
    return saved ? JSON.parse(saved) : defaultEdges;
  });

  // Sync state mutations to localStorage automatically
  useEffect(() => {
    localStorage.setItem('ravel_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('ravel_edges', JSON.stringify(edges));
  }, [edges]);

  // Edge Handlers
  const handleApproveEdge = (edgeId) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, isSuggested: false, label: 'Approved' } }
          : edge
      )
    );
  };

  const handleRejectEdge = (edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  // Add Entity Handler
  const handleAddEntity = (newEntity) => {
    const newId = newEntity.id;
    const newNode = {
      id: newId,
      type: 'entityNode',
      position: { x: 280 + Math.random() * 80, y: 180 + Math.random() * 80 },
      data: { label: newEntity.label, type: newEntity.type, ...newEntity.metadata },
    };

    setNodes((prev) => [...prev, newNode]);

    if (newEntity.targetIds && newEntity.targetIds.length > 0) {
      const isSuggested = newEntity.linkType === 'suggested';
      const newEdges = newEntity.targetIds.map((targetId, index) => ({
        id: `edge-${Date.now()}-${index}`,
        source: newId,
        target: targetId,
        type: 'edgeBadge',
        data: {
          isSuggested: isSuggested,
          label: isSuggested ? 'Suggested' : 'Approved',
        },
      }));

      setEdges((prev) => [...prev, ...newEdges]);
    }
  };

  return (
    <MainLayout
      currentPath={currentPath}
      onNavigate={(path) => setCurrentPath(path)}
      onLogout={() => alert('Logging out...')}
    >
      {(currentPath === '/canvas' || currentPath === '/investigations/1') && (
        <InvestigationCanvas
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          onApproveEdge={handleApproveEdge}
          onRejectEdge={handleRejectEdge}
          onAddEntity={handleAddEntity}
        />
      )}

      {currentPath === '/entities' && <h1 style={{ color: theme.colors.textPrimary }}>Entity Registry</h1>}
      {currentPath === '/analytics' && <h1 style={{ color: theme.colors.textPrimary }}>Forensic Analytics</h1>}
      {currentPath === '/cases' && <h1 style={{ color: theme.colors.textPrimary }}>Case Management</h1>}
      {currentPath === '/settings' && <h1 style={{ color: theme.colors.textPrimary }}>Platform Settings</h1>}
    </MainLayout>
  );
}