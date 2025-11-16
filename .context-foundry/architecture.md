# Architecture: Weather Combat Game

## System Overview

The Weather Combat Game is an educational web application that transforms real-time weather data into an RPG-style turn-based combat system. The architecture follows a client-server pattern with a mandatory backend proxy to handle OpenWeatherMap API calls, prevent CORS issues, and secure API credentials. The system features deterministic server-side combat calculations, shared TypeScript type definitions, and a reactive frontend with smooth animations.

**Core Flow**: User selects two cities → Backend fetches weather data → Weather metrics map to RPG attributes → Turn-based combat engine runs server-side → Frontend displays results with animations and educational content.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express 4+ with TypeScript
- **Validation**: Zod
- **Caching**: node-cache
- **HTTP Client**: axios
- **Testing**: Vitest + Supertest

### Shared
- **Language**: TypeScript 5+
- **Type Sharing**: Shared `/shared` directory with common types

### External APIs
- **Weather Provider**: OpenWeatherMap Free Tier
- **Endpoint**: Current Weather Data API (v2.5)
- **Rate Limits**: 60 calls/minute, 1,000,000/month

### DevOps
- **Containerization**: Docker + Docker Compose
- **Environment**: .env files
- **E2E Testing**: Playwright
- **Deployment Targets**: Vercel (frontend) + Railway/Render (backend)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Vite                            │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │ City       │  │   Combat     │  │  Educational │  │  │
│  │  │ Selection  │  │   Arena      │  │  Tooltips    │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │  │
│  │         │                │                 │          │  │
│  │         └────────────────┴─────────────────┘          │  │
│  │                          │                             │  │
│  │                   Zustand Store                        │  │
│  └──────────────────────────┼───────────────────────────┘  │
│                              │ Axios HTTP                   │
└──────────────────────────────┼──────────────────────────────┘
                               │
                    REST API (JSON)
                               │
┌──────────────────────────────┼──────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────┼───────────────────────────┐  │
│  │  Express + TypeScript    ▼                            │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │  /api/weather/:city (Proxy Endpoint)         │    │  │
│  │  └──────────────┬───────────────────────────────┘    │  │
│  │                 │                                      │  │
│  │  ┌──────────────▼───────────────┐  ┌──────────────┐  │  │
│  │  │  WeatherService              │  │  Cache       │  │  │
│  │  │  - Fetch from OpenWeatherMap │◄─┤  (10 min)   │  │  │
│  │  │  - Transform data            │  └──────────────┘  │  │
│  │  └──────────────┬───────────────┘                     │  │
│  │                 │                                      │  │
│  │  ┌──────────────▼───────────────┐                     │  │
│  │  │  CombatEngine                │                     │  │
│  │  │  - Convert weather → stats   │                     │  │
│  │  │  - Calculate damage          │                     │  │
│  │  │  - Determine winner          │                     │  │
│  │  └──────────────────────────────┘                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │ HTTPS                        │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  OpenWeatherMap API  │
                    │  (External Service)  │
                    └──────────────────────┘
