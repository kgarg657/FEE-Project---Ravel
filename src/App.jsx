import React, { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import GraphCanvas from './components/GraphCanvas';
import AddEntitySidebar from './components/AddEntitySidebar';
import PendingLinkSuggestions from './components/PendingLinkSuggestions';
import theme from './theme';

// Baseline Mock Nodes
const sampleNodes = [
  { id: '1', type: 'entityNode', position: { x: 60, y: 180 }, data: { label: 'B. Patel', type: 'Employee' } },
  { id: '2', type: 'entityNode', position: { x: 250, y: 100 }, data: { label: 'A. Sharma', type: 'Employee' } },
  { id: '3', type: 'entityNode', position: { x: 450, y: 80 }, data: { label: 'Acme Corp', type: 'Vendor' } },
  { id: '4', type: 'entityNode', position: { x: 230, y: 320 }, data: { label: 'Tata Steel', type: 'Vendor' } },
  { id: '5', type: 'entityNode', position: { x: 430, y: 260 }, data: { label: '#I-402 (Acme)', type: 'Invoice' } },
  { id: '6', type: 'entityNode', position: { x: 500, y: 420 }, data: { label: '#T-991', type: 'Txn' } },
  { id: '7', type: 'entityNode', position: { x: 650, y: 220 }, data: { label: '#I-403 (Tata)', type: 'Invoice' } },
];

// Single Source of Truth for Edges (Contains both Approved and Suggested links)
const sampleEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e2-3', source: '2', target: '3', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e1-4', source: '1', target: '4', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e3-5', source: '3', target: '5', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e4-5', source: '4', target: '5', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e4-6', source: '4', target: '6', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e3-7', source: '3', target: '7', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  
  // Initial Suggested Edges (Dashed lines with A/R badges on canvas AND sidebar)
  { id: 'sug-1', source: '1', target: '5', type: 'edgeBadge', data: { isSuggested: true, label: 'Suggested' } },
  { id: 'sug-2', source: '5', target: '7', type: 'edgeBadge', data: { isSuggested: true, label: 'Suggested' } },
  { id: 'sug-3', source: '6', target: '7', type: 'edgeBadge', data: { isSuggested: true, label: 'Suggested' } },
];

export default function App() {
  const [currentPath, setCurrentPath] = useState('/canvas');
  const [nodes, setNodes] = useState(sampleNodes);
  const [edges, setEdges] = useState(sampleEdges);

  // Derive pending suggestions list directly from edges array
  const pendingSuggestions = edges
    .filter((edge) => edge.data?.isSuggested)
    .map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      return {
        id: edge.id,
        description: `${sourceNode?.data.type || 'Entity'}: ${sourceNode?.data.label || edge.source} linked to ${targetNode?.data.type || 'Entity'}: ${targetNode?.data.label || edge.target}`,
      };
    });

  // Handler: Approve suggestion (Flips dashed line to solid approved line)
  const handleApproveEdge = (edgeId) => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, isSuggested: false, label: 'Approved' } }
          : edge
      )
    );
  };

  // Handler: Reject suggestion (Removes edge from graph and sidebar)
  const handleRejectEdge = (edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  };

  // Handler: Add Entity (Appends new node and target edges)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <div>
            <h1 style={{ color: theme.colors.textPrimary, margin: '0 0 4px 0', fontSize: '1.5rem', fontFamily: theme.fonts.sans }}>
              Active Investigation: Procurement Audit Q3 2026
            </h1>
            <p style={{ color: theme.colors.textSecondary, margin: 0, fontSize: '0.88rem', fontFamily: theme.fonts.sans }}>
              Logged in: J. Doe (Senior Auditor)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>
            <div style={{ height: '620px', width: '100%' }}>
              <GraphCanvas
                initialNodes={nodes}
                initialEdges={edges}
                onNodesChangeParent={setNodes}
                onEdgesChangeParent={setEdges}
                onNodeClick={(node) => console.log('Selected Node:', node)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AddEntitySidebar existingNodes={nodes} onAddEntity={handleAddEntity} />
              <PendingLinkSuggestions
                suggestions={pendingSuggestions}
                onApprove={handleApproveEdge}
                onReject={handleRejectEdge}
              />
            </div>
          </div>
        </div>
      )}

      {currentPath === '/entities' && <h1 style={{ color: theme.colors.textPrimary }}>Entity Registry</h1>}
      {currentPath === '/analytics' && <h1 style={{ color: theme.colors.textPrimary }}>Forensic Analytics</h1>}
      {currentPath === '/cases' && <h1 style={{ color: theme.colors.textPrimary }}>Case Management</h1>}
      {currentPath === '/settings' && <h1 style={{ color: theme.colors.textPrimary }}>Platform Settings</h1>}
    </MainLayout>
  );
}