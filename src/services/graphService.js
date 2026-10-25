import { supabase } from './supabaseClient';

// Fetch all nodes and edges from Supabase
export const fetchGraphData = async () => {
  const { data: nodes, error: nodesErr } = await supabase.from('nodes').select('*');
  const { data: edges, error: edgesErr } = await supabase.from('edges').select('*');

  if (nodesErr || edgesErr) {
    console.error('Error fetching graph data:', nodesErr || edgesErr);
    return { nodes: [], edges: [] };
  }

  return { nodes, edges };
};

// Save a new node to Supabase
export const saveNode = async (nodeData) => {
  const { data, error } = await supabase.from('nodes').insert([nodeData]).select();
  if (error) console.error('Error saving node:', error);
  return data;
};

// Save a new edge to Supabase
export const saveEdge = async (edgeData) => {
  const { data, error } = await supabase.from('edges').insert([edgeData]).select();
  if (error) console.error('Error saving edge:', error);
  return data;
};