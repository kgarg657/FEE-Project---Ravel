// src/data/mockData.js

/**
 * 1. GRAPH NODES (Entities, Invoices, Transactions, Accounts)
 */
export const initialNodes = [
  // --- Cluster 1: Internal Procurement & Kickback Loop (High Risk Circular Scheme) ---
  {
    id: '1',
    type: 'entityNode',
    position: { x: 100, y: 150 },
    data: {
      label: 'B. Patel',
      type: 'Employee',
      dept: 'Procurement',
      role: 'Senior Buyer',
      riskLevel: 'Critical',
      riskScore: 92,
      email: 'b.patel@ravel.internal',
      pan: 'ABCDE1234F',
      phone: '+91 98765 43210',
      bankAccount: 'ACC-998811',
      status: 'Under Investigation',
    },
  },
  {
    id: '2',
    type: 'entityNode',
    position: { x: 320, y: 80 },
    data: {
      label: 'A. Sharma',
      type: 'Employee',
      dept: 'Finance',
      role: 'Approving Manager',
      riskLevel: 'Medium',
      riskScore: 58,
      email: 'a.sharma@ravel.internal',
      pan: 'FGHIJ5678K',
      phone: '+91 98123 45678',
      bankAccount: 'ACC-443322',
      status: 'Active Audit',
    },
  },
  {
    id: '3',
    type: 'entityNode',
    position: { x: 550, y: 80 },
    data: {
      label: 'Apex Logistics Ltd',
      type: 'Vendor',
      gst: '07AAAAA0000A1Z5',
      pan: 'AAACA1111A',
      registeredAddr: 'Plot 42, Okhla Ind Area, New Delhi',
      riskLevel: 'Critical',
      riskScore: 95,
      status: 'Flagged Shell Vendor',
    },
  },
  {
    id: '4',
    type: 'entityNode',
    position: { x: 580, y: 320 },
    data: {
      label: 'Nexus Offshore Co',
      type: 'Vendor',
      gst: '07BBBBA9999B2Z9',
      pan: 'BBBBN9999B',
      registeredAddr: 'Offshore Tower B, Cybercity',
      riskLevel: 'High',
      riskScore: 84,
      status: 'Suspect intermediary',
    },
  },
  {
    id: '5',
    type: 'entityNode',
    position: { x: 340, y: 320 },
    data: {
      label: 'ACC-998811 (Patel Personal)',
      type: 'Account',
      bank: 'HDFC Bank',
      accountNo: 'ACC-998811',
      ifsc: 'HDFC0000123',
      riskLevel: 'Critical',
      riskScore: 90,
      status: 'Frozen',
    },
  },

  // --- Cluster 2: Invoices & Financial Transactions ---
  {
    id: '6',
    type: 'entityNode',
    position: { x: 760, y: 80 },
    data: {
      label: 'Invoice #INV-2026-001',
      type: 'Invoice',
      amount: '₹ 8,50,000',
      date: '2026-01-15',
      gst: '07AAAAA0000A1Z5',
      riskLevel: 'High',
      riskScore: 78,
      status: 'Paid',
    },
  },
  {
    id: '7',
    type: 'entityNode',
    position: { x: 780, y: 260 },
    data: {
      label: 'Txn #TXN-8809 (Wire)',
      type: 'Txn',
      amount: '₹ 8,50,000',
      date: '2026-01-18',
      sender: 'Apex Logistics Ltd',
      receiver: 'Nexus Offshore Co',
      riskLevel: 'Critical',
      riskScore: 89,
      status: 'Settled',
    },
  },
  {
    id: '8',
    type: 'entityNode',
    position: { x: 580, y: 460 },
    data: {
      label: 'Txn #TXN-9122 (Kickback)',
      type: 'Txn',
      amount: '₹ 2,00,000',
      date: '2026-01-20',
      sender: 'Nexus Offshore Co',
      receiver: 'B. Patel',
      riskLevel: 'Critical',
      riskScore: 98,
      status: 'Flagged Anomaly',
    },
  },

  // --- Cluster 3: Secondary Unlinked & Low-Risk Operations ---
  {
    id: '9',
    type: 'entityNode',
    position: { x: 100, y: 440 },
    data: {
      label: 'Global Trade Sub-Contract',
      type: 'Vendor',
      gst: '09BBBBB1111B2Y6',
      pan: 'CCCDC3333C',
      riskLevel: 'Low',
      riskScore: 18,
      status: 'Verified Partner',
    },
  },
  {
    id: '10',
    type: 'entityNode',
    position: { x: 300, y: 520 },
    data: {
      label: 'Invoice #INV-902 (Global)',
      type: 'Invoice',
      amount: '₹ 1,20,000',
      date: '2026-02-05',
      gst: '09BBBBB1111B2Y6',
      riskLevel: 'Low',
      riskScore: 12,
      status: 'Verified',
    },
  },
];

/**
 * 2. GRAPH EDGES (Verified Connections, Suggested AI Links, Circular Loops)
 */