```

### Design Patterns Applied

1. **Backend Proxy Pattern** (MANDATORY - Pattern ID: `cors-external-api-backend-proxy`)
   - Prevents CORS issues with OpenWeatherMap API
   - Secures API key server-side
   - Enables caching and rate limiting
   - Validates inputs before external calls

2. **Shared Type System**
   - Single source of truth for data contracts
   - Frontend and backend use identical TypeScript interfaces
   - Reduces bugs from mismatched data structures

3. **Service Layer Pattern**
   - Separation of concerns: routes → services → external APIs
   - Services are testable in isolation
   - Business logic encapsulated

4. **Repository/Cache Pattern**
   - In-memory cache with TTL (10 minutes)
   - Reduces API calls by ~95%
   - Cache invalidation strategy

5. **Command Pattern** (Combat Actions)
   - Each combat action encapsulated as command
   - Frontend sends action choice, backend executes
   - Prevents client-side cheating

## File Structure

```
weather-combat-game/
├── .context-foundry/
│   ├── scout-report.md
│   ├── architecture.md (this file)
│   └── current-phase.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CityCard.tsx
│   │   │   ├── CitySelector.tsx
│   │   │   ├── CombatArena.tsx
│   │   │   ├── HealthBar.tsx
│   │   │   ├── CombatLog.tsx
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── WeatherTooltip.tsx
│   │   │   ├── StatDisplay.tsx
│   │   │   ├── ElementalIcon.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useWeatherData.ts
│   │   │   ├── useCombat.ts
│   │   │   └── useAnimations.ts
│   │   ├── store/
│   │   │   └── battleStore.ts (Zustand)
│   │   ├── utils/
│   │   │   ├── api.ts (Axios instance)
│   │   │   ├── animations.ts
│   │   │   └── formatters.ts
│   │   ├── types/
│   │   │   └── index.ts (re-exports from shared)
│   │   ├── constants/
│   │   │   ├── weatherFacts.ts
│   │   │   └── educationalContent.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   └── weather-icons/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── weather.routes.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── weatherService.ts
│   │   │   ├── combatEngine.ts
│   │   │   └── cacheService.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validator.ts
│   │   ├── utils/
│   │   │   ├── weatherMapper.ts
│   │   │   └── logger.ts
│   │   ├── config/
│   │   │   └── env.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/
│   └── types/
│       ├── weather.ts
│       ├── combat.ts
│       ├── api.ts
│       └── index.ts
├── tests/
│   ├── unit/
│   │   ├── combatEngine.test.ts
│   │   ├── weatherMapper.test.ts
│   │   └── components/
│   ├── integration/
│   │   └── api.test.ts
│   └── e2e/
│       └── battle-flow.spec.ts
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── .env.example
├── .gitignore
├── package.json (root - workspace)
├── README.md
└── LICENSE
```

## Module Specifications

### Module: Frontend Application

**Responsibility**: User interface, animations, state management, API communication

**Key Files**:
- `App.tsx` - Main application component, routing logic
- `battleStore.ts` - Zustand store for combat state
- `components/` - All UI components

**Dependencies**:
- Shared types from `/shared`
- Backend API endpoints
- External: React, Tailwind, Framer Motion, Zustand

**Key Components**:

#### CitySelector
- Input fields for two city names
- Auto-complete suggestions (optional enhancement)
- Validation (non-empty, max length)
- "Start Battle" button
- Loading state during weather fetch

#### CityCard
- Displays city name, country, flag
- Real-time weather data (temp, humidity, conditions)
- Converted RPG stats (HP, Attack, Defense, Magic, Speed)
- Elemental type indicator
- Weather icon visualization

#### CombatArena
- Side-by-side city display
- Animated health bars
- Attack animations (hit effects, elemental bursts)
- Turn indicator
- Victory/defeat overlay

#### HealthBar
- Animated HP reduction/increase
- Color coding (green > yellow > red)
- Smooth Framer Motion transitions
- Numeric HP display (100/150)

#### CombatLog
- Scrolling event feed
- Turn-by-turn action descriptions
- Damage calculations explained
- Color-coded by event type (attack, critical, heal)
- Auto-scroll to latest event

#### ActionButtons
- 3 tactical options per turn:
  - **Attack**: Standard damage
  - **Heavy Attack**: High damage, lower accuracy
  - **Defend**: Reduce incoming damage next turn
- Disabled state during opponent's turn
- Hover tooltips explaining each action

#### WeatherTooltip
- Hover/click triggered overlays
- Explains weather metric → stat conversion
- Educational meteorological facts
- "Learn More" external links
- Accessible (keyboard navigable)

#### StatDisplay
- Visual progress bars for each stat
- Numeric values
- Comparison between two cities
- Elemental advantage indicators

### Module: Backend API

**Responsibility**: Weather data proxying, caching, combat calculations, business logic

**Key Files**:
- `server.ts` - Express app initialization
- `weather.routes.ts` - API route definitions
- `weatherService.ts` - OpenWeatherMap integration
- `combatEngine.ts` - Combat calculation logic

**Dependencies**:
- Shared types from `/shared`
- External: Express, axios, node-cache, Zod

**API Endpoints**:

#### GET `/api/weather/:city`
**Purpose**: Fetch weather data for a city (proxied from OpenWeatherMap)

**Request**:
```typescript
Params: { city: string }
```

**Response**:
```typescript
{
  city: string,
  country: string,
  weather: {
    temp: number,           // Celsius
    humidity: number,       // %
    pressure: number,       // hPa
    windSpeed: number,      // m/s
    clouds: number,         // %
    condition: string,      // "Clear", "Rain", etc.
    visibility: number,     // meters
    description: string     // "light rain"
  },
  stats: {
    hp: number,
    attack: number,
    defense: number,
    magic: number,
    speed: number,
    critChance: number
  },
  elementalType: "Fire" | "Water" | "Ice" | "Wind" | "Lightning" | "Shadow",
  timestamp: number
}
```

**Error Responses**:
- 400: Invalid city name
- 404: City not found
- 429: Rate limit exceeded
- 500: OpenWeatherMap API error

**Caching**: 10-minute TTL, keyed by city name (lowercase)

#### POST `/api/combat/simulate`
**Purpose**: Run full combat simulation between two cities

**Request**:
```typescript
{
  city1: string,
  city2: string
}
```

**Response**:
```typescript
{
  winner: string,
  loser: string,
  turns: Array<{
    turn: number,
    attacker: string,
    defender: string,
    action: "attack" | "heavy_attack" | "defend",
    damage: number,
    isCritical: boolean,
    attackerHpRemaining: number,
    defenderHpRemaining: number,
    description: string
  }>,
  finalStats: {
    city1Hp: number,
    city2Hp: number
  },
  battleDuration: number // milliseconds
}
```

### Module: Weather Service

**Responsibility**: Fetch and transform OpenWeatherMap API data

**Key Functions**:

#### `fetchWeatherData(city: string): Promise<WeatherData>`
- Validates city name (Zod schema)
- Checks cache first
- Calls OpenWeatherMap API if cache miss
- Transforms API response to internal format
- Stores in cache with 10-min TTL
- Throws typed errors (CityNotFoundError, APIError)

#### `transformApiResponse(raw: OpenWeatherApiResponse): WeatherData`
- Maps OpenWeatherMap fields to internal schema
- Converts Kelvin to Celsius
- Normalizes condition strings
- Validates data integrity

### Module: Combat Engine

**Responsibility**: Convert weather → stats, calculate combat outcomes

**Key Functions**:

#### `weatherToStats(weather: WeatherData): CombatStats`
Implements the weather-to-RPG conversion formulas:

```typescript
HP = Math.min(100 + (temp_celsius * 2), 200)
Attack = Math.round((windSpeed * 5) + (pressure / 10))
Defense = humidity + clouds
Magic = getBaseMagic(condition) // Rain=30, Snow=40, Thunder=50
Speed = Math.round(visibility / 100)
CritChance = Math.min(Math.max((tempVariance * 2) + conditionSeverity, 10), 20)
```

**Normalization**:
- Temperature range: -40°C to 50°C
- All stats capped at reasonable values (HP: 200, Attack: 100, etc.)
- 5-15% random variance applied

#### `determineElementalType(condition: string, temp: number): ElementalType`
Maps weather conditions to elements:
- Clear + temp > 25°C → Fire
- Rain → Water
- Snow → Ice
- Clouds + windSpeed > 10 m/s → Wind
- Thunderstorm → Lightning
- Fog/Mist → Shadow

#### `calculateDamage(attacker: CombatStats, defender: CombatStats, action: Action): DamageResult`
```typescript
baseDamage = attacker.attack - (defender.defense * 0.5)
elementalMultiplier = getElementalAdvantage(attacker.type, defender.type) // 1.0 or 1.5
critMultiplier = Math.random() < (attacker.critChance / 100) ? 2.0 : 1.0
actionMultiplier = action === "heavy_attack" ? 1.5 : 1.0
defenseMultiplier = defender.isDefending ? 0.5 : 1.0

