// Shared Contract - Property names must remain exact
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