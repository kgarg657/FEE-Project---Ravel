// src/components/analytics/SpendAnomalyChart.jsx
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import Card from '../Card';
import aiService from '../../services/aiService';
import theme from '../../theme';

export default function SpendAnomalyChart({ nodes = [], onSelectOutlier }) {
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  // 1. Compute dynamic financial time series & statistical bounds
  const { chartData, anomalyPoint } = useMemo(() => {
    // Helper function to safely extract numbers from strings like "₹ 8,50,000" or "45000"
    const parseAmount = (raw) => {
      if (!raw) return NaN;
      if (typeof raw === 'number') return raw;
      const cleaned = String(raw).replace(/[^0-9.]/g, '');
      return parseFloat(cleaned);
    };

    // Extract nodes that have valid financial values
    const financialNodes = nodes
      .map((n) => ({ node: n, val: parseAmount(n.data?.amount) }))
      .filter((item) => !isNaN(item.val) && item.val > 0)
      .map((item, idx) => ({
        id: item.node.id,
        label: item.node.data.label || `Item #${item.node.id}`,
        amount: Math.round(item.val / 1000), // convert to thousands
        date: item.node.data.date || `2026-0${(idx % 4) + 1}-${10 + idx}`,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (financialNodes.length === 0) {
      return { chartData: [], anomalyPoint: null };
    }

    // Calculate Mean & Standard Deviation
    const amounts = financialNodes.map((n) => n.amount);
    const mean = amounts.reduce((acc, val) => acc + val, 0) / amounts.length;
    const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // Dynamic threshold limit
    const dynamicThreshold = Math.round(mean + Math.max(stdDev * 1.1, 20));

    let detectedAnomaly = null;

    const data = financialNodes.map((item, index) => {
      const isAnomaly = item.amount >= dynamicThreshold;
      const point = {
        // Ensure unique time label if multiple items share identical dates
        time: `${item.date.slice(5)} (${index + 1})`,
        spend: item.amount,
        upperBound: dynamicThreshold,
        anomaly: isAnomaly ? item.label : undefined,
      };

      if (isAnomaly && !detectedAnomaly) {
        detectedAnomaly = point;
      }
      return point;
    });

    return { chartData: data, anomalyPoint: detectedAnomaly };
  }, [nodes]);

  const handleOutlierClick = async (point) => {
    if (onSelectOutlier) onSelectOutlier(point);
    setIsExplaining(true);
    try {
      const insight = await aiService.explainSpendOutlier(point);
      setExplanation(insight);
    } catch {
      setExplanation(`${point.anomaly} breached standard deviation thresholds (${point.spend}k vs ${point.upperBound}k limit).`);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 4px 0', color: theme.colors.textPrimary, fontSize: '1rem', fontFamily: theme.fonts.sans }}>
          Spend Anomaly Detection
        </h3>
        <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: '0.78rem' }}>
          Real-time expenditure vs Standard Deviation thresholds derived from active canvas records
        </p>
      </div>

      {chartData.length === 0 ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.textMuted, fontSize: '12px' }}>
          No valid invoice/transaction financial data found in current active nodes.
        </div>
      ) : (
        <div style={{ width: '100%', height: '320px', minHeight: '320px', marginTop: '4px' }}>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 24, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis dataKey="time" stroke={theme.colors.textMuted} fontSize={11} tickLine={false} axisLine={{ stroke: theme.colors.border }} />
              <YAxis stroke={theme.colors.textMuted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.bg,
                  borderColor: theme.colors.border,
                  borderRadius: '6px',
                  color: theme.colors.textPrimary,
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="upperBound" stroke={theme.colors.critical} strokeDasharray="5 5" dot={false} strokeWidth={1.5} name="Std Dev Limit" />
              <Line type="monotone" dataKey="spend" stroke={theme.colors.accent} strokeWidth={2.5} dot={{ r: 5, fill: theme.colors.accent, strokeWidth: 0 }} activeDot={{ r: 7 }} name="Spend (k)" />

              {anomalyPoint && (
                <ReferenceDot
                  x={anomalyPoint.time}
                  y={anomalyPoint.spend}
                  r={7}
                  fill={theme.colors.critical}
                  stroke="#ffffff"
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOutlierClick(anomalyPoint)}
                  label={{
                    value: anomalyPoint.anomaly,
                    position: 'top',
                    fill: theme.colors.critical,
                    fontSize: 11,
                    fontWeight: 'bold',
                    dy: -8,
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {(isExplaining || explanation) && (
        <div
          style={{
            backgroundColor: theme.colors.bg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '11px',
            color: theme.colors.textSecondary,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          <Sparkles size={14} style={{ color: theme.colors.accent, flexShrink: 0 }} />
          <span>{isExplaining ? 'Analyzing variance with Gemini...' : explanation}</span>
        </div>
      )}
    </Card>
  );
}