// src/data/mockData.js

export const initialNodes = [
  {
    id: '1',
    type: 'entityNode',
    position: { x: 80, y: 160 },
    data: { label: 'B. Patel', type: 'Employee', dept: 'Procurement', riskLevel: 'Medium' },
  },
  {
    id: '2',
    type: 'entityNode',
    position: { x: 280, y: 80 },
    data: { label: 'A. Sharma', type: 'Employee', dept: 'Finance', riskLevel: 'Low' },
  },
  {
    id: '3',
    type: 'entityNode',
    position: { x: 480, y: 80 },
    data: { label: 'Ace Corp', type: 'Vendor', gst: '07AAAAA0000A1Z5', riskLevel: 'Low' },
  },
  {
    id: '4',
    type: 'entityNode',
    position: { x: 260, y: 320 },
    data: { label: 'Global Trade', type: 'Vendor', gst: '09BBBBB1111B2Y6', riskLevel: 'Low' },
  },
  {
    id: '5',
    type: 'entityNode',
    position: { x: 460, y: 260 },
    data: { label: '#I-402 (Ace)', type: 'Invoice', amount: '45000', date: '2026-01-15', riskLevel: 'Normal' },
  },
  {
    id: '6',
    type: 'entityNode',
    position: { x: 520, y: 440 },
    data: { label: '#T-505', type: 'Txn', amount: '85000', sender: 'B. Patel', date: '2026-02-10', riskLevel: 'Critical' },
  },
  {
    id: '7',
    type: 'entityNode',
    position: { x: 680, y: 220 },
    data: { label: '#I-808 (Ace)', type: 'Invoice', amount: '85000', gst: '07AAAAA0000A1Z5', date: '2026-02-28', riskLevel: 'Critical' },
  },
  {
    id: '8',
    type: 'entityNode',
    position: { x: 120, y: 420 },
    data: { label: 'Global Trade Sub-Contract', type: 'Invoice', amount: '12000', gst: '09BBBBB1111B2Y6', date: '2026-01-05', riskLevel: 'Low' },
  },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e2-3', source: '2', target: '3', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e1-4', source: '1', target: '4', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  { id: 'e3-5', source: '3', target: '5', type: 'edgeBadge', data: { isSuggested: false, label: 'Approved' } },
  // Add a loop: Ace Corp (3) -> B. Patel (1)
{ id: 'e3-1', source: '3', target: '1', type: 'edgeBadge', data: { isSuggested: true, label: 'Suggested' } },

];
