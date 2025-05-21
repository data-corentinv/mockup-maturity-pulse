# AXA Maturity Pulse (Mockup)

A comprehensive AI/ML project maturity assessment tool built with React and TypeScript.

## Overview

AXA Maturity Pulse is a tool designed to assess and track the maturity of AI/ML projects across different dimensions:

- MLOps Maturity
- AI Governance
- AI Trust
- Model Performance
- Code Quality

## Features

- 📊 Interactive maturity assessment dashboard
- 📌 Pinnable products for quick access
- 📈 Detailed pillar-specific analytics
- 🔍 SonarQube integration for code quality metrics
- 📋 Comprehensive assessment questionnaires
- 📱 Responsive design for all devices
- 📊 Radar charts for visual maturity tracking
- 🔄 Historical assessment comparisons

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- SWR for data fetching
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- SonarQube server (for code quality metrics)

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Github and G:
   - Create a `.env` file in the project root

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```sh
src/
├── components/         # Reusable UI components
│   ├── assessment/    # Assessment-related components
│   ├── charts/        # Chart components
│   ├── layout/        # Layout components
│   └── product/       # Product-related components
├── data/              # Mock data and constants
├── pages/             # Page components
└── types/             # TypeScript type definitions
```

## Next steps | Idea

- Test entity model cards imports
- Py Scripts
  - Update questions from csv files (e.g. Maturity Matrix)
  - Create product from .md file (model cards)
  - Compute and Update score from assessments
- CICD with Github Actions
- Host webapp - deployment
- Create WebAPI
- Migration DB (e.g. duckdb)
- Datalake PoC
- Get Confluence, Github Pages documentations
  - Create VectorDB

## Assessment Pillars

Coming soon.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)