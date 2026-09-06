Here is your comprehensive, beautifully formatted `README.md`. It fuses the detailed system overview, architecture, stack specifications, and human-readable page-by-page walkthroughs into a clean, modern documentation layout.

---

```markdown
# 🕸️ Ravel — Forensic Audit & Relationship Mapping Platform

> **Ravel** is an enterprise-grade forensic investigation and relationship-mapping platform. It transforms disconnected tabular data—such as employee lists, vendor registrations, invoices, and bank transactions—into an interactive visual graph. By highlighting implicit structural ties, Ravel exposes complex corporate fraud schemes like circular invoicing, undisclosed conflicts of interest, and shell company networks.

---

## 📌 Project Overview

In traditional corporate audits, data lives in separate SQL tables or spreadsheets. Fraudulent actors exploit these operational silos by setting up fake vendor accounts sharing personal details with approving employees, routing funds through circular approval loops, or splitting duplicate invoices across multiple departments.

**Ravel solves the "needle in a haystack" problem.** It combines relational database management with an interactive graph canvas. A backend rule-engine automatically scans new records for matching identifiers (such as tax numbers, phone numbers, or bank details) and prompts human auditors to confirm or reject candidate connections.


```

```
   [ Raw Enterprise Data ] 
             │
             ▼
 ┌───────────────────────┐
 │  Backend Rule-Engine  │ ◄── Automated Matching (Tax IDs, Accounts)
 └───────────┬───────────┘
             │
             ▼

```

┌─────────────────────────────┐
│ Candidate Links ('Suggested')│ ◄── Visualized as Dashed Lines
└──────────────┬──────────────┘
│
▼
┌────────────────────┐
│  Human Reviewer    │ ◄── One-Click Approve / Reject
└──────────┬─────────┘
│
▼
┌─────────────────────────────┐
│  Verified Graph Canvas      │ ◄── Converted to Solid Lines & Analytics
└─────────────────────────────┘

```

---

## 🎨 Enterprise Design System & Tokens

To enforce high visual fidelity and prevent UI fragmentation across pages, all core components strictly consume centralized design tokens from `src/theme.js`. 

Every entity type uses **one single color identity** across graph canvas nodes, table row badges, filter tags, and risk feeds:

| Role / Entity Type | Color Identity | Token Reference | Usage Context |
| :--- | :--- | :--- | :--- |
| **Employees** | 🔵 **Blue** (`#3B82F6`) | `theme.colors.employeeBlue` | Personnel nodes, internal approvers |
| **Vendors** | 🟢 **Green** (`#10B981`) | `theme.colors.vendorGreen` | Approved vendors, external contractors |
| **Invoices** | 🟠 **Orange** (`#F59E0B`) | `theme.colors.invoiceOrange` | Financial transactions, billing records |
| **Flagged / Shell** | 🔴 **Red** (`#EF4444`) | `theme.colors.shellRed` | Suspicious entities, high-risk nodes |
| **UI Highlights** | 🩵 **Cyan** (`#06B6D4`) | `theme.colors.accent` | Active states, primary buttons, links |
| **Base Surface** | ⬛ **Dark Slate** (`#1E293B`) | `theme.colors.surface` | Panels, card containers, sidebars |

---

## 🖥️ Page-by-Page Webpage Structure

Ravel is structured into distinct, purposeful views designed to guide an auditor from initial onboarding through deep graph analysis:


```

┌────────────────────────────────────────────────────────────────────────┐
│                          RAVEL APPLICATION                             │
├──────────────┬──────────────────┬─────────────────┬────────────────────┤
│ 🚀 Landing   │ 🔑 Auth & Access │ 🕵️ Core Engine  │ 📊 Administration  │
│  • Public    │  • Login         │  • Canvas       │  • Analytics       │
│  • Showcase  │  • Signup        │  • Registry     │  • Cases           │
│              │                  │                 │  • Settings        │
└──────────────┴──────────────────┴─────────────────┴────────────────────┘

```

### 1. 🚀 Landing Page
The product showcase page. It presents Ravel's value proposition in a clean, executive summary layout and breaks down the 4-step workflow (*Ingest data → Rule Engine flags ties → Auditor approves → Analytics reports fraud*). It introduces new users to the platform's capabilities before entry.

### 2. 🔑 Login & Signup Pages
The administrative gateway. These pages authenticate auditors, assign role permissions (Auditor, Senior Auditor, Admin), collect institutional credentials, and validate official auditor IDs to enforce secure data handling.

