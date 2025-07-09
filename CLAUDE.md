# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Icebreakers is a real-time interactive presentation platform where presenters create lobbies for audience participation through QR codes. The platform enables collaborative games and activities during presentations.

**Architecture**: Full-stack web application with ASP.NET Core backend and React frontend, using SignalR for real-time communication.

## Development Commands

### Frontend (React + Vite)

```bash
cd web
npm install              # Install dependencies
npm run dev             # Start dev server (port 3000)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run typecheck       # Run TypeScript compiler check
npm test                # Run Vitest unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run Playwright e2e tests
npm run test:e2e:ui     # Run e2e tests with UI
```

### Backend (.NET Core)

```bash
cd DigitalIcebreakers
dotnet run              # Start backend server (port 5000)
dotnet build            # Build the project
dotnet test             # Run unit tests
```

### Combined Development

```bash
npm run dev:all         # Run both frontend and backend concurrently
```

## Code Architecture

### Real-time Communication

- **SignalR Hub**: `/DigitalIcebreakers/Hubs/GameHub.cs` - Central hub for all real-time communication
- **Connection Management**: Handles presenter-participant connections and lobby management
- **Message Flow**: Presenter actions → SignalR → All participants in lobby

### Game Architecture Pattern

Each game follows a consistent pattern:

**Backend** (`/DigitalIcebreakers/Games/[GameName]/`):

- `[GameName]GameHub.cs` - SignalR message handlers and game logic
- Domain models for game state and player data

**Frontend** (`/web/src/games/[gameName]/`):

- `GameClient.tsx` - Participant view (receives updates, sends responses)
- `GamePresenter.tsx` - Presenter control interface (initiates actions, sees results)
- State management (Redux/Jotai atoms)

### State Management Migration (Critical)

**Currently migrating from Redux to Jotai** using strangler fig pattern:

**Completed migrations**: YesNoMaybe, Broadcast, NamePicker, Buzzer, DoggosVsKittehs, FistOfFive, Splat, Pong

**Migration pattern**:

1. Create Jotai atoms alongside existing Redux state
2. Gradually convert components to use atoms
3. Remove Redux slice once fully migrated
4. See `/web/REDUX_TO_JOTAI_MIGRATION.md` for detailed plan

**Key atoms locations**:

- Game-specific atoms: `/web/src/games/[gameName]/atoms.ts`
- Shared atoms: `/web/src/store/atoms/`

### Core Domain Models

- **Lobby**: Central concept - each presentation session
- **Player**: Participant in a lobby
- **Game**: Specific activity within a lobby
- **SignalR Groups**: Used for lobby-based message broadcasting

### Frontend Structure

- **Components**: Material-UI based, organized by feature
- **Layout**: Consistent presenter/client layout patterns
- **Real-time**: SignalR connection managed at app level, passed to games
- **Routing**: React Router for navigation between games and views

### Backend Structure

- **Hub-based**: All real-time logic in SignalR hubs
- **Dependency Injection**: Services registered in Program.cs
- **Logging**: Structured logging with Serilog
- **Data Access**: Dapper for database operations (PostgreSQL)

## Testing Strategy

### Frontend Tests

- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright covering full game workflows
- **Test Files**: `*.test.tsx` for unit tests, `/web/src/e2e/` for e2e tests

### Backend Tests

- **Unit Tests**: Located in `/DigitalIcebreakers.Test/`
- **Integration Tests**: Test SignalR hubs and database interactions

### Running Tests

Always run tests after changes:

```bash
npm run test           # Frontend unit tests
npm run test:e2e       # Frontend e2e tests
dotnet test            # Backend tests
```

## Development Guidelines

### Adding New Games

1. Create backend hub in `/DigitalIcebreakers/Games/[GameName]/`
2. Register hub in `Program.cs`
3. Create frontend components in `/web/src/games/[gameName]/`
4. Use Jotai atoms for state management (not Redux)
5. Follow existing game patterns for SignalR communication
6. Add e2e tests covering presenter and client workflows

### SignalR Communication

- **Presenter → Hub**: Actions like starting games, advancing states
- **Hub → Participants**: State updates, game events
- **Participants → Hub**: Responses, votes, inputs
- **Groups**: Use lobby-based SignalR groups for targeted messaging

### State Management Rules

- **New code**: Use Jotai atoms exclusively
- **Existing Redux code**: Migrate gradually when touching files
- **Avoid**: Adding new Redux slices or reducers

## Key Files to Understand

### Backend Entry Points

- `/DigitalIcebreakers/Program.cs` - App configuration and DI setup
- `/DigitalIcebreakers/Hubs/GameHub.cs` - Main SignalR hub

### Frontend Entry Points

- `/web/src/main.tsx` - App entry point
- `/web/src/App.tsx` - Main app component with routing
- `/web/src/layout/` - Shared layout components

### Configuration

- `/web/vite.config.ts` - Frontend build configuration with SignalR proxy
- `/DigitalIcebreakers/appsettings.json` - Backend configuration

## Workflow

### TDD approach

All changes must follow a TDD approach. Every line of production code must be covered by a test (that first fails). Do not write production code or changes without first writing a (vi)test that requires that code.

**For Redux-to-Jotai migrations specifically:**
1. **Test existing behavior first** - Write BDD tests that verify the current Redux behavior works
2. **Convert tests to expect Jotai behavior** - Same behavior, different state management approach
3. **Make tests pass with minimal atoms** - Only write the atoms needed to make the behavior tests pass
4. **Never test atoms directly** - Test user interactions and observable outcomes

### BDD only

Do not write unit tests or test implementation. All tests must test the behaviour of the application, not the internal implementation.

**Migration testing focus:**
- Test component behavior (what users see and do)
- Test state changes through user interactions
- Test message handling through component behavior
- Never test atoms, reducers, or internal state directly

### Testing style

- Any test that has the word "when" in it is describing state, and that should instead be inside a `describe` block.
- Do not duplicate the same render or mock data creation over and over again. Instead create factory functions that set sensible defaults and pass optional, overridable `Partial<T>` to set relevant parameters.