finalDamage = Math.max(
  baseDamage * elementalMultiplier * critMultiplier * actionMultiplier * defenseMultiplier,
  5 // minimum damage
)
```

#### `simulateBattle(city1: CombatStats, city2: CombatStats): BattleResult`
- Turn-based loop (max 50 turns to prevent infinite battles)
- Alternating turns (randomly determined first striker)
- AI action selection (weighted random: 60% attack, 30% heavy, 10% defend)
- Tracks combat log for each turn
- Returns winner when HP ≤ 0

### Module: Cache Service

**Responsibility**: In-memory caching with TTL

**Implementation**: node-cache library

**Configuration**:
- TTL: 600 seconds (10 minutes)
- Check period: 120 seconds (cleanup interval)
- Max keys: 1000 (prevent memory overflow)

**Key Methods**:
- `get(key: string): T | undefined`
- `set(key: string, value: T, ttl?: number): void`
- `del(key: string): void`
- `flush(): void` (for testing)

### Module: Shared Types

**Responsibility**: Type definitions used by both frontend and backend

**Key Types** (`shared/types/`):

#### `weather.ts`
```typescript
export interface WeatherData {
  city: string;
  country: string;
  weather: {
    temp: number;          // Celsius
    humidity: number;      // 0-100
    pressure: number;      // hPa
    windSpeed: number;     // m/s
    clouds: number;        // 0-100
    condition: WeatherCondition;
    visibility: number;    // meters
    description: string;
  };
  timestamp: number;
}