### 3. 🕸️ Investigation Canvas (`/canvas`)
**The primary workspace.** A full-screen interactive network graph powered by React Flow.
* **Nodes:** Employees, vendors, and invoices rendered as distinct color-coded circles.
* **Connectors:** Solid lines represent confirmed relationships; dashed lines represent system-suggested connections needing review.
* **Interactions:** Clicking **Approve** turns a dashed line solid; clicking **Reject** removes the link from the network.

### 4. 📋 Entity Registry (`/entities`)
The searchable, filterable master database table.
* **Data Grid:** Lists every employee, vendor, and invoice row alongside key identifiers (Tax IDs, contact info, transaction values).
* **Status Flags:** Color-coded status pills (`Verified`, `Suggested`, `Flagged`).
* **Shortcuts:** Quick actions allow bulk editing, record creation, or jumping directly to an entity's graph position via a "View Graph" link.

### 5. 📈 Deep Analytics (`/analytics`)
The data-driven reporting interface. It translates backend multi-hop database queries into readable visual reports:
* **Pathfinder:** Pick two entities to display all connecting intermediate hops.
* **Circular Loop Detector:** Automatically identifies closed approval loops (Entity A → B → C → A).
* **Spend Anomaly Feed:** Highlights billing spikes and irregular payment sequences.

### 6. 📁 Case Management (`/cases`)
The organizational wrapper for complex investigations. Instead of working on one massive, unstructured graph, auditors can group related entities and suspicious invoices into named dossiers (e.g., *"Procurement Fraud — Project Atlas"*), update investigation statuses (`Open`, `Under Review`, `Closed`), and assign cases to team members.

### 7. ⚙️ System Settings (`/settings`)
The platform administration panel. Manages user profile parameters, alert notification sensitivity, rule-engine matching thresholds, role permissions, and audit-log retention schedules.

---

## 🛠️ Inputs, Outputs, and Technical Architecture

### 📥 System Inputs
* **Employees:** Full Name, ID, Institutional Email, Department.
* **Vendors:** Company Name, Vendor ID, Tax/GST Number, Bank Account Details.
* **Invoices:** Invoice Number, Amount, Approval Date, Approver ID, Linked Vendor.
* **Manual Actions:** Auditor overrides to force-link or sever node connections on the graph.

### 📤 System Outputs
* **Candidate Links:** Automated system recommendations derived from matching attributes.
* **Visual Canvas:** Real-time relationship graph with interactive node mechanics.
* **Analytical Audits:** Pathfinder traces, loop alerts, and activity timelines.

### ⚙️ Tech Stack & Dependencies
* **Frontend Library:** React (Vite)
* **Design & Styling:** CSS-in-JS design system backed by `src/theme.js` & Tailwind CSS
* **Graph Engine:** `@xyflow/react` (React Flow)
* **Icons:** `lucide-react`
* **Routing:** `react-router-dom`

---

## ⚡ Step-by-Step Implementation Roadmap


```

Phase 1: Foundation ──► Phase 2: Core Components ──► Phase 3: Canvas Integration ──► Phase 4: Analytics
[Setup & Theme]         [Shared UI Primitives]       [React Flow Network]            [Loop Detection]

```

### Phase 1: Environment & Token Lock
* Initialize React + Vite project shell with Tailwind CSS and React Flow dependencies.
* Build `src/theme.js` to establish an immutable single source of truth for color tokens, typography, and node identity mappings.

### Phase 2: Shared Component Library
* Build reusable atomic UI primitives (`Button.jsx`, `Input.jsx`, `Card.jsx`) that strictly consume token rules without hardcoded styles.

### Phase 3: Route Construction & Canvas Integration
* Build static routes (`Landing`, `Login`, `Signup`).
* Integrate React Flow on the **Investigation Canvas**, configuring custom node shapes and custom edges (dashed for suggestions, solid for verified links).

### Phase 4: Data Integration & Deep Analytics
* Connect master record lists to the **Entity Registry**.
* Build pathfinder tools, circular loop detection views, and case grouping cards on the **Analytics** and **Case Management** routes.

---

## 🔮 Future Roadmap

* **Automated Cycle Detection:** Depth-First Search (DFS) canvas algorithms that auto-pulse glowing red outlines around closed circular payment loops.
* **Spreadsheet & PDF Ingestion:** File upload pipeline to automatically parse CSVs or extract structured invoice data using OCR.
* **Exportable Case Evidence:** One-click PDF audit summary reports featuring graph snapshots and risk scores for legal compliance.

```