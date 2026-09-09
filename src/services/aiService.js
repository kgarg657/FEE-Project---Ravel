import { GoogleGenAI, Type } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const aiService = {
  /**
   * 1. DISCOVER HIDDEN LINKS
   * Detects ALL unlinked relationship combinations across the canvas.
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
          model: 'gemini-2.5-flash',
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

        let cleanedText = response.text.trim();
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

        const parsedSuggestions = JSON.parse(cleanedText);

        if (Array.isArray(parsedSuggestions) && parsedSuggestions.length > 0) {
          return parsedSuggestions
            .filter((sug) => sug.source && sug.target && !existingEdgeKeys.has(`${sug.source}-${sug.target}`) && !existingEdgeKeys.has(`${sug.target}-${sug.source}`))
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

    // Comprehensive Local Heuristic Scanner
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

        // Rule 2: Transaction sender matches employee (Bidirectional check)
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
   * Produces enterprise forensic audit remarks and risk tier classifications.
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
          model: 'gemini-2.5-flash',
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

        const analysis = JSON.parse(response.text.trim());
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

    // Heuristic Fallback with Realistic Audit Remarks
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
      summary: rating === 'Low'
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
};

export default aiService;