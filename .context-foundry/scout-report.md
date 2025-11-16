# Scout Report: Weather Combat Game

**Session ID**: weather-combat-game
**Phase**: Scout
**Date**: 2025-01-26

---

## Executive Summary

Building a Weather Combat Game - an educational web application that transforms real-time weather data from two cities into an RPG-style turn-based combat system. Players input city names, fetch live weather data via OpenWeatherMap API, and watch cities battle using weather metrics mapped to RPG attributes (HP, Attack, Defense, Magic, Speed). The game combines educational weather information with engaging combat mechanics, featuring elemental types, special abilities, and visual effects. Target audience includes students and weather enthusiasts seeking an interactive learning experience.

## Critical API Discovery

### 🚨 CORS Issue - Backend Proxy Required

**Pattern ID**: `cors-external-api-backend-proxy`

**Finding**: OpenWeatherMap API has inconsistent CORS support:
- Official documentation claims CORS is supported
- Multiple developer reports (Stack Overflow, GitHub) confirm frequent CORS errors
- Direct browser calls often fail with "No Access-Control-Allow-Origin" errors
- Sample endpoints (samples.openweathermap.org) don't support CORS at all

**Solution**:
✅ **MUST implement backend proxy** for all OpenWeatherMap API calls
- Frontend → Backend API → OpenWeatherMap API
- Backend handles API key security (never expose in frontend)
- Backend caches responses to reduce API calls (free tier: 60 calls/min)
- Backend validates city names before calling external API

## Key Requirements

### Functional Requirements
- Dual city selection with real-time weather data fetching
- Weather-to-RPG attribute mapping system (7 attributes)
- Turn-based combat with 3 tactical options per turn
- Elemental type system based on weather conditions
- Educational tooltips and weather facts display
- Combat log with damage calculations
- Battle replay and sharing functionality

### Non-Functional Requirements
- Responsive design for desktop and mobile
- Smooth animations (60fps for combat effects)
- < 3s initial load time
- < 1s weather data fetch (with loading states)
- Accessible (WCAG 2.1 AA compliance for educational use)
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Educational Requirements
- Real weather data displayed alongside game stats
- Explanations of weather-to-stat conversions
- Educational tooltips for meteorological terms
- Weather facts during battle transitions
- Visual correlation between real weather and game mechanics

## Technology Stack

### Frontend
**Choice**: React 18+ with TypeScript + Vite
**Styling**: Tailwind CSS + Framer Motion (animations)
**State Management**: Zustand (lightweight, simpler than Redux for this scope)
**Icons**: Lucide React (weather icons)

**Rationale**: React + TypeScript provides type safety for complex combat calculations. Vite offers fast dev experience. Tailwind enables rapid RPG-themed UI development. Framer Motion handles combat animations smoothly.

### Backend
**Choice**: Node.js + Express (TypeScript)
**API Design**: RESTful with clear endpoints
**Validation**: Zod for request/response validation
**Caching**: Node-cache (in-memory) for weather data

**Rationale**: Node.js enables code sharing between frontend/backend (shared types). Express is lightweight and well-documented. TypeScript ensures type safety across the stack.

### Weather API Integration
**Provider**: OpenWeatherMap Free Tier
**Limits**: 60 calls/minute, 1,000,000 calls/month
**Endpoints**: Current Weather Data API
**Data Points**: temp, humidity, pressure, wind_speed, clouds, weather condition, visibility

