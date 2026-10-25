import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Network, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import Badge from '../Badge';
import aiService from '../../services/aiService';
import theme from '../../theme';

export default function MultiHopPathFinder({
  nodes: parentNodes,
  edges: parentEdges,
  algorithm = 'BFS',
  maxHops = 3,
}) {
  // Read nodes & edges from Redux Store as fallback
  const reduxNodes = useSelector((state) => state.graph.nodes);
  const reduxEdges = useSelector((state) => state.graph.edges);

  const nodes = parentNodes && parentNodes.length > 0 ? parentNodes : reduxNodes;
  const edges = parentEdges && parentEdges.length > 0 ? parentEdges : reduxEdges;

  const [sourceId, setSourceId] = useState(() => nodes[0]?.id ? String(nodes[0].id) : '');
  const [targetId, setTargetId] = useState(() => nodes[2]?.id ? String(nodes[2].id) : (nodes[1]?.id ? String(nodes[1].id) : ''));
  const [pathResult, setPathResult] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (!sourceId && nodes.length > 0) {
      setSourceId(String(nodes[0].id));
    }
    if (!targetId && nodes.length > 1) {
      setTargetId(String(nodes[2]?.id || nodes[1]?.id));
    }
  }, [nodes, sourceId, targetId]);

  const calculatePath = async () => {
    setErrorMsg('');
    setPathResult(null);
    setAiInsight('');

    if (String(sourceId) === String(targetId)) {
      setErrorMsg('Source and Destination entities are identical.');
      return;
    }

    setIsAnalyzing(true);

    // 1. Build Adjacency List
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => {
      if (adj[e.source]) adj[e.source].push({ target: e.target, edge: e });
      if (adj[e.target]) adj[e.target].push({ target: e.source, edge: e });
    });

    let foundPath = null;

    // 2. Traversal respecting BFS / DFS and maxHops
    if (algorithm === 'BFS') {
      const queue = [[sourceId]];
      const visited = new Set([sourceId]);

      while (queue.length > 0) {
        const currentPath = queue.shift();
        const lastNode = currentPath[currentPath.length - 1];

        if (lastNode === targetId) {
          foundPath = currentPath;
          break;
        }

        if (currentPath.length - 1 < maxHops) {
          const neighbors = adj[lastNode] || [];
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor.target)) {
              visited.add(neighbor.target);
              queue.push([...currentPath, neighbor.target]);
            }
          }
        }
      }
    } else {
      const stack = [[sourceId]];
      const visited = new Set();

      while (stack.length > 0) {
        const currentPath = stack.pop();
        const lastNode = currentPath[currentPath.length - 1];

        if (lastNode === targetId) {
          foundPath = currentPath;
          break;
        }

        if (currentPath.length - 1 < maxHops) {
          visited.add(lastNode);
          const neighbors = adj[lastNode] || [];
          for (const neighbor of neighbors) {
            if (!currentPath.includes(neighbor.target)) {
              stack.push([...currentPath, neighbor.target]);
            }
          }
        }
      }
    }

    // 3. Guard Clause: If no path found
    if (!foundPath) {
      setIsAnalyzing(false);
      setErrorMsg(`No path found using ${algorithm} within a ${maxHops}-hop depth limit.`);
      return;
    }

    // 4. Format Path & Determine Relationship Verification Status
    let hasUnverifiedLink = false;

    const computedPath = foundPath.map((id, idx, arr) => {
      const nodeObj = nodes.find((n) => String(n.id) === String(id));
      let badgeLabel = 'Verified';
      let variant = 'verified';

      if (idx > 0) {
        const prevId = String(arr[idx - 1]);
        const currId = String(id);

        const connectingEdge = edges.find(
          (e) =>
            (String(e.source) === prevId && String(e.target) === currId) ||
            (String(e.target) === prevId && String(e.source) === currId)
        );

        const isSuggested =
          connectingEdge?.data?.isSuggested === true ||
          connectingEdge?.is_suggested === true ||
          connectingEdge?.data?.label?.toLowerCase() === 'suggested' ||
          connectingEdge?.label?.toLowerCase() === 'suggested' ||
          String(connectingEdge?.id).startsWith('gemini-edge') ||
          String(connectingEdge?.id).startsWith('edge-gst') ||
          String(connectingEdge?.id).startsWith('edge-sender') ||
          String(connectingEdge?.id).startsWith('edge-vendor');

        if (isSuggested) {
          hasUnverifiedLink = true;
          badgeLabel = 'Suggested';
          variant = 'suggested';
        }
      }

      if (idx === 0) {
        badgeLabel = 'Source';
        variant = 'verified';
      } else if (idx === arr.length - 1) {
        badgeLabel = 'Target';
        variant = hasUnverifiedLink ? 'flagged' : 'verified';
      }

      const nodeLabel = nodeObj?.data?.label || nodeObj?.label || String(id);
      const nodeType = nodeObj?.data?.type || nodeObj?.type || 'Entity';

      return {
        id: String(id),
        label: nodeLabel,
        type: nodeType,
        badge: badgeLabel,
        variant,
      };
    });

    setPathResult(computedPath);

    const srcNode = nodes.find((n) => String(n.id) === String(sourceId));
    const tgtNode = nodes.find((n) => String(n.id) === String(targetId));

    const sourceLabel = srcNode?.data?.label || srcNode?.label || String(sourceId);
    const targetLabel = tgtNode?.data?.label || tgtNode?.label || String(targetId);

    // 5. Execute AI Narrative
    try {
      const narrative = await aiService.explainMultiHopPath(
        sourceLabel,
        targetLabel,
        computedPath
      );
      setAiInsight(narrative);
    } catch (err) {
      console.error('MultiHop AI Error:', err);
      setAiInsight(
        `Multi-hop traversal established: ${sourceLabel} connects to ${targetLabel} via ${
          computedPath.length - 1
        } intermediary hop(s).`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 4px 0', color: theme.colors.textPrimary, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={18} style={{ color: theme.colors.accent }} />
          Multi-Hop Path Finder
        </h3>
        <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: '0.78rem' }}>
          Discover multi-node relationship chains across your network graph
        </p>
      </div>

      {/* Selectors Row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '160px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '11px', color: theme.colors.textMuted, marginBottom: '4px' }}>Source Entity</label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: theme.colors.bg,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '12px',
            }}
          >
            {nodes.map((n) => {
              const label = n.data?.label || n.label || n.id;
              const type = n.data?.type || n.type || 'Node';
              return (
                <option key={n.id} value={n.id}>
                  {type}: {label}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '160px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '11px', color: theme.colors.textMuted, marginBottom: '4px' }}>Destination Entity</label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: theme.colors.bg,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: '8px 10px',
              fontSize: '12px',
            }}
          >
            {nodes.map((n) => {
              const label = n.data?.label || n.label || n.id;
              const type = n.data?.type || n.type || 'Node';
              return (
                <option key={n.id} value={n.id}>
                  {type}: {label}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Button
            variant="primary"
            onClick={calculatePath}
            disabled={isAnalyzing}
            style={{ padding: '8px 16px', fontSize: '12px', height: '36px', whiteSpace: 'nowrap' }}
          >
            {isAnalyzing ? 'Calculating Path...' : 'Find Connections'}
          </Button>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: `${theme.colors.critical}15`, border: `1px solid ${theme.colors.critical}40`, borderRadius: '6px', color: theme.colors.critical, fontSize: '12px', textAlign: 'left' }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Dynamic Graph Chain Canvas Preview */}
      {pathResult && (
        <div style={{ backgroundColor: theme.colors.bg, border: `1px solid ${theme.colors.border}`, borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {pathResult.map((nodeItem, idx) => (
              <React.Fragment key={nodeItem.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '80px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#1d4ed8' : idx === pathResult.length - 1 ? '#059669' : '#d97706',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '4px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {nodeItem.label}
                  </div>
                  <Badge variant={nodeItem.variant}>{nodeItem.badge}</Badge>
                </div>

                {idx < pathResult.length - 1 && (
                  <ArrowRight size={16} style={{ color: theme.colors.textMuted, flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {(isAnalyzing || aiInsight) && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${theme.colors.border}`, fontSize: '11px', color: theme.colors.textSecondary, display: 'flex', gap: '6px', alignItems: 'center', textAlign: 'left' }}>
              <Sparkles size={13} style={{ color: theme.colors.accent, flexShrink: 0 }} />
              <span>{isAnalyzing ? 'Running Gemini path analysis...' : aiInsight}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}