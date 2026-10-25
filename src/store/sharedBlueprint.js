// Shared Contract - Property names must remain exact

// src/store/sharedBlueprint.js
import { initialNodes, initialEdges } from '../data/mockData';

const getSavedNodes = () => {
  try {
    const saved = localStorage.getItem('ravel_nodes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((n) => ({
          ...n,
          type: 'entityNode',
          data: {
            ...(n.data || {}),
            label: n.data?.label || n.label || `Entity #${n.id}`,
            type: n.data?.type || n.type || 'Entity',
          },
        }));
      }
    }
  } catch (e) {
    // ignore
  }
  return initialNodes;
};

const getSavedEdges = () => {
  try {
    const saved = localStorage.getItem('ravel_edges');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return initialEdges;
};

export const initialGraphState = {
  nodes: getSavedNodes(),
  edges: getSavedEdges(),
  selectedNodeId: null,
  loading: false,
  error: null,
};

export const initialAppState = {
  graph: {
    nodes: [],
    edges: [],
    selectedNodeId: null,
  },
  cases: {
    caseList: [],
    activeFilter: 'ALL',
  },
  userSession: {
    isLoggedIn: false,
    currentUser: null,
  },
  settings: {
    ruleSensitivity: { gstMatch: 80, circularLoop: 90, fuzzyName: 75 },
    auditLogs: [],
  },
};