export const initialEdges = [
  // Verified / Approved Relationship Chain
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Reports To' } 
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Vendor Approved By' } 
  },
  { 
    id: 'e3-6', 
    source: '3', 
    target: '6', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Issued Invoice' } 
  },
  { 
    id: 'e6-7', 
    source: '6', 
    target: '7', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Settled Via' } 
  },

  // --- FRAUD LOOP 1: Apex -> Nexus -> Patel Personal Account -> B. Patel ---
  { 
    id: 'e7-4', 
    source: '7', 
    target: '4', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Transferred To' } 
  },
  { 
    id: 'e4-8', 
    source: '4', 
    target: '8', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Kickback Wire' } 
  },
  { 
    id: 'e8-5', 
    source: '8', 
    target: '5', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Deposited To' } 
  },
  { 
    id: 'e5-1', 
    source: '5', 
    target: '1', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Account Owned By' } 
  },

  // --- PENDING SUGGESTIONS (AI / Rule-Engine Discovered Links) ---
  { 
    id: 'e3-1-suggested', 
    source: '3', 
    target: '1', 
    type: 'edgeBadge', 
    data: { 
      isSuggested: true, 
      label: 'Suggested', 
      relation: 'Shared Phone & Address', 
      confidence: 0.94 
    } 
  },
  { 
    id: 'e4-3-suggested', 
    source: '4', 
    target: '3', 
    type: 'edgeBadge', 
    data: { 
      isSuggested: true, 
      label: 'Suggested', 
      relation: 'Matching Director PAN', 
      confidence: 0.88 
    } 
  },

  // Secondary Verified Subcontract Link
  { 
    id: 'e1-9', 
    source: '1', 
    target: '9', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Assigned Subcontractor' } 
  },
  { 
    id: 'e9-10', 
    source: '9', 
    target: '10', 
    type: 'edgeBadge', 
    data: { isSuggested: false, label: 'Approved', relation: 'Billed Invoice' } 
  },
];

/**
 * 3. PENDING LINK SUGGESTIONS PANEL MOCK DATA
 */
export const initialPendingSuggestions = [
  {
    id: 'sug-101',
    sourceId: '3',
    targetId: '1',
    description: 'Vendor: Apex Logistics Ltd shares phone number (+91 98765 43210) with Employee: B. Patel',
    confidence: '94%',
    ruleTriggered: 'Entity Resolution (Contact Match)',
  },
  {
    id: 'sug-102',
    sourceId: '4',
    targetId: '3',
    description: 'Vendor: Nexus Offshore Co has matching registered director PAN with Vendor: Apex Logistics Ltd',
    confidence: '88%',
    ruleTriggered: 'CTE Recursive Director Trace',
  },
  {
    id: 'sug-103',
    sourceId: '8',
    targetId: '5',
    description: 'Txn: #TXN-9122 recipient account matches B. Patel Personal Account (ACC-998811)',
    confidence: '99%',
    ruleTriggered: 'Banking Transaction Anomaly',
  },
];

/**
 * 4. CASE MANAGEMENT MOCK DATA
 */
export const mockCases = [
  {
    id: 'CASE-2026-088',
    title: 'Procurement Fraud & Kickback Scheme Q3 2026',
    leadAuditor: 'J. Doe',
    status: 'In Progress',
    priority: 'Critical',
    riskScore: 94,
    entitiesInvolvedCount: 8,
    createdDate: '2026-02-10',
    description: 'Circular money flow detected between internal buyer B. Patel, vendor Apex Logistics, and offshore shell account Nexus Offshore.',
  },
  {
    id: 'CASE-2026-042',
    title: 'Duplicate GST Invoice Verification - Global Trade',
    leadAuditor: 'A. Sharma',
    status: 'Under Review',
    priority: 'Medium',
    riskScore: 45,
    entitiesInvolvedCount: 3,
    createdDate: '2026-01-22',
    description: 'Audit trigger regarding tax credit variance across sub-contractor billing records.',
  },
  {
    id: 'CASE-2025-119',
    title: 'Conflict of Interest Audit - IT Equipment Hardware',
    leadAuditor: 'M. Verma',
    status: 'Closed / Resolved',
    priority: 'Low',
    riskScore: 15,
    entitiesInvolvedCount: 5,
    createdDate: '2025-11-14',
    description: 'Routine quarterly vendor validation. No hidden entity relationships uncovered.',
  },
];

/**
 * 5. AUDITOR DASHBOARD & ANALYTICS RISK METRICS
 */
export const mockRiskSummaries = {
  totalHighRiskEntities: 4,
  totalHighRiskDelta: '+2 this week',
  totalUnhighRiskEntities: 32,
  totalUnhighRiskDelta: '-6 resolved',
  entityRiskScorePercentage: 70,
  transactionAnomalyPercentage: 75,
  networkRiskIndexPercentage: 85,
  dailyRiskEvents: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 8 },
    { month: 'Apr', count: 24 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 31 },
  ],
  alertsBySource: [
    { source: 'GST Conflict', count: 250 },
    { source: 'Bank Anomaly', count: 140 },
    { source: 'Phone Match', count: 90 },
    { source: 'Address Overlap', count: 45 },
  ],
};