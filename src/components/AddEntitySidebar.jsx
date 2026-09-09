import React, { useState } from 'react';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import theme from '../theme';

function AddEntitySidebar({ existingNodes = [], onAddEntity }) {
  const [formData, setFormData] = useState({
    type: 'Vendor',
    name: '',
    gstNumber: '',
    employeeId: '',
    department: '',
    invoiceNumber: '',
    amount: '',
    txnHash: '',
    selectedTargetIds: [],
    linkType: 'suggested',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleTarget = (nodeId) => {
    setFormData((prev) => {
      const exists = prev.selectedTargetIds.includes(nodeId);
      const updated = exists
        ? prev.selectedTargetIds.filter((id) => id !== nodeId)
        : [...prev.selectedTargetIds, nodeId];
      return { ...prev, selectedTargetIds: updated };
    });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an Entity Name / Label');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmAdd = () => {
    if (onAddEntity) {
      let metadata = {};
      if (formData.type === 'Vendor') metadata = { gst: formData.gstNumber };
      if (formData.type === 'Employee') metadata = { empId: formData.employeeId, dept: formData.department };
      if (formData.type === 'Invoice') metadata = { invoiceNo: formData.invoiceNumber, amount: formData.amount };
      if (formData.type === 'Txn') metadata = { txnHash: formData.txnHash, amount: formData.amount };

      onAddEntity({
        id: `node-${Date.now()}`,
        type: formData.type,
        label: formData.name,
        metadata,
        targetIds: formData.selectedTargetIds,
        linkType: formData.linkType,
      });
    }

    setShowConfirmModal(false);
    setFormData({
      type: 'Vendor',
      name: '',
      gstNumber: '',
      employeeId: '',
      department: '',
      invoiceNumber: '',
      amount: '',
      txnHash: '',
      selectedTargetIds: [],
      linkType: 'suggested',
    });
  };

  const selectedTargetNames = existingNodes
    .filter((n) => formData.selectedTargetIds.includes(n.id))
    .map((n) => `${n.data.type}: ${n.data.label}`);

  return (
    <>
      <Card title="Add Entity & Relationships">
        <form onSubmit={handlePreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: theme.colors.textSecondary, fontFamily: theme.fonts.sans }}>
              Entity Category
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              style={selectStyle}
            >
              <option value="Vendor">Vendor</option>
              <option value="Employee">Employee</option>
              <option value="Invoice">Invoice</option>
              <option value="Txn">Transaction</option>
            </select>
          </div>

          <Input
            label="Entity Name / ID"
            placeholder={formData.type === 'Vendor' ? 'e.g. Ace Corp Ltd' : 'e.g. John Smith'}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          {formData.type === 'Vendor' && (
            <Input
              label="GST Registration Number"
              placeholder="07AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChange={(e) => handleChange('gstNumber', e.target.value)}
            />
          )}

          {formData.type === 'Employee' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Input
                label="Employee ID"
                placeholder="EMP-9021"
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
              />
              <Input
                label="Department"
                placeholder="Procurement"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
          )}

          {formData.type === 'Invoice' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Input
                label="Invoice No."
                placeholder="#INV-2026-09"
                value={formData.invoiceNumber}
                onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              />
              <Input
                label="Amount ($)"
                placeholder="45,000"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
              />
            </div>
          )}

          {formData.type === 'Txn' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Input
                label="Txn Hash / ID"
                placeholder="0x9a8f...321"
                value={formData.txnHash}
                onChange={(e) => handleChange('txnHash', e.target.value)}
              />
              <Input
                label="Amount ($)"
                placeholder="12,500"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: theme.colors.textSecondary, fontFamily: theme.fonts.sans }}>
              Connect To Nodes ({formData.selectedTargetIds.length} selected)
            </label>

            <div
              style={{
                maxHeight: '100px',
                overflowY: 'auto',
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {existingNodes.length === 0 ? (
                <span style={{ fontSize: '11px', color: theme.colors.textMuted }}>No existing nodes</span>
              ) : (
                existingNodes.map((node) => {
                  const isChecked = formData.selectedTargetIds.includes(node.id);
                  return (
                    <label
                      key={node.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        color: theme.colors.textPrimary,
                        cursor: 'pointer',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        backgroundColor: isChecked ? theme.colors.surfaceHover : 'transparent',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTarget(node.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{node.data.type}: <strong>{node.data.label}</strong></span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {formData.selectedTargetIds.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: theme.colors.textSecondary, fontFamily: theme.fonts.sans }}>
                Relationship Line Type
              </label>
              <select
                value={formData.linkType}
                onChange={(e) => handleChange('linkType', e.target.value)}
                style={selectStyle}
              >
                <option value="suggested">Suggested (Dashed with A/R Badges)</option>
                <option value="approved">Approved (Solid Blue)</option>
              </select>
            </div>
          )}

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '4px' }}>
            Add & Connect Entity
          </Button>
        </form>
      </Card>

      {showConfirmModal && (
        <Modal isOpen={showConfirmModal} title="Confirm Registration" onClose={() => setShowConfirmModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: theme.fonts.sans }}>
            <p style={{ fontSize: '13px', color: theme.colors.textPrimary, margin: 0 }}>
              Confirm adding this entity to the active investigation graph:
            </p>

            <div
              style={{
                backgroundColor: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12px',
              }}
            >
              <div><strong style={{ color: theme.colors.textSecondary }}>Category:</strong> {formData.type}</div>
              <div><strong style={{ color: theme.colors.textSecondary }}>Name/ID:</strong> {formData.name}</div>
              {formData.gstNumber && <div><strong style={{ color: theme.colors.textSecondary }}>GST:</strong> {formData.gstNumber}</div>}
              {formData.employeeId && <div><strong style={{ color: theme.colors.textSecondary }}>Emp ID:</strong> {formData.employeeId} ({formData.department})</div>}
              {formData.amount && <div><strong style={{ color: theme.colors.textSecondary }}>Amount:</strong> ${formData.amount}</div>}

              <div>
                <strong style={{ color: theme.colors.textSecondary }}>Target Connections ({selectedTargetNames.length}):</strong>
                {selectedTargetNames.length > 0 ? (
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {selectedTargetNames.map((n, i) => (
                      <li key={i} style={{ color: theme.colors.accent }}>{n}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: theme.colors.textMuted }}> None (Standalone Node)</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmAdd}>Confirm & Add</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

const selectStyle = {
  backgroundColor: theme.colors.bg,
  color: theme.colors.textPrimary,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '6px',
  padding: '8px',
  fontSize: '12px',
  outline: 'none',
  fontFamily: theme.fonts.sans,
  cursor: 'pointer',
};

export default AddEntitySidebar;