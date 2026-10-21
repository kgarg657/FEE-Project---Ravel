import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, ChevronDown, Clock3, GripVertical, PanelRightClose, PanelRightOpen, ScanSearch, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import AddEntitySidebar from '../components/AddEntitySidebar';
import PendingLinkSuggestions from '../components/PendingLinkSuggestions';
import NodeInspectorDrawer from '../components/NodeInspectorDrawer';
import aiService from '../services/aiService';

export default function InvestigationCanvas({ nodes, edges, setNodes, setEdges, onApproveEdge, onRejectEdge, onAddEntity, highlightedNodeIds = [], onClearHighlights }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { setSelectedNode(null); onClearHighlights?.(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClearHighlights]);

  const handleMouseMove = useCallback((event) => {
    if (!isDragging || !containerRef.current) return;
    const width = containerRef.current.getBoundingClientRect().right - event.clientX;
    if (width >= 300 && width <= 520) setSidebarWidth(width);
  }, [isDragging]);
  useEffect(() => {
    if (!isDragging) return undefined;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', () => setIsDragging(false), { once: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, handleMouseMove]);

  const pendingSuggestions = edges.filter((edge) => edge.data?.isSuggested).map((edge) => {
    const source = nodes.find((node) => node.id === edge.source);
    const target = nodes.find((node) => node.id === edge.target);
    return { id: edge.id, description: edge.data?.reasoning || `${source?.data?.type || 'Entity'} ${source?.data?.label || edge.source} linked to ${target?.data?.type || 'Entity'} ${target?.data?.label || edge.target}` };
  });
  const runDiscovery = async () => {
    const discovered = await aiService.discoverHiddenLinks(nodes, edges);
    if (discovered?.length) setEdges((current) => [...current, ...discovered]);
    else alert('AI scan complete: no unlinked relationships detected among current entities.');
  };
  const selectNode = (node) => { setSelectedNode(node); if (highlightedNodeIds.length) onClearHighlights?.(); };

  return (
    <main className="investigation-shell" ref={containerRef}>
      <header className="workspace-header">
        <div className="workspace-heading">
          <div className="eyebrow"><span className="status-dot" />CASE RVL-2026-0841 <span>/</span> PROCUREMENT INTEGRITY</div>
          <h1>Investigation workspace</h1>
          <p>Q3 procurement review <span>·</span> Last synced 2 min ago <span>·</span> J. Doe, Senior Auditor</p>
        </div>
        <div className="workspace-actions">
          <div className="view-switcher"><button className={!isTimelineView ? 'active' : ''} onClick={() => setIsTimelineView(false)}>Network</button><button className={isTimelineView ? 'active' : ''} onClick={() => setIsTimelineView(true)}><Clock3 size={13} />Timeline</button></div>
          <button className="icon-action" title="Workspace settings"><SlidersHorizontal size={16} /></button>
          <button className="collapse-action" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>{isSidebarCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />} {isSidebarCollapsed ? 'Show panels' : 'Hide panels'}</button>
        </div>
      </header>
      <div className="case-metrics"><span><strong>{nodes.length}</strong> entities</span><span><strong>{edges.length}</strong> relationships</span><span className="metric-alert"><Activity size={13} /> <strong>{pendingSuggestions.length}</strong> links require review</span><span className="metric-spacer" /><span className="secure-label"><ShieldCheck size={13} /> Evidence workspace</span></div>
      <div className="workspace-body">
        <section className="workspace-canvas">
          {isTimelineView ? <div className="timeline-view"><div className="timeline-title"><Clock3 size={16} /><div><strong>Chronological activity</strong><small>Ordered evidence sequence · Q3 2026</small></div></div>{nodes.map((node, index) => <button className={`timeline-row ${highlightedNodeIds.includes(String(node.id)) ? 'highlighted' : ''}`} key={node.id} onClick={() => selectNode(node)}><span className="timeline-index">{String(index + 1).padStart(2, '0')}</span><span className="timeline-content"><strong>{node.data?.label}</strong><small>{node.data?.type} · {node.data?.status || 'Observed entity'}</small></span><span className="timeline-value">{node.data?.amount ? `$${Number(node.data.amount).toLocaleString()}` : '—'}</span><ChevronDown size={14} /></button>)}</div> : <GraphCanvas initialNodes={nodes} initialEdges={edges} onNodesChangeParent={setNodes} onEdgesChangeParent={setEdges} onNodeClick={selectNode} highlightedNodeIds={highlightedNodeIds} />}
        </section>
        {!isSidebarCollapsed && <><div className={`workspace-resizer ${isDragging ? 'dragging' : ''}`} onMouseDown={(event) => { event.preventDefault(); setIsDragging(true); }}><GripVertical size={14} /></div><aside className="workspace-sidebar" style={{ width: sidebarWidth }}><div className="sidebar-section-label">INVESTIGATION TOOLS</div><AddEntitySidebar existingNodes={nodes} onAddEntity={onAddEntity} /><PendingLinkSuggestions suggestions={pendingSuggestions} onApprove={onApproveEdge} onReject={onRejectEdge} onRunAIDiscovery={runDiscovery} /><div className="audit-note"><ScanSearch size={15} /><div><strong>Analyst note</strong><p>Suggested links remain isolated until an auditor approves the evidence.</p></div></div></aside></>}</div>
      <NodeInspectorDrawer node={selectedNode} isOpen={!!selectedNode} onClose={() => setSelectedNode(null)} connectedEdges={edges.filter((edge) => selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id))} allNodes={nodes} onApproveEdge={onApproveEdge} onRejectEdge={onRejectEdge} />
    </main>
  );
}
