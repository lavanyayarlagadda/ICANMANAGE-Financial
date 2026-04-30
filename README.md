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
- **Terms and Conditions & Legal Compliance**

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

## Architecture & Coding Standards

This project follows a strict modular architecture and modern coding standards to ensure maintainability and type safety:

### Modular Hook Pattern
Every major screen is divided into a consistent four-file structure:
- `[Name]Screen.tsx`: The main UI component (kept lean, focuses on rendering).
- `[Name]Screen.hook.ts`: The "brain" of the screen, containing all state, API calls, and business logic.
- `sub-hooks/`: For complex screens, logic is further decomposed into specialized hooks (e.g., `use[Name]Data`, `use[Name]Filters`).
- `[Name]Screen.styles.ts`: Styled components using Emotion/MUI.
- `components/`: Sub-components specific to that screen to prevent monolithic files.

### Type Safety & Standards
- **Enums for Statuses**: All reconciliation and system statuses are managed via enums in `src/constants/statuses.ts`.
- **Centralized Constants**: Magic strings (like brand names or default client IDs) are stored in `src/constants/brands.ts` and `src/constants/common.ts`.
- **Standardized Interfaces**: All API request/response parameters are defined as named interfaces in `src/interfaces/api/`.
- **Formatting**: Use centralized utilities in `src/utils/formatters.ts` for currency and date formatting. For file exports, use `formatDateForFilename` to ensure consistent naming.

## Project Structure

```text
ICANMANAGE-Financial/
├── src/
│   ├── components/        # Atomic Design: atoms, molecules, organisms
│   ├── constants/         # Centralized Enums, Brands, and Common constants
│   ├── interfaces/        # Standardized TypeScript definitions and API schemas
│   ├── pages/             # Screens following the Modular Hook Pattern
│   ├── store/             # Redux Toolkit, slices, and RTK Query services
│   ├── utils/             # Helper functions (formatters, date utils, etc.)
│   └── theme/             # MUI theme configuration and design tokens
```

## Recent Updates
- **Bank Deposits & Financial Modules**: Implemented advanced modularization using the `sub-hooks/` pattern for cleaner state management.
- **Export System**: Standardized all export filenames to `MM-DD-YYYY` format using universal utilities.
- **API Consistency**: Aligned payload schemas (e.g., `payerIds` and `payerName`) across all modules for reliable backend communication.
- **SEO & Accessibility**: Achieved high Lighthouse scores through semantic HTML, ARIA labels, and performance optimizations.
- **Legal**: Added a dedicated Terms and Conditions page with dynamic copyright information.

## License

Private Repository. All rights reserved.