**Strategy**:
- Cache weather data for 10 minutes (weather doesn't change frequently)
- Batch validation before API calls
- Graceful degradation if API fails (use demo cities)

### Testing
**Unit Tests**: Vitest (fast, Vite-native)
**Integration Tests**: Supertest (API testing)
**E2E Tests**: Playwright (critical user flows)
**Coverage Target**: 80%+ for combat calculations

### DevOps
**Containerization**: Docker + Docker Compose
**Environment**: .env files for API keys
**Deployment**: Ready for Vercel (frontend) + Railway/Render (backend)

## Critical Architecture Recommendations

### 1. **Backend Proxy Pattern (MANDATORY)**
```
Frontend → /api/weather/:city → Backend → OpenWeatherMap API
```
- Prevents CORS issues
- Secures API key
- Enables caching and rate limiting
- Validates city names before external calls

### 2. **Shared Type System**
Create `/shared` directory with TypeScript interfaces:
```typescript
- WeatherData (raw API response)
- CombatAttributes (HP, Attack, Defense, etc.)
- CombatAction (attack types)
- BattleState (turn management)
```
Shared between frontend and backend for consistency.

### 3. **Deterministic Combat System**
- All combat calculations in backend (prevents cheating)
- Frontend sends action choice, backend computes results
- Random variance seeded server-side
- Combat log maintained server-side
- Frontend is presentation layer only

### 4. **Modular Component Architecture**
```
/frontend/src/
  /components/
    /CityCard - displays city + weather + stats
    /CombatArena - main battle view
    /HealthBar - animated HP display
    /CombatLog - scrolling battle events
    /ActionButtons - attack selection
    /WeatherTooltip - educational popups
```

### 5. **Educational Integration Strategy**
- Tooltip component with hover/click triggers
- Weather facts fetched from static JSON (no extra API)
- Stat conversion formulas visible on demand
- "Learn More" links to weather education resources
- Combat log explains damage calculations in plain language

## Main Challenges & Mitigations

### 1. **Challenge**: OpenWeatherMap CORS Restrictions
**Mitigation**:
- Implement backend proxy (Express endpoint)
- Cache responses (10-min TTL)
- Never call API directly from frontend
- Secure API key in backend .env

### 2. **Challenge**: Game Balance (Temperature Variance)
**Mitigation**:
- Normalize temperature ranges: (temp - (-40)) / (50 - (-40)) * 100
- Apply caps to prevent extreme values (HP capped at 200)
- Add 5-15% random variance to keep battles dynamic
- Playtest with diverse climate zones (Arctic, Tropical, Desert)

### 3. **Challenge**: Educational vs. Engagement Balance
**Mitigation**:
- Make tooltips optional (hover/click, not intrusive)
- Integrate facts during loading/transition states
- Visual stat displays (progress bars) more engaging than numbers
- "Quick Play" mode (skip educational content) vs "Learn Mode"

### 4. **Challenge**: Animation Performance
**Mitigation**:
- Use CSS transforms (GPU-accelerated) over position changes
- Framer Motion's `layoutId` for smooth transitions
- Debounce rapid state updates
- Lazy load combat effects
- Test on mid-range devices (not just high-end)

### 5. **Challenge**: Free Tier API Limits
**Mitigation**:
- 10-minute cache reduces calls by ~95%
- Validate city names before calling API
- Provide demo cities (pre-cached data) for testing
- Display rate limit status to users
- Fallback to cached/demo data if limit reached

## Weather-to-RPG Mapping System

### Attribute Formulas (Backend Logic)
```typescript
HP = Math.min(100 + (temp_celsius * 2), 200)
Attack = (wind_speed_ms * 5) + (pressure_hpa / 10)
Defense = humidity_percent + cloud_coverage_percent
Magic = base_magic[weather_condition] // Rain=30, Snow=40, Thunder=50, etc.
Speed = visibility_meters / 100
CritChance = (temp_variance * 2) + condition_severity // 10-20% range
```

### Elemental Type Mapping
- **Clear/Sunny** → Fire (high temp bonus)
- **Rainy** → Water (humidity bonus)
- **Snow** → Ice (low temp bonus)
- **Cloudy** → Wind (wind speed bonus)
- **Thunderstorm** → Lightning (critical hit bonus)
- **Fog/Mist** → Shadow (defense bonus)

### Elemental Advantages (Rock-Paper-Scissors)
```
Fire > Ice > Water > Fire
Lightning > Water
Wind > Lightning
```
Advantageous matchup = 1.5x damage multiplier

## Testing Approach

### Unit Tests (Vitest)
- Weather-to-stat conversion functions
- Combat damage calculations
- Elemental advantage logic
- Critical hit probability
- HP cap enforcement
- Edge cases (negative temps, extreme values)

### Integration Tests (Supertest)
- `/api/weather/:city` endpoint
- Weather data caching behavior
- Invalid city name handling
- API key validation
- Rate limiting
- Error responses

### E2E Tests (Playwright)
- Full battle flow (city selection → combat → winner)
- Mobile responsiveness
- Animation performance
- Tooltip interactions
- Battle replay functionality

### Manual Testing Checklist
- [ ] Test with cities in different climate zones
- [ ] Verify educational content accuracy
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Test with slow network (3G simulation)
- [ ] Validate visual effects on low-end devices

## Timeline Estimate

**Total Estimate**: 12-16 hours (spread over 3-4 days)

- **Setup & Architecture** (2h): Project scaffolding, Docker setup, shared types
- **Backend API** (3h): Express server, OpenWeatherMap proxy, caching, validation
- **Combat System Logic** (3h): Stat calculations, turn-based engine, elemental system
- **Frontend UI** (4h): City selection, combat arena, health bars, action buttons
- **Animations & Polish** (2h): Framer Motion effects, weather backgrounds
- **Educational Content** (1h): Tooltips, facts, explanations
- **Testing** (2h): Unit tests, integration tests, manual testing
- **Documentation** (1h): README, setup instructions, API documentation

## Project Structure

```
weather-combat-game/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── types/
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   └── types/
│       ├── weather.ts
│       ├── combat.ts
│       └── index.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## GitHub Deployment Readiness

Checking deployment environment...

- ✅ GitHub CLI (gh) installed: Available
- ✅ GitHub authentication: Ready
- ✅ Git user configured: Ready

**Deployment Status**: ✅ Ready for GitHub deployment

## Next Steps for Architect Phase

1. Design detailed API contract (request/response schemas)
2. Define complete component hierarchy with props
3. Specify animation timing and transitions
4. Design database schema if persistence needed (battle history)
5. Create wireframes for combat arena layout
6. Define error handling strategy (API failures, network issues)
7. Plan accessibility features (ARIA labels, keyboard shortcuts)
8. Design testing strategy per component/function

## Success Metrics

- [ ] Battle completes without errors
- [ ] Weather data fetches in < 1s
- [ ] Animations run at 60fps
- [ ] Educational tooltips render correctly
- [ ] Combat calculations match specifications
- [ ] Mobile UI is fully responsive
- [ ] Game is fun and educational (user feedback)

---

**Scout Phase Complete** ✅
Ready for Architect Phase to design detailed implementation plan.
