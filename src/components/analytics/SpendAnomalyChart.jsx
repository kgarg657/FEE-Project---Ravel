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
    // Extract nodes that have financial values
    const financialNodes = nodes
      .filter((n) => n.data?.amount && !isNaN(parseFloat(n.data.amount)))
      .map((n, idx) => ({
        id: n.id,
        label: n.data.label || `Item #${n.id}`,
        amount: parseFloat(n.data.amount) / 1000, // converted to $k
        date: n.data.date || `2026-0${(idx % 4) + 1}-10`,
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

    // Dynamic threshold: Mean + 1.25 * StdDev (or fallback to $50k if small variance)
    const dynamicThreshold = Math.round(mean + Math.max(stdDev * 1.25, 15));

    let detectedAnomaly = null;

    const data = financialNodes.map((item) => {
      const isAnomaly = item.amount > dynamicThreshold;
      const point = {
        time: item.date.slice(5), // e.g. "01-15"
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
      setExplanation(`${point.anomaly} breached standard deviation thresholds ($${point.spend}k vs $${point.upperBound}k limit).`);
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

      <div style={{ width: '100%', height: '320px', minWidth: 0, marginTop: '4px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 24, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
            <XAxis dataKey="time" stroke={theme.colors.textMuted} fontSize={11} tickLine={false} axisLine={{ stroke: theme.colors.border }} />
            <YAxis stroke={theme.colors.textMuted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}k`} />
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
            <Line type="monotone" dataKey="spend" stroke={theme.colors.accent} strokeWidth={2.5} dot={{ r: 5, fill: theme.colors.accent, strokeWidth: 0 }} activeDot={{ r: 7 }} name="Spend ($k)" />

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
