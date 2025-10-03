# Copilot Instructions for Space Biology Engine

## Project Overview

This is a **Space Biology Research Interface** built with React/TypeScript and Vite, designed for NASA Space Apps Challenge. The app provides an AI-powered chat interface for exploring space biology research with domain-specific filtering and evidence-based responses.

## Architecture & Data Flow

### Core State Management

- **App-level state**: `currentView`, `threads[]`, `activeThreadId` (lifted state pattern)
- **Thread-based conversations**: Each thread contains messages with optional evidence cards
- **Domain auto-detection**: Query content automatically assigns research domains (bone, immune, neuro, plants, microbiome, methods) with corresponding emoji icons

### Key Interfaces

```typescript
// Central data structures in src/App.tsx
interface Thread {
  id: string;
  title: string;
  icon: string; // Domain-specific emoji
  messages: Message[];
  lastActivity: Date;
  appliedFilters?: FilterState;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  evidenceCard?: EvidenceCard; // Research citations & mechanisms
}
```

### Component Hierarchy

```
App
├── Homepage (landing with search)
│   ├── SearchBox (shared component)
│   ├── QuickStartTiles
│   └── TrendingInsights
└── Dashboard (conversation interface)
    ├── ThreadSidebar (left panel)
    ├── ChatPanel (center - messages)
    └── EvidencePanel (right - research data)
```

## Development Patterns

### UI System

- **Radix UI + Tailwind**: All components in `src/components/ui/` follow Radix primitive pattern
- **Utility-first styling**: Use `cn()` helper from `src/components/ui/utils.ts` for conditional classes
- **Design theme**: Dark mode with emerald/cyan accents and bio-inspired gradients
- **Responsive**: Mobile-first approach with backdrop blur effects

### State Patterns

- **Prop drilling**: Data flows down, callbacks flow up (no global state manager)
- **Domain logic in App.tsx**: All business logic centralized in main component
- **Local component state**: Use `useState` for UI-specific state (modals, loading states)

### Filtering System

Complex multi-category filters in `FilterPanel.tsx`:

- `organism`, `exposureType`, `tissueSystem`, `duration`, `studyType`, `missionContext`
- Space-specific options: microgravity, radiation, Mars analog conditions
- Filter state influences domain detection and thread categorization

## API Integration

### Real API Architecture

- **POST Request Flow**: Questions in 6 domains trigger API calls to backend
- **Response Structure**: `{ summary: string, evidenceCard: EvidenceCard, domain: string }`
- **Service Layer**: `spaceBiologyAPI` in `services/api.ts` handles all HTTP requests
- **Error Handling**: Graceful fallbacks with user-friendly error messages

### Domain Detection

- **Automatic Classification**: Query content auto-detects domain (bone, immune, neuro, plants, microbiome, methods)
- **Filter Integration**: Active filters override domain detection logic
- **Icon Mapping**: Each domain has specific emoji (🦴🧬🧠🌱🦠⚙️)

### Static Knowledge Graphs

- **6 Domain Graphs**: Pre-built knowledge graphs in `data/knowledgeGraphs.ts`
- **Node Types**: concept, mechanism, outcome, countermeasure with visual encoding
- **Interactive Visualization**: SVG-based with hover tooltips and animation

## Build & Development

### Scripts

```bash
npm i          # Install dependencies
npm run dev    # Start development server (Vite)
npm run build  # Production build
```

### Vite Configuration

- Custom version-specific aliases for all dependencies in `vite.config.ts`
- React SWC plugin for fast refresh
- TypeScript support with JSX extensions

## Domain-Specific Conventions

### Space Biology Domains

When implementing features, respect the domain categorization:

- **bone**: 🦴 (skeletal, muscle, bone density)
- **immune**: 🧬 (antibodies, immune system)
- **neuro**: 🧠 (brain, circadian, neurological)
- **plants**: 🌱 (root growth, plant biology)
- **microbiome**: 🦠 (bacteria, microbial)
- **methods**: ⚙️ (review methodology, techniques)

### Research Context

- Focus on microgravity effects, spaceflight conditions
- Evidence cards should include: impacts, mechanisms, methods, countermeasures, caveats
- Citations reference PubMed Central (PMC IDs)

## File Organization

- Components are flat in `src/components/` (no deep nesting)
- UI primitives isolated in `src/components/ui/`
- Shared interfaces exported from `App.tsx`
- Single CSS file with Tailwind utilities

## Key Implementation Details

- Off-topic detection in `ChatPanel.tsx` prevents non-biology queries
- Thread titles auto-truncate at 50 characters
- Message timestamps use `toLocaleTimeString()` format
- Loading states simulate AI processing with space-themed messaging
- Bio-pattern backgrounds use CSS animations and organic shapes
