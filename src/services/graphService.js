// src/services/graphService.js
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialNodes, initialEdges } from '../data/mockData';

export async function fetchGraphData() {
  if (!isSupabaseConfigured) {
    console.info('Supabase not configured in .env, using local initial graph data.');
    return { nodes: initialNodes, edges: initialEdges, isFallback: true };
  }

  try {
    const { data: nodesData, error: nodesError } = await supabase.from('nodes').select('*');
    const { data: edgesData, error: edgesError } = await supabase.from('edges').select('*');

    if (nodesError || edgesError) {
      console.warn('Supabase fetch error, falling back to local initial graph data:', nodesError || edgesError);
      return { nodes: initialNodes, edges: initialEdges, isFallback: true };
    }

    // If database tables are empty, seed with initial nodes & edges
    if (!nodesData || nodesData.length === 0) {
      console.info('Supabase nodes table is empty, seeding initial graph dataset...');
      seedInitialData(initialNodes, initialEdges).catch((err) =>
        console.warn('Could not complete background seeding:', err)
      );
      return { nodes: initialNodes, edges: initialEdges, isFallback: false };
    }

    // Map database rows into React Flow format
    const formattedNodes = (nodesData || []).map((node) => {
      const metadata = typeof node.metadata === 'string'
        ? JSON.parse(node.metadata)
        : (node.metadata || {});

      let position = { x: 100, y: 100 };
      if (typeof node.position === 'string') {
        try {
          position = JSON.parse(node.position);
        } catch {
          // ignore
        }
      } else if (node.position && typeof node.position === 'object') {
        position = node.position;
      }

      const label = node.label || metadata.label || `Entity #${node.id}`;
      const type = node.type || metadata.type || 'Entity';
      const riskScore = Number(node.risk_score ?? metadata.riskScore ?? 0);
      const riskLevel = metadata.riskLevel || (riskScore >= 70 ? 'Critical' : riskScore >= 40 ? 'High' : 'Low');

      return {
        id: String(node.id),
        type: 'entityNode',
        position,
        data: {
          label,
          type,
          dept: metadata.dept || node.role || '',
          role: metadata.role || node.role || '',
          gst: metadata.gst || node.gst || '',
          riskScore,
          riskLevel,
          amount: metadata.amount || node.amount || '',
          email: metadata.email || '',
          pan: metadata.pan || '',
          phone: metadata.phone || '',
          bankAccount: metadata.bankAccount || '',
          status: metadata.status || 'Active',
          metadata,
        },
        label,
        entityType: type,
        role: metadata.role || node.role,
        gst: metadata.gst || node.gst,
        risk_score: riskScore,
        amount: metadata.amount || node.amount,
      };
    });

    const formattedEdges = (edgesData || []).map((edge) => {
      const isSuggested = Boolean(edge.is_suggested);
      const label = edge.label || (isSuggested ? 'Suggested' : 'Approved');
      return {
        id: String(edge.id),
        source: String(edge.source),
        target: String(edge.target),
        type: 'edgeBadge',
        data: {
          label,
          isSuggested,
        },
        label,
        is_suggested: isSuggested,
      };
    });

    return { nodes: formattedNodes, edges: formattedEdges, isFallback: false };
  } catch (err) {
    console.warn('Graph service fetch exception, returning initial graph data:', err);
    return { nodes: initialNodes, edges: initialEdges, isFallback: true };
  }
}

export async function saveNode(node) {
  if (!isSupabaseConfigured) return;
  try {
    const nodeData = node.data || {};
    const metadata = {
      dept: nodeData.dept || node.role || '',
      role: nodeData.role || node.role || '',
      gst: nodeData.gst || node.gst || '',
      amount: nodeData.amount || node.amount || '',
      riskLevel: nodeData.riskLevel || '',
      email: nodeData.email || '',
      pan: nodeData.pan || '',
      phone: nodeData.phone || '',
      bankAccount: nodeData.bankAccount || '',
      status: nodeData.status || '',
      ...(nodeData.metadata || {}),
    };

    const payload = {
      id: String(node.id),
      label: nodeData.label || node.label || `Entity #${node.id}`,
      type: nodeData.type || node.type || 'Entity',
      role: nodeData.role || nodeData.dept || node.role || '',
      gst: nodeData.gst || node.gst || '',
      risk_score: Number(nodeData.riskScore ?? node.risk_score ?? 0),
      amount: parseFloat(String(nodeData.amount || node.amount || 0).replace(/[^0-9.]/g, '')) || 0,
      position: typeof node.position === 'object' ? JSON.stringify(node.position) : (node.position || '{"x":100,"y":100}'),
      metadata,
    };

    const { error } = await supabase.from('nodes').upsert(payload);
    if (error) console.warn('Supabase saveNode notice:', error.message);
  } catch (err) {
    console.warn('Save node error:', err);
  }
}

export async function saveEdge(edge) {
  if (!isSupabaseConfigured) return;
  try {
    const isSuggested = edge.data?.isSuggested ?? edge.is_suggested ?? false;
    const label = edge.data?.label || edge.label || (isSuggested ? 'Suggested' : 'Approved');

    const { error } = await supabase.from('edges').upsert({
      id: String(edge.id),
      source: String(edge.source),
      target: String(edge.target),
      label,
      is_suggested: Boolean(isSuggested),
    });
    if (error) console.warn('Supabase saveEdge notice:', error.message);
  } catch (err) {
    console.warn('Save edge error:', err);
  }
}

export async function deleteNodeFromDb(nodeId) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('nodes').delete().eq('id', String(nodeId));
    await supabase.from('edges').delete().or(`source.eq.${nodeId},target.eq.${nodeId}`);
  } catch (err) {
    console.warn('Delete node error:', err);
  }
}

export async function deleteEdgeFromDb(edgeId) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('edges').delete().eq('id', String(edgeId));
  } catch (err) {
    console.warn('Delete edge error:', err);
  }
}

export async function updateNodePositionInDb(nodeId, position) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase
      .from('nodes')
      .update({
        position: typeof position === 'object' ? JSON.stringify(position) : position,
      })
      .eq('id', String(nodeId));
  } catch (err) {
    console.warn('Update position error:', err);
  }
}

export async function seedInitialData(nodes, edges) {
  if (!isSupabaseConfigured) return;
  try {
    for (const node of nodes) {
      await saveNode(node);
    }
    for (const edge of edges) {
      await saveEdge(edge);
    }
  } catch (err) {
    console.warn('Seed initial data error:', err);
  }
}