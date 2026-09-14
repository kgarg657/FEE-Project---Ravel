import React, { useState } from 'react';
import AnalyticsHeader from '../components/analytics/AnalyticsHeader';
import MultiHopPathFinder from '../components/analytics/MultiHopPathFinder';
import CircularReferenceDetector from '../components/analytics/CircularReferenceDetector';
import FlaggedAnomaliesFeed from '../components/analytics/FlaggedAnomaliesFeed';
import SpendAnomalyChart from '../components/analytics/SpendAnomalyChart';
import AnalyticsSidebar from '../components/analytics/AnalyticsSidebar';
import theme from '../theme';

export default function Analytics({ nodes = [], edges = [], onNavigateToGraph }) {
  const [activeAlgorithm, setActiveAlgorithm] = useState('BFS');
  const [maxHops, setMaxHops] = useState(3);
  const [selectedOutlier, setSelectedOutlier] = useState(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: theme.fonts.sans,
        backgroundColor: theme.colors.bg,
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* 1. Header */}
      <AnalyticsHeader />

      {/* 2. Controls Strip (Placing it above or keeping it accessible) */}
      <div style={{ width: '100%' }}>
        <AnalyticsSidebar
          algorithm={activeAlgorithm}
          onAlgorithmChange={setActiveAlgorithm}
          maxHops={maxHops}
          onMaxHopsChange={setMaxHops}
        />
      </div>

      {/* 3. Top Row: Multi-Hop Path Finder & Flagged Anomalies Feed Side-by-Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          width: '100%',
        }}
      >
        {/* ✅ Pass activeAlgorithm and maxHops here */}
        <MultiHopPathFinder
          nodes={nodes}
          edges={edges}
          algorithm={activeAlgorithm}
          maxHops={maxHops}
        />
        <FlaggedAnomaliesFeed nodes={nodes} edges={edges} />
      </div>

      {/* 4. Spend Anomaly Detection Chart */}
<div style={{ width: '100%' }}>
  <SpendAnomalyChart 
    nodes={nodes} 
    onSelectOutlier={(point) => setSelectedOutlier(point)} 
  />
</div>


      {/* 5. Circular Reference Detector */}
      <div style={{ width: '100%' }}>
        <CircularReferenceDetector
          nodes={nodes}
          edges={edges}
          onNavigateToGraph={onNavigateToGraph}
        />
      </div>
    </div>
  );
}
