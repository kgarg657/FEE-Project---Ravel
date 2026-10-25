import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EntityRegistryHeader from '../components/entityregistry/EntityRegistryHeader';
import UnifiedEntityList from '../components/entityregistry/UnifiedEntityList';
import RegistrySidebar from '../components/entityregistry/RegistrySidebar';
import RegisterEntityModal from '../components/entityregistry/RegisterEntityModal';
import Modal from '../components/Modal';
import Button from '../components/Button';
import theme from '../theme';

// Redux & Supabase Actions
import { addNode, addEdge } from '../store/graphSlice';
import { saveNode, saveEdge } from '../services/graphService';

export default function EntityRegistry({
  nodes: parentNodes,
  edges: parentEdges,
  onAddEntity,
  onNavigateToGraph,
}) {
  const dispatch = useDispatch();

  // 1. Fallback to Redux store if parent props are empty
  const reduxNodes = useSelector((state) => state.graph.nodes);
  const reduxEdges = useSelector((state) => state.graph.edges);

  const nodes = parentNodes && parentNodes.length > 0 ? parentNodes : reduxNodes;
  const edges = parentEdges && parentEdges.length > 0 ? parentEdges : reduxEdges;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewEntity, setReviewEntity] = useState(null);

  // 2. Map nodes & edges into Entity Registry table view format
  const registryEntities = useMemo(() => {
    return nodes.map((node) => {
      const connectedEdges = edges.filter(
        (e) => String(e.source) === String(node.id) || String(e.target) === String(node.id)
      );

      const linkedInvoices = connectedEdges
        .map((e) => {
          const otherId = String(e.source) === String(node.id) ? e.target : e.source;
          const otherNode = nodes.find((n) => String(n.id) === String(otherId));
          return otherNode?.data?.label || otherNode?.label || otherId;
        })
        .filter(
          (label) =>
            typeof label === 'string' &&
            (label.toLowerCase().includes('inv') || label.toLowerCase().includes('#i'))
        );

      const isSuggested = connectedEdges.some((e) => e.data?.isSuggested || e.is_suggested);
      const riskScore = node.data?.riskScore || node.risk_score || 0;
      const riskLevel =
        node.data?.riskLevel || (riskScore >= 70 ? 'Critical' : riskScore >= 40 ? 'High' : 'Low');

      let status = 'Verified';

      if (riskLevel === 'Critical' || riskLevel === 'High') {
        status = 'Flagged';
      } else if (isSuggested) {
        status = 'Suggested';
      }

      return {
        id: String(node.id),
        type: node.data?.type || node.type || 'Entity',
        name: node.data?.label || node.label || `Entity #${node.id}`,
        keyIdentifiers: `GST: ${node.data?.gst || node.gst || 'N/A'}\nDept: ${
          node.data?.dept || node.role || 'N/A'
        }\nAmt: ${node.data?.amount ? `$${node.data.amount}` : 'N/A'}`,
        status,
        linkedInvoices: linkedInvoices.length > 0 ? linkedInvoices : [],
        associatedVendor:
          node.data?.sender ||
          ((node.data?.type || node.type) === 'Vendor' ? node.data?.label || node.label : '-'),
        lastModified: node.data?.date || '12/06/2026',
      };
    });
  }, [nodes, edges]);

  // 3. Filter entities by search term, type, and risk status
  const filteredEntities = useMemo(() => {
    return registryEntities.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesRisk =
        !selectedRisk || item.status.toLowerCase() === selectedRisk.toLowerCase();

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [registryEntities, searchQuery, selectedType, selectedRisk]);

  // 4. Handle registering new entity from table modal
  const handleRegisterNewEntity = async (newEntityData) => {
    const newNodeId = `node-${Date.now()}`;
    const randomPosition = {
      x: Math.floor(Math.random() * 400) + 100,
      y: Math.floor(Math.random() * 300) + 100,
    };

    const newNode = {
      id: newNodeId,
      type: 'entityNode',
      position: randomPosition,
      data: {
        label: newEntityData.label || newEntityData.name,
        type: newEntityData.type || 'Vendor',
        gst: newEntityData.gst || '',
        dept: newEntityData.dept || '',
        amount: newEntityData.amount || null,
        riskScore: newEntityData.riskScore || 20,
        status: 'Active',
      },
    };

    // Dispatch to Redux
    dispatch(addNode(newNode));

    // Persist to Supabase DB
    await saveNode({
      id: newNode.id,
      label: newNode.data.label,
      type: newNode.data.type,
      role: newNode.data.dept,
      gst: newNode.data.gst,
      risk_score: newNode.data.riskScore,
      position: randomPosition,
    });

    // Handle target edges if created simultaneously
    if (newEntityData.targetIds && newEntityData.targetIds.length > 0) {
      for (const targetId of newEntityData.targetIds) {
        const newEdge = {
          id: `edge-${Date.now()}-${targetId}`,
          source: newNodeId,
          target: targetId,
          type: 'edgeBadge',
          data: { isSuggested: true, label: 'Suggested' },
        };
        dispatch(addEdge(newEdge));
        await saveEdge({
          id: newEdge.id,
          source: newEdge.source,
          target: newEdge.target,
          label: 'Suggested',
          is_suggested: true,
        });
      }
    }

    if (onAddEntity) {
      onAddEntity(newEntityData);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: theme.fonts.sans,
        backgroundColor: theme.colors.bg,
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <EntityRegistryHeader />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '20px',
          alignItems: 'start',
          width: '100%',
        }}
      >
        <UnifiedEntityList
          entities={filteredEntities}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedRisk={selectedRisk}
          onRiskChange={setSelectedRisk}
          onOpenModal={() => setIsModalOpen(true)}
          onNavigateToGraph={onNavigateToGraph}
          onReviewEntity={(entity) => setReviewEntity(entity)}
        />

        {/* Dynamic statistics calculated directly from live nodes and edges */}
        <RegistrySidebar nodes={nodes} edges={edges} />
      </div>

      <RegisterEntityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterNewEntity}
      />

      {/* Interactive Review Modal */}
      {reviewEntity && (
        <Modal
          isOpen={!!reviewEntity}
          title={`Audit Review: Entity #${reviewEntity.id}`}
          onClose={() => setReviewEntity(null)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '12px',
              color: theme.colors.textPrimary,
              textAlign: 'left',
            }}
          >
            <p>
              <strong>Entity Name:</strong> {reviewEntity.name}
            </p>
            <p>
              <strong>Entity Type:</strong> {reviewEntity.type}
            </p>
            <p>
              <strong>Identifiers:</strong>
            </p>
            <pre
              style={{
                backgroundColor: theme.colors.bg,
                padding: '8px',
                borderRadius: '4px',
                fontSize: '11px',
              }}
            >
              {reviewEntity.keyIdentifiers}
            </pre>
            <p>
              <strong>Verification Status:</strong> {reviewEntity.status}
            </p>
            <div
              style={{
                display: 'flex',
                justify: 'flex-end',
                gap: '8px',
                marginTop: '12px',
              }}
            >
              <Button
                variant="primary"
                onClick={() => {
                  if (onNavigateToGraph) onNavigateToGraph('/canvas', [reviewEntity.id]);
                  setReviewEntity(null);
                }}
              >
                View on Graph Canvas
              </Button>
              <Button variant="secondary" onClick={() => setReviewEntity(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}