import React, { useState } from 'react';
import { 
  Database, 
  User, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Link2, 
  Clock, 
  Eye, 
  ExternalLink,
  Plus 
} from 'lucide-react';
import Card from '../Card';
import Badge from '../Badge';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';
import Select from '../Select';
import Input from '../Input';
import theme from '../../theme';

export default function UnifiedEntityList({
  entities = [],
  searchQuery = '',
  onSearchChange,
  selectedType = '',
  onTypeChange,
  selectedRisk = '',
  onRiskChange,
  onOpenModal,
  onNavigateToGraph,
  onReviewEntity,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(entities.length / itemsPerPage) || 1;
  const currentData = entities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getEntityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'employee': return <User size={13} style={{ color: '#3b82f6' }} />;
      case 'vendor': return <Building2 size={13} style={{ color: '#f59e0b' }} />;
      case 'invoice': return <FileText size={13} style={{ color: '#10b981' }} />;
      default: return <Database size={13} style={{ color: theme.colors.accent }} />;
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
      {/* Title & Properly Sized Register Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
          <Database size={18} style={{ color: theme.colors.accent }} />
          <h3 style={{ margin: 0, color: theme.colors.textPrimary, fontSize: '1rem', fontFamily: theme.fonts.sans, fontWeight: 700 }}>
            Unified Entity List
          </h3>
        </div>
        <button
          onClick={onOpenModal}
          style={{
            backgroundColor: theme.colors.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            lineHeight: 1,
          }}
        >
          <Plus size={14} /> Register Entity
        </button>
      </div>

      {/* Aligned Control Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '12px',
          alignItems: 'start', // Aligns all label headers cleanly at top
          backgroundColor: theme.colors.bg,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '6px',
          padding: '12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: theme.colors.textMuted, textAlign: 'left', fontWeight: 600 }}>
            Search Entities
          </label>
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search by ID or Name..."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: theme.colors.textMuted, textAlign: 'left', fontWeight: 600 }}>
            Entity Type
          </label>
          <Select
            value={selectedType}
            onChange={(e) => onTypeChange && onTypeChange(e.target.value)}
            options={[
              { label: 'All Entity Types', value: '' },
              { label: 'Employee', value: 'Employee' },
              { label: 'Vendor', value: 'Vendor' },
              { label: 'Invoice', value: 'Invoice' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: theme.colors.textMuted, textAlign: 'left', fontWeight: 600 }}>
            Risk Level
          </label>
          <Select
            value={selectedRisk}
            onChange={(e) => onRiskChange && onRiskChange(e.target.value)}
            options={[
              { label: 'All Risk Levels', value: '' },
              { label: 'Verified', value: 'Verified' },
              { label: 'Suggested', value: 'Suggested' },
              { label: 'Flagged', value: 'Flagged' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: theme.colors.textMuted, textAlign: 'left', fontWeight: 600 }}>
            Date Range
          </label>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '36px' }}>
            <Input type="date" style={{ fontSize: '10px', padding: '4px 6px', height: '100%', boxSizing: 'border-box' }} />
            <span style={{ color: theme.colors.textMuted, fontSize: '11px' }}>-</span>
            <Input type="date" style={{ fontSize: '10px', padding: '4px 6px', height: '100%', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div style={{ overflowX: 'auto', border: `1px solid ${theme.colors.border}`, borderRadius: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: theme.colors.surface || '#1e293b', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textSecondary }}>
              <th style={{ padding: '10px 12px', width: '50px' }}>ID</th>
              <th style={{ padding: '10px 12px', width: '85px' }}>Type</th>
              <th style={{ padding: '10px 12px', width: '110px' }}>Name / Ref</th>
              <th style={{ padding: '10px 12px' }}>Key Identifiers</th>
              <th style={{ padding: '10px 12px', width: '90px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> Status</span>
              </th>
              <th style={{ padding: '10px 12px', width: '110px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Link2 size={12} /> Linked Invoices</span>
              </th>
              <th style={{ padding: '10px 12px', width: '110px' }}>Associated Entity</th>
              <th style={{ padding: '10px 12px', width: '80px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Modified</span>
              </th>
              <th style={{ padding: '10px 12px', width: '140px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: `1px solid ${theme.colors.border}`,
                    color: theme.colors.textPrimary,
                  }}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: theme.colors.accent }}>
                    #{row.id}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {getEntityIcon(row.type)}
                      <span>{row.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.name}</td>
                  <td style={{ padding: '10px 12px', fontSize: '10px', color: theme.colors.textMuted, whiteSpace: 'pre-line', lineHeight: 1.3 }}>
                    {row.keyIdentifiers}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge
                      variant={
                        row.status === 'Verified'
                          ? 'verified'
                          : row.status === 'Suggested'
                          ? 'suggested'
                          : 'flagged'
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {row.linkedInvoices && row.linkedInvoices.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {row.linkedInvoices.map((inv, idx) => (
                          <span key={idx} style={{ color: theme.colors.accent, fontSize: '10px', textDecoration: 'underline', cursor: 'pointer' }}>
                            {inv}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: theme.colors.textMuted }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', color: row.associatedVendor === '-' ? theme.colors.textMuted : theme.colors.textPrimary }}>
                    {row.associatedVendor}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '10px', color: theme.colors.textMuted }}>
                    {row.lastModified}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {/* Compact Horizontal Buttons */}
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                      <button
                        onClick={() => onNavigateToGraph && onNavigateToGraph('/canvas', [row.id])}
                        style={{
                          backgroundColor: 'transparent',
                          color: theme.colors.textPrimary,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Eye size={11} /> View Graph
                      </button>
                      <button
                        onClick={() => onReviewEntity && onReviewEntity(row)}
                        style={{
                          backgroundColor: 'transparent',
                          color: theme.colors.textPrimary,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <ExternalLink size={11} /> Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: theme.colors.textMuted, fontSize: '11px' }}>
                  No entities found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Card>
  );
}