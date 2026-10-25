import { createSlice } from '@reduxjs/toolkit';
import { initialGraphState } from './sharedBlueprint';

const syncLocalStorage = (nodes, edges) => {
  try {
    if (nodes) localStorage.setItem('ravel_nodes', JSON.stringify(nodes));
    if (edges) localStorage.setItem('ravel_edges', JSON.stringify(edges));
  } catch (e) {
    // ignore
  }
};

const normalizeNode = (n) => ({
  ...n,
  type: 'entityNode',
  data: {
    ...(n.data || {}),
    label: n.data?.label || n.label || `Entity #${n.id}`,
    type: n.data?.type || n.entityType || n.type || 'Entity',
  },
});

const graphSlice = createSlice({
  name: 'graph',
  initialState: initialGraphState,
  reducers: {
    // Populate store with nodes and edges fetched from Supabase
    setGraphData: (state, action) => {
      const { nodes, edges } = action.payload;
      if (nodes && Array.isArray(nodes) && nodes.length > 0) {
        state.nodes = nodes.map(normalizeNode);
      }
      if (edges && Array.isArray(edges) && edges.length > 0) state.edges = edges;
      state.loading = false;
      state.error = null;
      syncLocalStorage(state.nodes, state.edges);
    },

    // Set full nodes array
    setNodes: (state, action) => {
      state.nodes = Array.isArray(action.payload) ? action.payload.map(normalizeNode) : action.payload;
      syncLocalStorage(state.nodes, null);
    },

    // Set full edges array
    setEdges: (state, action) => {
      state.edges = action.payload;
      syncLocalStorage(null, state.edges);
    },

    // Add a single new node (pushed from AddEntitySidebar / Registry)
    addNode: (state, action) => {
      state.nodes.push(action.payload);
      syncLocalStorage(state.nodes, null);
    },

    // Add a single new edge (pushed from Canvas connection)
    addEdge: (state, action) => {
      state.edges.push(action.payload);
      syncLocalStorage(null, state.edges);
    },

    // Update coordinates when a node is dragged on the React Flow canvas
    updateNodePosition: (state, action) => {
      const { id, position } = action.payload;
      const node = state.nodes.find((n) => String(n.id) === String(id));
      if (node) {
        node.position = position;
        syncLocalStorage(state.nodes, null);
      }
    },

    // Remove nodes & edges when deleted from canvas
    removeElements: (state, action) => {
      const { nodeIds = [], edgeIds = [] } = action.payload;
      const nodeIdSet = new Set(nodeIds.map(String));
      const edgeIdSet = new Set(edgeIds.map(String));

      state.nodes = state.nodes.filter((n) => !nodeIdSet.has(String(n.id)));
      state.edges = state.edges.filter(
        (e) =>
          !edgeIdSet.has(String(e.id)) &&
          !nodeIdSet.has(String(e.source)) &&
          !nodeIdSet.has(String(e.target))
      );
      syncLocalStorage(state.nodes, state.edges);
    },

    // Approve a suggested edge
    approveEdge: (state, action) => {
      const edgeId = String(action.payload);
      const edge = state.edges.find((e) => String(e.id) === edgeId);
      if (edge) {
        edge.data = { ...edge.data, isSuggested: false, label: 'Approved' };
        edge.is_suggested = false;
        edge.label = 'Approved';
        syncLocalStorage(null, state.edges);
      }
    },

    // Reject / delete an edge
    rejectEdge: (state, action) => {
      const edgeId = String(action.payload);
      state.edges = state.edges.filter((e) => String(e.id) !== edgeId);
      syncLocalStorage(null, state.edges);
    },

    // Track which node is clicked/opened in the NodeInspectorDrawer
    setSelectedNodeId: (state, action) => {
      state.selectedNodeId = action.payload;
    },

    // Manage status indicators
    setGraphLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGraphError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setGraphData,
  setNodes,
  setEdges,
  addNode,
  addEdge,
  updateNodePosition,
  removeElements,
  approveEdge,
  rejectEdge,
  setSelectedNodeId,
  setGraphLoading,
  setGraphError,
} = graphSlice.actions;

export default graphSlice.reducer;