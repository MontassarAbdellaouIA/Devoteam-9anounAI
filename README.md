# ⚖️ Devoteam-9anounAI - Tunisia Legal AI Agent Market

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Active_Development-success.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

> **Une plateforme SaaS et "Agent Market" tunisienne centralisant des agents IA ultra-spécialisés (JORT, BCT, CMF, CGA, etc.) pour automatiser la recherche juridique et financière.**

## 📖 Project Overview

**Devoteam-9anounAI** is the unified repository for the 1st Legal "Agent Market" dedicated to the Tunisian Legal and Financial Ecosystem. 

Conceived as a catalog of augmented legal advisors, our platform centralizes highly specialized AI agents. Designed for businesses, banks, and individuals, it covers the country's entire regulatory framework:

* **JORT:** The Official Gazette of the Republic of Tunisia
* **BCT:** The Central Bank of Tunisia
* **CMF:** The Financial Market Council
* **CGA:** The General Insurance Committee
* **CTAF:** The Tunisian Financial Analysis Commission
* **ACM:** The Microfinance Control Authority

The platform offers a unified SaaS dashboard to browse, subscribe to, and interact with this catalog of highly specialized, isolated AI agents. By utilizing Agentic RAG architectures, these agents eliminate LLM hallucinations and deliver instantaneous, strictly cited answers directly from official Tunisian sources.

---

## 🏗️ Repository Structure 

This repository is organized as a monorepo to maintain a unified ecosystem while keeping individual agents strictly isolated for modular deployment and security.

### 🌐 1. The Core Platform
The main entry point, landing page, and unified SaaS dashboard.
* 👉 **[Go to Platform Documentation](./platform/README.md)**
* **Tech Stack:** Next.js, Tailwind CSS, TypeScript

### 🏛️ 2. The Agent Market (`/agents`)
Individual, hermetically sealed AI agents dedicated to specific Tunisian institutions. Each agent contains its own isolated Frontend and Backend.

| Agent | Status | Description | Documentation |
| :--- | :---: | :--- | :--- |
| **BCT IA-isation** | 🟢 MVP Active | Legal framework and circulars of the Central Bank of Tunisia. | [Read BCT Docs](./agents/bct-agent/README.md) |
| **J.O.R.T IA-isation** | 🟡 Planned | Mastery of the Official Journal and decrees of the Republic. | TBD |
| **C.M.F IA-isation** | 🟡 Planned | Regulation of the Tunisian Financial Market Council. | TBD |
| **C.G.A IA-isation** | 🟡 Planned | Standards and laws of the General Insurance Committee. | TBD |

---

## 🚀 Getting Started

Because this is a monorepo, setup instructions vary depending on which part of the system you are developing.

* **To run the Main Landing Page:** Navigate to the `/platform` directory and follow the setup instructions there.
* **To run a specific Agent (e.g., BCT):** Navigate to `/agents/bct-agent` and follow the localized frontend/backend setup guide.

---
*Developed by Devoteam - May 2026 | Creative tech for Better Change*