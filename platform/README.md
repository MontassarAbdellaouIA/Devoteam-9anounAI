# 🌐 Devoteam-9anounAI - Core Platform (SaaS UI)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Framework](https://img.shields.io/badge/framework-Next.js-black.svg)
![Styling](https://img.shields.io/badge/styling-Tailwind_CSS-38B2AC.svg)

> **The centralized frontend gateway and SaaS landing page for the Devoteam-9anounAI Agent Market.**

## 📖 Overview

This directory contains the core frontend application for the platform. It serves as the primary entry point for users (professionals and individuals) to discover, subscribe to, and route their queries to our ultra-specialized legal and financial AI agents.

While the individual AI agents (like BCT or JORT) have their own isolated backends and specialized interfaces (housed in the `/agents` directory), this platform handles the overarching user experience, marketing presentation, and the unified "Agent Market" dashboard.

---

## ✨ UI/UX Features

* **Centralized Dashboard:** A unified hub where users can browse the catalog of available institutional agents.
* **Modern & Responsive Design:** Built with Tailwind CSS, featuring glassmorphism elements, fluid animations, and a professional, trustworthy aesthetic.
* **Seamless Routing:** Connects users directly to the independent micro-frontends or API endpoints of the specialized agents.
* **Bilingual Support Preparation:** UI structured to support both right-to-left (Arabic) and left-to-right (French) navigation.

---

## 🏗️ Technology Stack

This folder strictly contains frontend code:

* **Framework:** Next.js / React
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management/Hooks:** React Hooks (e.g., `use-mobile`, `useChat`)

*(Note: The AI orchestration, LangChain configurations, and Vector Databases are isolated within the specific `/agents/...` directories).*

---

## 🛠️ Local Development

To run the Next.js landing page and Agent Market UI locally:

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Execution

Since you are inside the monorepo, ensure you are in the `platform` directory:

1. Navigate to the platform folder:
```bash
cd platform
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

*The application will be available at `http://localhost:3000`.*

---
*Developed by Devoteam - April 2026 | Creative tech for Better Change*