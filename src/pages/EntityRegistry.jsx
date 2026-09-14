import React, { useState, useMemo } from 'react';
import EntityRegistryHeader from '../components/entityregistry/EntityRegistryHeader';
import UnifiedEntityList from '../components/entityregistry/UnifiedEntityList';
import RegistrySidebar from '../components/entityregistry/RegistrySidebar';
import RegisterEntityModal from '../components/entityregistry/RegisterEntityModal';
import Modal from '../components/Modal';
import Button from '../components/Button';
import theme from '../theme';

export default function EntityRegistry({ nodes = [], edges = [], onAddEntity, onNavigateToGraph }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewEntity, setReviewEntity] = useState(null);

  const registryEntities = useMemo(() => {
    return nodes.map((node) => {
      const connectedEdges = edges.filter(
        (e) => String(e.source) === String(node.id) || String(e.target) === String(node.id)
      );

      const linkedInvoices = connectedEdges
        .map((e) => {
          const otherId = String(e.source) === String(node.id) ? e.target : e.source;
          const otherNode = nodes.find((n) => String(n.id) === String(otherId));
          return otherNode?.data?.label || otherId;
        })
        .filter((label) => label.toLowerCase().includes('inv') || label.toLowerCase().includes('#i'));

      const isSuggested = connectedEdges.some((e) => e.data?.isSuggested);
      const riskLevel = node.data?.riskLevel || 'Low';
      let status = 'Verified';

      if (riskLevel === 'Critical' || riskLevel === 'High') {
        status = 'Flagged';
      } else if (isSuggested) {
        status = 'Suggested';
      }

      return {
        id: String(node.id),
        type: node.data?.type || 'Entity',
        name: node.data?.label || `Entity #${node.id}`,
        keyIdentifiers: `GST: ${node.data?.gst || 'N/A'}\nDept: ${node.data?.dept || 'N/A'}\nAmt: ${
          node.data?.amount ? `$${node.data.amount}` : 'N/A'
        }`,
        status,
        linkedInvoices: linkedInvoices.length > 0 ? linkedInvoices : [],
        associatedVendor: node.data?.sender || (node.data?.type === 'Vendor' ? node.data?.label : '-'),
        lastModified: node.data?.date || '12/06/2026',
      };
    });
  }, [nodes, edges]);

  const filteredEntities = useMemo(() => {
    return registryEntities.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !selectedType || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesRisk = !selectedRisk || item.status.toLowerCase() === selectedRisk.toLowerCase();

      return matchesSearch && matchesType && matchesRisk;
    });
  }, [registryEntities, searchQuery, selectedType, selectedRisk]);

  const handleRegisterNewEntity = (newEntityData) => {
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: theme.colors.textPrimary, textAlign: 'left' }}>
            <p><strong>Entity Name:</strong> {reviewEntity.name}</p>
            <p><strong>Entity Type:</strong> {reviewEntity.type}</p>
            <p><strong>Identifiers:</strong></p>
            <pre style={{ backgroundColor: theme.colors.bg, padding: '8px', borderRadius: '4px', fontSize: '11px' }}>
              {reviewEntity.keyIdentifiers}
            </pre>
            <p><strong>Verification Status:</strong> {reviewEntity.status}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <Button variant="primary" onClick={() => {
                if (onNavigateToGraph) onNavigateToGraph('/canvas', [reviewEntity.id]);
                setReviewEntity(null);
              }}>
                View on Graph Canvas
              </Button>
              <Button variant="secondary" onClick={() => setReviewEntity(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}