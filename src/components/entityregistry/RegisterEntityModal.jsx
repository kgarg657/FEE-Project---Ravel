import React, { useState } from 'react';
import { User, Building2, FileText, DollarSign, PlusCircle } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import theme from '../../theme';

export default function RegisterEntityModal({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState('Employee');
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('Verified');
  
  // Dynamic fields
  const [dept, setDept] = useState('');
  const [ssn, setSsn] = useState('');
  const [gst, setGst] = useState('');
  const [vendorBank, setVendorBank] = useState('');
  const [amount, setAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label) return;

    // Package entity data according to type
    const newEntity = {
      id: String(Date.now()),
      label,
      type,
      status,
      metadata: {
        ...(type === 'Employee' && { dept, ssn }),
        ...(type === 'Vendor' && { gst, bank: vendorBank }),
        ...(type === 'Invoice' && { amount, date: invoiceDate, gst }),
        ...(type === 'Txn' && { amount, date: invoiceDate }),
      },
    };

    if (onSubmit) onSubmit(newEntity);

    // Reset Form
    setLabel('');
    setDept('');
    setSsn('');
    setGst('');
    setVendorBank('');
    setAmount('');
    setInvoiceDate('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Register New Master Entity" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
        
        {/* Entity Type Selector Tabs */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '6px', fontWeight: 600 }}>
            Select Entity Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'Employee', icon: User },
              { id: 'Vendor', icon: Building2 },
              { id: 'Invoice', icon: FileText },
              { id: 'Txn', icon: DollarSign },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = type === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
                    backgroundColor: isSelected ? `${theme.colors.accent}20` : theme.colors.bg,
                    color: isSelected ? theme.colors.accent : theme.colors.textSecondary,
                  }}
                >
                  <IconComp size={14} /> {item.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Common Field: Name / Label */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
            {type === 'Employee' ? 'Employee Full Name' : type === 'Vendor' ? 'Vendor / Company Name' : 'Invoice Reference Code'}
          </label>
          <input
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={type === 'Employee' ? 'e.g. A. Sharma' : type === 'Vendor' ? 'e.g. Acme Corp' : 'e.g. #INV-909'}
            style={{
              width: '100%',
              backgroundColor: theme.colors.bg,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '12px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* DYNAMIC FIELDS PER TYPE */}
        {type === 'Employee' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Department</label>
              <input
                type="text"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Finance"
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Employee SSN / Govt ID</label>
              <input
                type="text"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
                placeholder="e.g. EMP-9982"
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {type === 'Vendor' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>GSTIN Identifier</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="07AAAAA0000A1Z5"
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Bank Account Ref</label>
              <input
                type="text"
                value={vendorBank}
                onChange={(e) => setVendorBank(e.target.value)}
                placeholder="AC-9908123"
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {(type === 'Invoice' || type === 'Txn') && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>Transaction Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                style={{ width: '100%', backgroundColor: theme.colors.bg, color: theme.colors.textPrimary, border: `1px solid ${theme.colors.border}`, borderRadius: '6px', padding: '8px 10px', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {/* Verification Status */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: theme.colors.textSecondary, marginBottom: '4px' }}>
            Initial Verification Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: theme.colors.bg,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '12px',
              boxSizing: 'border-box',
            }}
          >
            <option value="Verified">Verified</option>
            <option value="Suggested">Suggested</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PlusCircle size={14} /> Save Entity
          </Button>
        </div>
      </form>
    </Modal>
  );
}