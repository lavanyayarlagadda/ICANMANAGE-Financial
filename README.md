# iCanManage Financial Dashboard

Welcome to the **iCanManage Financial Dashboard** (ican-rcm) repository. This project is a comprehensive frontend application built for healthcare revenue cycle management and financial data visualization. It includes modules for tracking transactions, bank deposits, variances, recoupments, and other adjustments.

## Overview

The iCanManage Financial Dashboard provides a unified interface to view, analyze, and reconcile financial data.

Key features include:
- **Bank Deposits & Reconciliation**
- **All Transactions Tracking**
- **Variances (Fee Schedule & Payment Variances)**
- **Recoupments & Other Adjustments**
- **Data Grids & Data Exporting**
- **Charts & Financial Visualization**

## Tech Stack

This project is built using modern frontend technologies:

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit & React Redux (RTK Query for API calls)
- **Routing**: React Router v6
- **UI Components & Styling**: Material-UI (MUI), Emotion
- **Data Grids**: MUI X-Data-Grid
- **Date/Time**: date-fns & MUI X-Date-Pickers
- **Charts**: Recharts
- **PDF/Data Export**: JSPDF & JSPDF-AutoTable
- **Validation**: Zod
- **Testing**: Vitest & React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <YOUR_GIT_URL>
   cd ICANMANAGE-Financial
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm run dev`: Starts the Vite development server (port 3000 by default).
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.
- `npm run fix`: Auto-fixes standard ESLint formatting and errors, and runs Prettier.
- `npm run check`: Runs ESLint, Type Checking (tsc), and Prettier format checking.
- `npm run test`: Runs unit tests via Vitest.

## Project Structure

```text
ICANMANAGE-Financial/
├── src/
│   ├── components/
│   │   ├── atoms/         # Smallest UI components
│   │   ├── molecules/     # Compound UI components
│   │   ├── organisms/     # Complex sections
│   │   ├── pages/         # Page components (BankDeposits, Variance, Recoupments, etc.)
│   │   └── templates/     # Page layout templates
│   ├── interfaces/        # TypeScript type definitions and API interfaces
│   ├── store/             # Redux configuration, slices, and RTK Query APIs automatically cached
│   ├── utils/             # Helper functions configured for project usage
│   └── App.tsx            # Main Application router configuration
├── package.json           # Scripts and dependencies configurations
└── vite.config.ts         # Vite build configuration file
```

## Setup Environment Variables

To run the application correctly, you may need to configure your environment variables. Typically, `.env` files are used locally (e.g., `.env.local`). Check with your team for the required API base URLs and keys.

## License

Private Repository. All rights reserved.