export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog";
```

#### `combat.ts`
```typescript
export interface CombatStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  magic: number;
  speed: number;
  critChance: number;
  elementalType: ElementalType;
}

export type ElementalType =
  | "Fire"
  | "Water"
  | "Ice"
  | "Wind"
  | "Lightning"
  | "Shadow";

export type CombatAction = "attack" | "heavy_attack" | "defend";

export interface BattleTurn {
  turn: number;
  attacker: string;
  defender: string;
  action: CombatAction;
  damage: number;
  isCritical: boolean;
  attackerHpRemaining: number;
  defenderHpRemaining: number;
  description: string;
}

export interface BattleResult {
  winner: string;
  loser: string;
  turns: BattleTurn[];
  finalStats: {
    city1Hp: number;
    city2Hp: number;
  };
  battleDuration: number;
}
```

#### `api.ts`
```typescript
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface WeatherApiResponse {
  city: string;
  country: string;
  weather: WeatherData["weather"];
  stats: CombatStats;
  elementalType: ElementalType;
  timestamp: number;
}
```

## Data Models

### OpenWeatherMap API Response (External)
```json
{
  "coord": { "lon": -0.1257, "lat": 51.5085 },
  "weather": [
    {
      "id": 300,
      "main": "Drizzle",
      "description": "light intensity drizzle",
      "icon": "09d"
    }
  ],
  "main": {
    "temp": 280.32,
    "feels_like": 278.99,
    "temp_min": 279.15,
    "temp_max": 281.15,
    "pressure": 1012,
    "humidity": 81
  },
  "visibility": 10000,
  "wind": {
    "speed": 4.1,
    "deg": 80
  },
  "clouds": { "all": 90 },
  "dt": 1485789600,
  "sys": {
    "country": "GB"
  },
  "name": "London"
}
```

### Internal Weather Data Model
See `shared/types/weather.ts` above

### Combat State (Zustand Store)
```typescript
interface BattleStore {
  // City Data
  city1: WeatherApiResponse | null;
  city2: WeatherApiResponse | null;

  // Battle State
  battleInProgress: boolean;
  currentTurn: number;
  combatLog: BattleTurn[];
  winner: string | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWeatherData: (city1: string, city2: string) => Promise<void>;
  startBattle: () => void;
  executeAction: (action: CombatAction) => void;
  resetBattle: () => void;
}
```

## API Design

### Backend Environment Variables

**.env.example**:
```bash
# Server
PORT=3001
NODE_ENV=development

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cache
CACHE_TTL=600
CACHE_CHECK_PERIOD=120

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

