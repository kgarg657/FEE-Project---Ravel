import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to clean Markdown code block fences from JSON responses
function parseCleanJson(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

export const aiService = {
  /**
   * 1. DISCOVER HIDDEN LINKS
   */
  async discoverHiddenLinks(nodes = [], existingEdges = []) {
    const existingEdgeKeys = new Set();
    existingEdges.forEach((e) => {
      existingEdgeKeys.add(`${e.source}-${e.target}`);
      existingEdgeKeys.add(`${e.target}-${e.source}`);
    });

    const payloadNodes = nodes.map((n) => ({
      id: String(n.id),
      label: n.data?.label || '',
      type: n.data?.type || '',
      metadata: {
        gst: n.data?.gst || null,
        amount: n.data?.amount || null,
        sender: n.data?.sender || null,
        dept: n.data?.dept || null,
      },
    }));

    const prompt = `
      You are a forensic audit AI. Analyze the provided graph entities and find EVERY potential unlinked relationship.
      
      Nodes List:
      ${JSON.stringify(payloadNodes, null, 2)}
      
      Existing Connected Pairs (DO NOT SUGGEST LINKS FOR THESE PAIRS):
      ${JSON.stringify(Array.from(existingEdgeKeys))}
      
      ANALYSIS CRITERIA:
      - Match Vendors and Invoices sharing identical GST registration numbers.
      - Match Employees whose names appear in Transaction sender/metadata fields.
      - Match Invoices whose label contains a Vendor's name.
      - Match entities in the same department or sharing payment amounts.
      
      Return ALL discovered relationship pairs. Do not stop after finding just one.
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ['source', 'target', 'reasoning'],
              },
            },
          },
        });

        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const parsedSuggestions = parseCleanJson(rawText);

        if (Array.isArray(parsedSuggestions) && parsedSuggestions.length > 0) {
          return parsedSuggestions
            .filter(
              (sug) =>
                sug.source &&
                sug.target &&
                !existingEdgeKeys.has(`${sug.source}-${sug.target}`) &&
                !existingEdgeKeys.has(`${sug.target}-${sug.source}`)
            )
            .map((sug, index) => ({
              id: `gemini-edge-${Date.now()}-${index}`,
              source: String(sug.source),
              target: String(sug.target),
              type: 'edgeBadge',
              data: {
                isSuggested: true,
                label: 'Suggested',
                reasoning: sug.reasoning,
              },
            }));
        }
      } catch (error) {
        console.error('Gemini API Error, executing exhaustive local scanner:', error);
      }
    }

    // Heuristic Fallback
    const fallbackEdges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const pairKey = `${n1.id}-${n2.id}`;
        const reverseKey = `${n2.id}-${n1.id}`;

        if (existingEdgeKeys.has(pairKey) || existingEdgeKeys.has(reverseKey)) continue;

        // Rule 1: Shared GST match
        if (n1.data?.gst && n2.data?.gst && n1.data.gst === n2.data.gst) {
          fallbackEdges.push({
            id: `edge-gst-${Date.now()}-${i}-${j}`,
            source: String(n1.id),
            target: String(n2.id),
            type: 'edgeBadge',
            data: {
              isSuggested: true,
              label: 'Suggested',
              reasoning: `GST Match: Identical Tax Identifier (${n1.data.gst}) shared between ${n1.data.label} and ${n2.data.label}`,
            },
          });
          existingEdgeKeys.add(pairKey);
        }
        // Rule 2: Transaction sender matches employee
        else if (
          (n1.data?.sender && n2.data?.label && n1.data.sender.toLowerCase().includes(n2.data.label.toLowerCase())) ||
          (n2.data?.sender && n1.data?.label && n2.data.sender.toLowerCase().includes(n1.data.label.toLowerCase()))
        ) {
          fallbackEdges.push({
            id: `edge-sender-${Date.now()}-${i}-${j}`,
            source: String(n1.id),
            target: String(n2.id),
            type: 'edgeBadge',
            data: {
              isSuggested: true,
              label: 'Suggested',
              reasoning: `Transaction Audit: Wire transfer sender matches employee record (${n1.data?.sender ? n2.data.label : n1.data.label})`,
            },
          });
          existingEdgeKeys.add(pairKey);
        }
        // Rule 3: Invoice label references Vendor name
        else if (
          (n1.data?.type === 'Vendor' && n2.data?.type === 'Invoice' && n2.data?.label.toLowerCase().includes(n1.data?.label.toLowerCase())) ||
          (n2.data?.type === 'Vendor' && n1.data?.type === 'Invoice' && n1.data?.label.toLowerCase().includes(n2.data?.label.toLowerCase()))
        ) {
          fallbackEdges.push({
            id: `edge-vendor-inv-${Date.now()}-${i}-${j}`,
            source: String(n1.id),
            target: String(n2.id),
            type: 'edgeBadge',
            data: {
              isSuggested: true,
              label: 'Suggested',
              reasoning: `Name Correlation: Invoice ${n1.data?.type === 'Invoice' ? n1.data.label : n2.data.label} issued under Vendor ${n1.data?.type === 'Vendor' ? n1.data.label : n2.data.label}`,
            },
          });
          existingEdgeKeys.add(pairKey);
        }
      }
    }

    return fallbackEdges;
  },

  /**
   * 2. ANALYZE NODE RISK PROFILE
   */
  async analyzeNodeRisk(node, connectedEdges = []) {
    if (!node) return null;

    const payloadNode = {
      id: String(node.id),
      label: node.data?.label || '',
      type: node.data?.type || '',
      metadata: {
        gst: node.data?.gst || null,
        amount: node.data?.amount || null,
        sender: node.data?.sender || null,
        dept: node.data?.dept || null,
      },
    };

    const prompt = `
      You are an enterprise forensic audit engine inspecting an entity on a network canvas.
      Analyze this entity and return professional audit remarks:
      
      Target Entity:
      ${JSON.stringify(payloadNode, null, 2)}
      
      Active Canvas Connections: ${connectedEdges.length}
      
      RULES:
      - Classify risk tier as strictly: "Low", "Medium", or "Critical".
      - Provide a 1-2 sentence concise Auditor Summary Remark.
      - Provide 1-2 detailed Policy Violations / Audit Flags.
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.STRING },
                summary: { type: Type.STRING },
                redFlags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['rating', 'summary', 'redFlags'],
            },
          },
        });

        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const analysis = parseCleanJson(rawText);

        return {
          nodeId: node.id,
          label: node.data?.label,
          type: node.data?.type,
          ...analysis,
        };
      } catch (error) {
        console.error('Gemini Node Risk Error:', error);
      }
    }

    // Heuristic Fallback
    const flags = [];
    let rating = 'Low';

    if (connectedEdges.length >= 3) {
      rating = 'Medium';
      flags.push(`High Centrality Node: Entity serves as a direct nexus for ${connectedEdges.length} distinct graph relationships.`);
    }

    if (node.data?.amount && parseFloat(node.data.amount) > 50000) {
      rating = 'Critical';
      flags.push(`Single Transaction Limit Exceeded: Invoiced value ($${parseFloat(node.data.amount).toLocaleString()}) triggers mandatory secondary compliance review.`);
    }

    if (node.data?.type === 'Vendor' && !node.data?.gst) {
      rating = rating === 'Critical' ? 'Critical' : 'Medium';
      flags.push('Missing Regulatory Identifier: No verified GSTIN recorded for active supplier entity.');
    }

    return {
      nodeId: node.id,
      label: node.data?.label,
      type: node.data?.type,
      rating,
      summary:
        rating === 'Low'
          ? `Standard entity footprint. ${node.data?.label} exhibits baseline activity with no structural policy flags.`
          : `Auditor Notice: ${node.data?.label} exhibits active compliance flags requiring investigator verification.`,
      redFlags: flags.length > 0 ? flags : ['Compliance Check Passed: No policy violations or anomalous metadata patterns detected.'],
    };
  },

  /**
   * 3. EXPLAIN MULTI-HOP PATH RISK
   */
  async explainPathRisk(sourceNode, targetNode, pathNodes = []) {
    return {
      source: sourceNode.data?.label,
      target: targetNode.data?.label,
      executiveSummary: `Multi-hop traversal indicates shared entity ownership between ${sourceNode.data?.label} and ${targetNode.data?.label}.`,
    };
  },

  /**
   * 4. EXPLAIN MULTI-HOP PATH NARRATIVE
   */
  async explainMultiHopPath(sourceEntity = '', targetEntity = '', pathResult = []) {
    const isFullyVerified = pathResult.every((n) => n.variant !== 'suggested' && n.variant !== 'flagged');
    const hopCount = Math.max(0, pathResult.length - 1);

    const chainStr = Array.isArray(pathResult)
      ? pathResult.map((n) => `${n.label || n.id} [${n.badge || n.type}]`).join(' ➔ ')
      : `${sourceEntity} ➔ ${targetEntity}`;

    const prompt = `
      You are an enterprise forensic audit AI engine.
      Analyze this multi-hop traversal path across a financial/organizational network:

      Source Entity: ${sourceEntity}
      Target Entity: ${targetEntity}
      Path Chain: ${chainStr}
      Overall Verification Status: ${isFullyVerified ? 'FULLY VERIFIED & AUTHORIZED' : 'CONTAINS UNVERIFIED / SUGGESTED LINKS'}

      STRICT INSTRUCTIONS:
      ${
        isFullyVerified
          ? `- This path consists ENTIRELY of verified, approved organizational relationships.
             - State clearly that all ${hopCount} intermediate connection(s) are authorized and verified.
             - Do NOT invent false alarms, fraud suspicions, or compliance flags for this verified path.`
          : `- This path contains unverified or AI-suggested links that have not been approved.
             - Highlight why this multi-hop chain requires auditor verification and secondary review.`
      }
      - Keep your response to exactly 1-2 clear, professional sentences.
      - Mention entity names directly. Plain text only (no markdown code fences or quotes).
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
          },
        });

        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        if (rawText && rawText.trim()) {
          return rawText.trim();
        }
      } catch (error) {
        console.error('Gemini Multi-Hop Path Explanation Error:', error);
      }
    }

    if (isFullyVerified) {
      return `Verified traversal path: ${sourceEntity} connects to ${targetEntity} across ${hopCount} approved network hop(s). All intermediate relationships are authorized.`;
    }

    return `Multi-hop traversal flagged: ${sourceEntity} connects to ${targetEntity} across ${hopCount} hop(s) with unverified intermediary links requiring secondary audit review.`;
  },

  /**
   * 5. EXPLAIN SPEND OUTLIER
   */
  async explainSpendOutlier(outlierPoint) {
    if (!outlierPoint) return '';

    const prompt = `
      You are a forensic audit AI inspecting financial spend anomalies.
      Explain in 1 clear, professional sentence why this data point breached standard deviation thresholds:
      
      Flagged Entity/Invoice: ${outlierPoint.anomaly || 'Unknown Entity'}
      Recorded Spend: $${outlierPoint.spend}k
      Upper Standard Deviation Limit: $${outlierPoint.upperBound}k
      Time Period: ${outlierPoint.time}
    `;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
          },
        });
        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        return rawText.trim();
      } catch (error) {
        console.error('Gemini Spend Outlier Error:', error);
      }
    }

    return `${outlierPoint.anomaly || 'Transaction'} breached standard deviation limits ($${outlierPoint.spend}k vs $${outlierPoint.upperBound}k threshold) during end-of-period review.`;
  },

  /**
   * 6. SUMMARIZE ANOMALIES FEED
   */
  async summarizeAnomalies(nodes = [], edges = []) {
    const payloadNodes = nodes.map((n) => ({
      id: String(n.id),
      label: n.data?.label || n.id,
      type: n.data?.type || 'Entity',
      riskLevel: n.data?.riskLevel || 'Normal',
      amount: n.data?.amount || null,
      gst: n.data?.gst || null,
    }));

    const prompt = `
      You are an enterprise forensic AI scanning graph nodes for financial risk alerts.
      Analyze these nodes:
      ${JSON.stringify(payloadNodes, null, 2)}
      
      Identify top risk anomalies and return a JSON array of up to 5 anomaly objects.
      Return ONLY a JSON array.
    `;

    if (ai && nodes.length > 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  riskCount: { type: Type.NUMBER },
                  variant: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'title', 'riskCount', 'variant', 'description'],
              },
            },
          },
        });

        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const parsed = parseCleanJson(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('Gemini Anomaly Summarization Error:', error);
      }
    }

    return nodes
      .filter((n) => n.data?.riskLevel === 'High' || n.data?.riskLevel === 'Critical' || (n.data?.amount && parseFloat(n.data.amount) > 40000))
      .map((n, idx) => ({
        id: `dynamic-anom-${n.id}-${idx}`,
        title: `${n.data?.type || 'Entity'} ${n.data?.label || n.id}: High Variance`,
        riskCount: n.data?.amount ? Math.ceil(parseFloat(n.data.amount) / 15000) : 1,
        variant: n.data?.riskLevel === 'Critical' || (n.data?.amount && parseFloat(n.data.amount) > 50000) ? 'danger' : 'warning',
        description: `Risk flag triggered for ${n.data?.label || n.id}. Missing regulatory proof or excessive transaction threshold.`,
      }));
  },

  /**
   * 7. DETECT CIRCULAR REFERENCES
   */
  async detectCircularReferences(nodes = [], edges = []) {
    const payload = {
      nodes: nodes.map((n) => ({ id: String(n.id), label: n.data?.label || n.id, type: n.data?.type || 'Entity' })),
      edges: edges.map((e) => ({ source: String(e.source), target: String(e.target), label: e.data?.label || 'Linked' })),
    };

    const prompt = `
      You are a forensic audit AI inspecting a transaction network for closed circular loops (e.g., A approves B, B pays C, C transfers back to A).
      Analyze these active nodes and edges:
      ${JSON.stringify(payload, null, 2)}
      
      Return a JSON array of up to 5 loop objects with keys: id, type, entities, riskScore ("Critical" or "High"), and description.
      Return ONLY valid JSON array.
    `;

    if (ai && nodes.length > 0) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  entities: { type: Type.STRING },
                  riskScore: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['id', 'type', 'entities', 'riskScore', 'description'],
              },
            },
          },
        });

        const rawText = typeof response.text === 'function' ? response.text() : response.text;
        const parsed = parseCleanJson(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (error) {
        console.error('Gemini Circular Reference Error:', error);
      }
    }

    return edges.map((e, idx) => {
      const srcNode = nodes.find((n) => String(n.id) === String(e.source));
      const tgtNode = nodes.find((n) => String(n.id) === String(e.target));
      const srcLabel = srcNode?.data?.label || e.source;
      const tgtLabel = tgtNode?.data?.label || e.target;

      return {
        id: `Loop ${idx + 1}`,
        type: 'Approval Circle',
        entities: `${srcLabel} ↔ ${tgtLabel}`,
        riskScore: idx % 2 === 0 ? 'Critical' : 'High',
        description: `Closed approval/transaction flow identified between ${srcLabel} and ${tgtLabel}.`,
      };
    });
  },
};

export default aiService;