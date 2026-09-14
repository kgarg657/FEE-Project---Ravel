import React, { useState } from 'react';
import { Search, Plus, ExternalLink, Edit2, UserPlus, ShieldAlert, Activity } from 'lucide-react';
import theme from '../theme';

import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Drawer from '../components/Drawer';

function CaseManagement({ onNavigate }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [riskFilter, setRiskFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState('');
    const [timelineChecked, setTimelineChecked] = useState(true);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [newCaseData, setNewCaseData] = useState({ name: '', type: 'Procurement Fraud', entity: '', riskLevel: 'High', status: 'Open' });

    // Exact mock data matching the screenshot interface with added risk & status properties for filters
    const [cases, setCases] = useState([
        { id: '#CA001', type: 'Procurement Fraud', name: 'Project Atlas Vendor Check', entities: 'Vendor: Acme Corp\nEmployee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'High', status: 'Open', lastModified: '12/07/2022', timestamp: new Date('2022-07-12') },
        { id: '#CA002', type: 'Conflict of Interest', name: 'Priya Singh Conflict', entities: 'Employee: B. Patel\nEmployee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Suggested', riskLevel: 'High', status: 'Under Review', lastModified: '16/07/2022', timestamp: new Date('2022-07-16') },
        { id: '#CA003', type: 'Conflict of Interest', name: 'Quarter-End Sales Spikes', entities: '• Employee: Sharma\n• Acme Corp', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'Medium', status: 'Open', lastModified: '12/06/2022', timestamp: new Date('2022-06-12') },
        { id: '#CA004', type: 'Conflict of Interest', name: 'Quarter-End Sales Check', entities: '• Employee: B. Patel\n• Employee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Suggested', riskLevel: 'Low', status: 'Closed', lastModified: '13/08/2022', timestamp: new Date('2022-08-13') },
        { id: '#CA005', type: 'Conflict of Interest', name: 'Quarter-End Sales Spikes', entities: 'Vendor: A. A.. A. Sharma\n• Employee: Acme Corp', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Verified', riskLevel: 'Medium', status: 'Under Review', lastModified: '12/06/2022', timestamp: new Date('2022-06-12') },
        { id: '#CA006', type: 'Insider Trading', name: 'Insider Trading Case', entities: '• Employee: B. Patel\n• Employee: B. Patel', identifiers: 'GST: 07A...\nSSN: ...\nContact: ...', verifiedStatus: 'Flagged', riskLevel: 'High', status: 'Open', lastModified: '12/06/2022', timestamp: new Date('2022-06-12') },
    ]);

    // Filter logic matching the selected dropdown values
    const filteredCases = cases.filter(item => {
        if (typeFilter && item.type !== typeFilter) return false;
        if (riskFilter && item.riskLevel !== riskFilter) return false;
        if (statusFilter && item.status !== statusFilter) return false;
        return true;
    });

    const columns = [
        { header: 'Case ID', accessor: 'id', type: 'link' },
        { header: 'Type', accessor: 'type' },
        { header: 'Name / Reference', accessor: 'name' },
        { header: 'Core Entities', accessor: 'entities' },
        { header: 'Key Identifiers', accessor: 'identifiers' },
        { header: 'Verified Status', accessor: 'verifiedStatus', type: 'badge' },
        { header: 'Last Modified', accessor: 'lastModified' },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                        onClick={() => {
                            // Reusing existing navigation/graph view handler
                            if (onNavigate) {
                                onNavigate('/canvas');
                            } else {
                                setSelectedCase(row);
                                setIsDrawerOpen(true);
                            }
                        }}
                        style={{ backgroundColor: theme.colors.surfaceHover, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                    >
                        View Graph
                    </button>
                    <button
                        onClick={() => { setSelectedCase(row); setIsDrawerOpen(true); }}
                        style={{ backgroundColor: theme.colors.surfaceHover, border: `1px solid ${theme.colors.border}`, color: theme.colors.textPrimary, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                    >
                        Add Entity
                    </button>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '24px 32px', backgroundColor: theme.colors.bg, minHeight: '100vh', fontFamily: theme.fonts?.sans || 'sans-serif' }}>

            {/* Top Header Workspace Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: theme.colors.textPrimary, fontSize: '28px', fontWeight: 600, margin: 0 }}>
                        Case Management & Investigation Workspace
                    </h1>
                    <span style={{ color: theme.colors.textSecondary, fontSize: '15px' }}>
                        Logged in: J. Doe (Senior Auditor) &nbsp;&nbsp;|&nbsp;&nbsp; Timeline &nbsp;<input type="checkbox" checked={timelineChecked} onChange={(e) => setTimelineChecked(e.target.checked)} style={{ verticalAlign: 'middle', cursor: 'pointer' }} />
                    </span>
                </div>
            </div>

            {/* Main Grid Layout: Left Content & Right Analytics Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

                {/* Left Column (Master List & Filters) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <h3 style={{ color: theme.colors.textPrimary, fontSize: '16px', fontWeight: 600, margin: 0 }}>
                            Unified Case Master List
                        </h3>
                        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                            <Plus size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Create New Case
                        </Button>
                    </div>

                    {/* Filter Bar */}
                    <Card padding="12px" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            <Select
                                label="Case Type"
                                placeholder="All Types"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                options={[
                                    { label: 'All Types', value: '' },
                                    { label: 'Procurement Fraud', value: 'Procurement Fraud' },
                                    { label: 'Conflict of Interest', value: 'Conflict of Interest' },
                                    { label: 'Insider Trading', value: 'Insider Trading' }
                                ]}
                            />
                            <Select
                                label="Risk Level"
                                placeholder="All Risks"
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value)}
                                options={[
                                    { label: 'All Risks', value: '' },
                                    { label: 'High', value: 'High' },
                                    { label: 'Medium', value: 'Medium' },
                                    { label: 'Low', value: 'Low' }
                                ]}
                            />
                            <Select
                                label="Status"
                                placeholder="All Statuses"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { label: 'All Statuses', value: '' },
                                    { label: 'Open', value: 'Open' },
                                    { label: 'Under Review', value: 'Under Review' },
                                    { label: 'Closed', value: 'Closed' }
                                ]}
                            />
                            <Select
                                label="Date Range"
                                placeholder="All Time"
                                value={dateRangeFilter}
                                onChange={(e) => setDateRangeFilter(e.target.value)}
                                options={[
                                    { label: 'All Time', value: '' },
                                    { label: 'Last 30 days', value: '30days' },
                                    { label: 'Last 6 months', value: '6months' }
                                ]}
                            />
                        </div>
                    </Card>

                    {/* Table Component Card */}
                    <Card padding="0">
                        <Table
                            columns={columns}
                            data={filteredCases}
                            emptyText="No cases recorded."
                        />
                    </Card>
                </div>

                {/* Right Column (Statistics & Feeds Sidebar) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Statistics Card */}
                    <Card padding="16px">
                        <h4 style={{ color: theme.colors.textPrimary, fontSize: '14px', margin: '0 0 12px 0', borderBottom: `1px solid ${theme.colors.border}`, paddingBottom: '8px' }}>
                            Case Management Statistics
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: theme.colors.textSecondary }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total Cases:</span>
                                <strong style={{ color: theme.colors.textPrimary }}>{cases.length}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Open Cases:</span>
                                <strong style={{ color: '#ef4444' }}>{cases.filter(c => c.status === 'Open').length} (Critical)</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Total Entities (linked):</span>
                                <strong style={{ color: theme.colors.textPrimary }}>67</strong>
                            </div>
                        </div>
                    </Card>

                    {/* Flagged Case Feed */}
                    <Card padding="16px">
                        <h4 style={{ color: theme.colors.textPrimary, fontSize: '13px', margin: '0 0 4px 0' }}>
                            Flagged Case Feed
                        </h4>
                        <span style={{ fontSize: '11px', color: theme.colors.textMuted, display: 'block', marginBottom: '10px' }}>
                            High ristical unverified connections
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                            <div style={{ padding: '8px', backgroundColor: theme.colors.surfaceHover, borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                                <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>Case #CA001 Procurement Fraud associated with Employee B. Patel (Critical Bank details Ris</span>
                            </div>
                            <div style={{ padding: '8px', backgroundColor: theme.colors.surfaceHover, borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                                <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>Case #CA002 Procurement Fraud associated with Employee B. Patel (Critical Bank details Ris</span>
                            </div>
                            <div style={{ padding: '8px', backgroundColor: theme.colors.surfaceHover, borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                                <span style={{ color: theme.colors.textPrimary, fontWeight: 500 }}>Case #CA003 Procurement Fraud associated with Employee B. Patel</span>
                            </div>
                        </div>
                    </Card>

                    {/* Case Activity Log */}
                    <Card padding="16px">
                        <h4 style={{ color: theme.colors.textPrimary, fontSize: '13px', margin: '0 0 10px 0' }}>
                            Case Activity Log
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: theme.colors.textPrimary }}>
                            <div>Case #CA002 opened by J. Doe a mmm ago</div>
                            <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '6px' }}>Case #CA001 updated with new bank details for B. Patel</div>
                            <div style={{ borderTop: `1px solid ${theme.colors.border}`, paddingTop: '6px' }}>Suggested link added to Project Atlas Case</div>
                        </div>
                    </Card>

                </div>

            </div>

            {/* Modal for Creating New Case */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Investigation Case"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Input
                        label="Case Name / Reference"
                        required
                        placeholder="e.g., Vendor Verification Audit"
                        value={newCaseData.name}
                        onChange={(e) => setNewCaseData({ ...newCaseData, name: e.target.value })}
                    />
                    <Select
                        label="Case Type"
                        value={newCaseData.type}
                        onChange={(e) => setNewCaseData({ ...newCaseData, type: e.target.value })}
                        options={[
                            { label: 'Procurement Fraud', value: 'Procurement Fraud' },
                            { label: 'Conflict of Interest', value: 'Conflict of Interest' },
                            { label: 'Insider Trading', value: 'Insider Trading' }
                        ]}
                    />
                    <Select
                        label="Risk Level"
                        value={newCaseData.riskLevel}
                        onChange={(e) => setNewCaseData({ ...newCaseData, riskLevel: e.target.value })}
                        options={[
                            { label: 'High', value: 'High' },
                            { label: 'Medium', value: 'Medium' },
                            { label: 'Low', value: 'Low' }
                        ]}
                    />
                    <Select
                        label="Initial Status"
                        value={newCaseData.status}
                        onChange={(e) => setNewCaseData({ ...newCaseData, status: e.target.value })}
                        options={[
                            { label: 'Open', value: 'Open' },
                            { label: 'Under Review', value: 'Under Review' },
                            { label: 'Closed', value: 'Closed' }
                        ]}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            if (!newCaseData.name) return;
                            const newEntry = {
                                id: `#CA00${cases.length + 1}`,
                                type: newCaseData.type,
                                name: newCaseData.name,
                                entities: 'Vendor: New Target\nEmployee: Unassigned',
                                identifiers: 'GST: ---\nSSN: ---',
                                verifiedStatus: 'Suggested',
                                riskLevel: newCaseData.riskLevel,
                                status: newCaseData.status,
                                lastModified: 'Today',
                                timestamp: new Date()
                            };
                            setCases([newEntry, ...cases]);
                            setIsCreateModalOpen(false);
                            setNewCaseData({ name: '', type: 'Procurement Fraud', entity: '', riskLevel: 'High', status: 'Open' });
                        }}>Save Case</Button>
                    </div>
                </div>
            </Modal>

            {/* Drawer Component for View/Edit Actions */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={selectedCase ? `Case Inspector: ${selectedCase.id}` : 'Case Workspace'}
                width="440px"
            >
                {selectedCase && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <span style={{ fontSize: '11px', color: theme.colors.textMuted, textTransform: 'uppercase' }}>{selectedCase.type}</span>
                            <h3 style={{ color: theme.colors.textPrimary, margin: '2px 0', fontSize: '16px' }}>{selectedCase.name}</h3>
                        </div>
                        <div style={{ backgroundColor: theme.colors.surfaceHover, padding: '12px', borderRadius: '6px' }}>
                            <span style={{ fontSize: '12px', color: theme.colors.textMuted, display: 'block', marginBottom: '4px' }}>Core Entities Connected:</span>
                            <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'inherit', color: theme.colors.textPrimary, whiteSpace: 'pre-wrap' }}>{selectedCase.entities}</pre>
                        </div>
                        <div style={{ backgroundColor: theme.colors.surfaceHover, padding: '12px', borderRadius: '6px' }}>
                            <span style={{ fontSize: '12px', color: theme.colors.textMuted, display: 'block', marginBottom: '4px' }}>Identifiers Tracked:</span>
                            <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'inherit', color: theme.colors.textPrimary, whiteSpace: 'pre-wrap' }}>{selectedCase.identifiers}</pre>
                        </div>
                    </div>
                )}
            </Drawer>

        </div>
    );
}

export default CaseManagement;