**.env.example**:
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Weather Combat Game
```

### API Error Handling Strategy

**Error Types**:
1. **Validation Errors** (400): Invalid city name, missing fields
2. **Not Found** (404): City not found in OpenWeatherMap
3. **Rate Limiting** (429): API quota exceeded
4. **External API Errors** (502): OpenWeatherMap down/timeout
5. **Server Errors** (500): Unexpected backend errors

**Error Response Format**:
```typescript
{
  error: "ERROR_CODE",
  message: "Human-readable message",
  statusCode: 400,
  details?: any // Optional additional context
}
```

**Frontend Error Handling**:
- Toast notifications for user-facing errors
- Fallback to demo cities if API unavailable
- Retry logic with exponential backoff
- Graceful degradation (show cached data with warning)

## Applied Patterns & Preventive Measures

### ✅ Pattern: Backend Proxy for External APIs
**ID**: `cors-external-api-backend-proxy`
**Applied**: All OpenWeatherMap calls routed through `/api/weather/:city` endpoint
**Prevention**: Eliminates CORS issues, secures API keys, enables caching

### ✅ Pattern: Shared Type System
**Applied**: `/shared/types` directory with TypeScript interfaces
**Prevention**: Prevents type mismatches between frontend/backend, reduces runtime errors

### ✅ Pattern: Service Layer Separation
**Applied**: Routes → Services → External APIs
**Prevention**: Testable business logic, easier to mock dependencies

### ✅ Pattern: Input Validation
**Applied**: Zod schemas for all API inputs
**Prevention**: Prevents injection attacks, invalid data propagation

### ✅ Pattern: Caching with TTL
**Applied**: 10-minute cache for weather data
**Prevention**: Reduces API costs, improves performance, handles rate limits

### ✅ Pattern: Deterministic Server-Side Logic
**Applied**: Combat calculations on backend, frontend is presentation-only
**Prevention**: Prevents client-side cheating, ensures consistent game logic

### ⚠️ Risk: Game Balance (Temperature Variance)
**Mitigation Applied**:
- Temperature normalization: `(temp - (-40)) / 90 * 100`
- HP capped at 200
- All stats have max values
- 5-15% random variance for unpredictability
- Testing plan includes diverse climate zones

### ⚠️ Risk: Animation Performance
**Mitigation Applied**:
- CSS transforms (GPU-accelerated) instead of position changes
- Framer Motion's `layoutId` for smooth transitions
- Lazy loading of combat effects
- Performance testing on mid-range devices included in test plan

### ⚠️ Risk: API Rate Limits
**Mitigation Applied**:
- 10-minute cache reduces calls by ~95%
- Input validation before API calls
- Demo cities (pre-cached) for testing
- Rate limit status displayed to users
- Graceful degradation to cached data

### ⚠️ Risk: Educational Content Balance
**Mitigation Applied**:
- Tooltips optional (hover/click, not intrusive)
- Facts during loading transitions
- "Quick Play" vs "Learn Mode" options
- Visual stat displays (progress bars) more engaging

## Implementation Steps

### Phase 1: Project Setup (2 hours)
1. Initialize monorepo with root `package.json`
2. Create `/frontend` with Vite + React + TypeScript
3. Create `/backend` with Express + TypeScript
4. Create `/shared` with type definitions
5. Configure TypeScript path aliases (`@shared`, `@components`, etc.)
6. Set up Docker Compose (frontend, backend, networks)
7. Create `.env.example` files
8. Initialize Git repository with `.gitignore`
9. Set up ESLint + Prettier

### Phase 2: Backend Foundation (3 hours)
1. Create Express server with CORS middleware
2. Implement `/api/weather/:city` endpoint
3. Integrate OpenWeatherMap API with axios
4. Implement cache service with node-cache
5. Add Zod validation schemas
6. Implement error handling middleware
7. Create logger utility
8. Write unit tests for weather service

### Phase 3: Combat Engine (3 hours)
1. Implement `weatherToStats()` conversion logic
2. Implement `determineElementalType()` mapping
3. Implement `calculateDamage()` with all multipliers
4. Implement `simulateBattle()` turn-based engine
5. Create `/api/combat/simulate` endpoint
6. Write comprehensive unit tests for all formulas
7. Test edge cases (negative temps, extreme values)
8. Validate game balance with sample data

### Phase 4: Frontend UI Foundation (2 hours)
1. Set up Tailwind CSS configuration
2. Create Zustand battle store
3. Implement CitySelector component
4. Implement LoadingSpinner component
5. Create axios API client with error handling
6. Implement useWeatherData hook
7. Create basic App.tsx routing logic

### Phase 5: Combat UI (2 hours)
1. Implement CityCard component with weather display
2. Implement HealthBar with animations
3. Implement CombatArena layout
4. Implement ActionButtons with hover states
5. Implement CombatLog scrolling feed
6. Implement StatDisplay with progress bars
7. Add ElementalIcon component

### Phase 6: Animations & Polish (2 hours)
1. Add Framer Motion to health bar updates
2. Implement attack hit animations
3. Add elemental burst effects
4. Create victory/defeat overlay
5. Add weather-themed backgrounds
6. Implement smooth transitions between states
7. Performance testing and optimization

### Phase 7: Educational Content (1 hour)
1. Create `weatherFacts.ts` with educational content
2. Implement WeatherTooltip component
3. Add stat conversion explanations
4. Create "Learn More" external links
5. Add accessibility (ARIA labels, keyboard navigation)
6. Add meteorological term definitions

### Phase 8: Testing (2 hours)
1. Write unit tests for combat calculations
2. Write integration tests for API endpoints
3. Write component tests with React Testing Library
4. Create E2E test for full battle flow (Playwright)
5. Test responsive design on mobile
6. Accessibility audit (keyboard, screen readers)
7. Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Phase 9: Documentation (1 hour)
1. Write comprehensive README.md
   - Setup instructions
   - Environment variables
   - Running locally with Docker
   - API documentation
   - Game mechanics explanation
2. Add code comments to complex logic
3. Create API documentation (endpoints, schemas)
4. Document deployment process
5. Add contributing guidelines

## Testing Requirements

### Unit Tests (Vitest)

#### Backend (`backend/src/**/*.test.ts`)

**Weather Service**:
- ✅ `fetchWeatherData()` returns cached data when available
- ✅ `fetchWeatherData()` calls OpenWeatherMap API on cache miss
- ✅ `fetchWeatherData()` throws CityNotFoundError for invalid city
- ✅ `transformApiResponse()` converts Kelvin to Celsius correctly
- ✅ `transformApiResponse()` normalizes weather conditions

**Combat Engine**:
- ✅ `weatherToStats()` calculates HP correctly (formula validation)
- ✅ `weatherToStats()` calculates Attack from wind + pressure
- ✅ `weatherToStats()` calculates Defense from humidity + clouds
- ✅ `weatherToStats()` assigns Magic based on weather condition
- ✅ `weatherToStats()` calculates Speed from visibility
- ✅ `weatherToStats()` caps HP at 200 (max value test)
- ✅ `weatherToStats()` handles negative temperatures correctly
- ✅ `determineElementalType()` maps Clear + high temp → Fire
- ✅ `determineElementalType()` maps Rain → Water
- ✅ `determineElementalType()` maps Snow → Ice
- ✅ `calculateDamage()` applies elemental advantage (1.5x multiplier)
- ✅ `calculateDamage()` applies critical hit (2x multiplier)
- ✅ `calculateDamage()` applies heavy attack (1.5x multiplier)
- ✅ `calculateDamage()` applies defend stance (0.5x damage reduction)
- ✅ `calculateDamage()` enforces minimum damage (5)
- ✅ `simulateBattle()` alternates turns correctly
- ✅ `simulateBattle()` ends when HP ≤ 0
- ✅ `simulateBattle()` prevents infinite battles (max 50 turns)

**Cache Service**:
- ✅ `get()` returns undefined for non-existent key
- ✅ `set()` stores value with TTL
- ✅ `get()` returns stored value within TTL
- ✅ `get()` returns undefined after TTL expires
- ✅ `flush()` clears all cached data

#### Frontend (`frontend/src/**/*.test.tsx`)

**Components**:
- ✅ CitySelector renders input fields
- ✅ CitySelector validates non-empty city names
- ✅ CitySelector shows loading state during fetch
- ✅ HealthBar displays current/max HP correctly
- ✅ HealthBar animates HP changes
- ✅ HealthBar changes color based on HP percentage
- ✅ CombatLog renders battle events in order
- ✅ CombatLog auto-scrolls to latest event
- ✅ ActionButtons disables during opponent turn
- ✅ WeatherTooltip shows on hover/click
- ✅ StatDisplay shows progress bars for all stats

**Hooks**:
- ✅ `useWeatherData()` fetches data from API
- ✅ `useWeatherData()` handles errors gracefully
- ✅ `useCombat()` manages battle state correctly

### Integration Tests (Supertest)

**API Endpoints** (`tests/integration/api.test.ts`):
- ✅ `GET /api/weather/:city` returns 200 with valid city
- ✅ `GET /api/weather/:city` returns 400 with empty city name
- ✅ `GET /api/weather/:city` returns 404 with non-existent city
- ✅ `GET /api/weather/:city` uses cache on second request (same city)
- ✅ `GET /api/weather/:city` includes all required fields in response
- ✅ `POST /api/combat/simulate` returns battle result
- ✅ `POST /api/combat/simulate` validates request body schema
- ✅ Error responses follow standard format (error, message, statusCode)

**Caching Behavior**:
- ✅ First request fetches from OpenWeatherMap
- ✅ Second request within 10 min returns cached data
- ✅ Request after 10 min fetches fresh data

**Error Handling**:
- ✅ 500 error when OpenWeatherMap API is down (mocked)
- ✅ 429 error when rate limit exceeded (mocked)
- ✅ Error middleware catches unhandled errors

### E2E Tests (Playwright)

**Full Battle Flow** (`tests/e2e/battle-flow.spec.ts`):
- ✅ User enters two city names
- ✅ User clicks "Start Battle"
- ✅ Weather data displays for both cities
- ✅ Battle begins with turn 1
- ✅ User selects attack action
- ✅ Combat log shows damage calculation
- ✅ Health bars update with animation
- ✅ Battle continues until winner declared
- ✅ Victory overlay displays winner

**Responsive Design**:
- ✅ Mobile viewport (375x667): all elements visible
- ✅ Tablet viewport (768x1024): layout adapts correctly
- ✅ Desktop viewport (1920x1080): optimal spacing

**Accessibility**:
- ✅ Keyboard navigation: Tab through all interactive elements
- ✅ Enter key triggers "Start Battle" button
- ✅ Screen reader: ARIA labels present on all buttons
- ✅ Focus indicators visible

**Animations**:
- ✅ Health bar reduction animates smoothly (no jank)
- ✅ Attack effects appear on action selection
- ✅ Page maintains 60fps during combat (FPS counter)

### Manual Testing Checklist

**Climate Zone Testing**:
- [ ] Test Arctic cities (Reykjavik, Anchorage) - Ice element
- [ ] Test Tropical cities (Singapore, Mumbai) - Fire element
- [ ] Test Desert cities (Phoenix, Dubai) - Fire/Wind element
- [ ] Test Rainy cities (Seattle, London) - Water element
- [ ] Test High-altitude cities (Denver, La Paz) - unique stats
- [ ] Verify game balance: no climate zone dominates

**Educational Content Accuracy**:
- [ ] Tooltip explanations are meteorologically accurate
- [ ] Weather facts are sourced correctly
- [ ] Stat conversion formulas match documentation
- [ ] External links lead to reputable sources (NOAA, Met Office)

**Accessibility (WCAG 2.1 AA)**:
- [ ] Color contrast ratios ≥ 4.5:1 for text
- [ ] Keyboard navigation works for all interactions
- [ ] Screen reader announces all state changes
- [ ] Focus indicators visible on all focusable elements
- [ ] No text in images (or alt text provided)

**Network Conditions**:
- [ ] Test on 3G (slow network simulation)
- [ ] Verify loading states appear correctly
- [ ] Test offline behavior (graceful error messages)
- [ ] Test during OpenWeatherMap downtime (fallback to demo)

**Device Testing**:
- [ ] iPhone 12 (iOS Safari)
- [ ] Samsung Galaxy S21 (Chrome Android)
- [ ] iPad Pro (Safari)
- [ ] MacBook Pro (Chrome, Firefox, Safari, Edge)
- [ ] Windows PC (Chrome, Firefox, Edge)

**How to Run Tests**:

```bash
# Unit tests (backend)
cd backend
npm run test

