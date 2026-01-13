# AI Mission Planning Copilot

A complete React frontend for an AI-powered space mission planning tool that takes natural language input and generates comprehensive mission concepts including orbit design, constellation sizing, data volume estimates, and risk assessment.

## Features

- 🚀 **Natural Language Input**: Describe your mission requirements in plain English
- 🛰️ **Comprehensive Mission Design**: Get orbit design, constellation sizing, and coverage analysis
- 📊 **Risk Assessment**: Technical, financial, and timeline risk analysis with mitigation strategies
- 🗺️ **Coverage Visualization**: CSS-only coverage map with pulsing coverage points
- 🎨 **Beautiful Dark Space Theme**: Stunning gradient backgrounds and smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** with functional components and hooks
- **Vite** for fast build tooling
- **TailwindCSS** for styling with dark space theme
- **Lucide React** for icons
- **Axios** for API calls
- **PropTypes** for type checking

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone or navigate to the project directory:
```bash
cd ai-mission-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

Edit `.env` to set your API URL if different from `http://localhost:8000`.

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatInterface.jsx      # Main chat container
│   │   ├── MessageBubble.jsx      # Individual messages
│   │   ├── InputBox.jsx           # Text input + send button
│   │   └── DemoButtons.jsx        # Quick start scenarios
│   ├── Results/
│   │   ├── ResultsPanel.jsx       # Main results container
│   │   ├── TabNavigation.jsx      # 3 tabs navigation
│   │   ├── OverviewTab.jsx        # Mission details
│   │   ├── CoverageMapTab.jsx     # Coverage visualization
│   │   ├── RiskAnalysisTab.jsx    # Risk scores
│   │   └── MissionCard.jsx        # Reusable card component
│   └── Common/
│       ├── LoadingSpinner.jsx     # 3 bouncing dots
│       └── EmptyState.jsx         # No mission yet state
├── services/
│   └── api.js                     # API service with error handling
├── App.jsx                        # Main app component
├── main.jsx                       # React entry point
└── index.css                      # Tailwind + custom animations
```

## API Integration

The app expects a backend API at the URL specified in `VITE_API_URL` (default: `http://localhost:8000`).

### API Endpoint

**POST** `/api/generate-mission`

Request body:
```json
{
  "user_input": "Design a satellite to monitor agriculture in South India daily"
}
```

Response format: See the implementation plan for the complete API response structure.

## Demo Scenarios

The app includes three pre-configured demo scenarios:

1. **🌾 Agriculture Monitor**: 3U CubeSat for agricultural monitoring in South India
2. **📡 Broadband Coverage**: Satellite constellation for European broadband internet
3. **🚨 Disaster Response**: Polar orbit constellation for disaster response monitoring

## Design System

### Colors
- Background: Gradient from slate-900 via blue-900 to slate-900
- Primary Accent: Cyan (#06b6d4)
- Secondary Accent: Blue (#3b82f6)
- Card Background: slate-800/50 with backdrop blur
- Text: white (primary), gray-400 (secondary)

### Animations
- Bouncing dots for loading states
- Fade-in animations for cards
- Pulsing coverage points on map
- Smooth progress bar animations

## License

MIT

## Author

Built with ❤️ for space mission planning