# Unit tests (frontend)
cd frontend
npm run test

# Integration tests
cd backend
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:all

# Watch mode (development)
npm run test:watch
```

**Success Criteria**:
- All unit tests pass (100%)
- All integration tests pass (100%)
- All E2E tests pass (100%)
- Code coverage ≥ 80% for critical paths (combat engine, weather service)
- No console errors in browser
- Lighthouse score: Performance ≥ 90, Accessibility ≥ 95

## Success Criteria

### Functional Requirements
- ✅ User can select two cities and initiate battle
- ✅ Weather data fetches in < 1 second (with caching)
- ✅ Weather metrics correctly convert to RPG stats (all formulas tested)
- ✅ Turn-based combat executes correctly with 3 action options
- ✅ Elemental type system applies advantages (1.5x damage)
- ✅ Combat log displays all battle events with explanations
- ✅ Battle completes with winner/loser declared
- ✅ Educational tooltips render with accurate content

### Non-Functional Requirements
- ✅ Responsive design works on mobile (375px) to desktop (1920px)
- ✅ Animations run at 60fps (validated with Playwright FPS counter)
- ✅ Initial load time < 3 seconds (Lighthouse Performance ≥ 90)
- ✅ Accessible (WCAG 2.1 AA compliance, Lighthouse Accessibility ≥ 95)
- ✅ Cross-browser compatible (Chrome, Firefox, Safari, Edge)

### Technical Requirements
- ✅ Backend proxy prevents CORS issues (no direct API calls from frontend)
- ✅ API key secured in backend .env (never exposed to frontend)
- ✅ Cache reduces API calls by ≥ 95% (validated in integration tests)
- ✅ All TypeScript with no `any` types (strict mode enabled)
- ✅ Test coverage ≥ 80% for combat engine and weather service
- ✅ Docker Compose successfully runs both frontend and backend

### Educational Requirements
- ✅ Real weather data displayed alongside game stats
- ✅ Stat conversion formulas explained in tooltips
- ✅ Meteorological terms defined accurately
- ✅ Weather facts display during transitions
- ✅ Visual correlation between weather and game mechanics clear

### Deployment Readiness
- ✅ README with setup instructions complete
- ✅ `.env.example` files provided for both frontend and backend
- ✅ Docker Compose configuration working
- ✅ Environment variables documented
- ✅ API documentation complete (endpoints, schemas)
- ✅ No hardcoded API keys or secrets in code
- ✅ GitHub repository ready for deployment

### Definition of Done
A battle is considered complete when:
1. Two valid cities are fetched from OpenWeatherMap
2. Weather data converts to RPG stats using documented formulas
3. Turn-based combat executes with player action selection
4. Health bars update smoothly with each attack
5. Combat log records all events with damage calculations
6. Winner is declared when one city reaches 0 HP
7. Educational tooltips explain all weather-to-stat conversions
8. All tests pass (unit, integration, E2E)
9. No console errors in browser
10. Performance and accessibility requirements met

---

**Architecture Document Complete** ✅

This architecture provides a complete blueprint for the Builder phase. The system follows proven patterns (backend proxy, shared types, service layer), includes preventive measures for known risks (CORS, game balance, rate limits), and specifies comprehensive testing requirements with clear success criteria.

**Ready for Builder Phase** → Implement according to this specification with context-efficient, step-by-step execution.
