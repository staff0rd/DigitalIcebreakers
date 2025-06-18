# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Icebreakers is a real-time collaborative platform where presenters create lobbies and audience members join via QR codes. It's built with .NET 9 backend (C#, ASP.NET Core, SignalR) and React frontend (TypeScript, Vite).

## Key Concepts

### Architecture Pattern

- **Presenter-centric hub model**: Presenter creates a lobby, clients join via QR code
- **Real-time communication**: SignalR WebSocket connection between frontend and backend
- **Game system**: Each game has backend logic (C#) and frontend components (React/TypeScript)

### Lobby System

1. Presenter creates lobby → gets 4-character code
2. Clients scan QR code or enter code → join lobby
3. Presenter controls which activity/game is active
4. All clients see the same activity simultaneously

## Current Migration Status (Important!)

- **Frontend**: Recently migrated to Vite from older build system
- **E2E Tests**: Migrating from C# Playwright Sharp to TypeScript Playwright (see web/MIGRATION_PLAN.md)
- **MUI Styling**: Moving from makeStyles to sx props
- **Branch**: Currently on `vite` branch (not master)

## Important Directories

### Backend (.NET)

- `/DigitalIcebreakers/` - Main ASP.NET Core project
  - `Games/` - Server-side game logic
  - `Hubs/` - SignalR hub (GameHub.cs is central)
  - `ClientApp/` - OLD frontend location (deprecated)
- `/DigitalIcebreakers.Test/` - Unit tests (xUnit)

### Frontend (React/TypeScript)

- `/web/` - NEW frontend location (Vite-based)
  - `src/games/` - Client-side game implementations
  - `src/components/` - Shared React components
  - `src/store/` - Redux state management
  - `e2e/` - NEW Playwright tests (TypeScript)

## Common Development Commands

### Backend (.NET)

```bash
# Run backend (from root)
./run.sh
# OR
ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://0.0.0.0:5000 dotnet run -p DigitalIcebreakers

# Run with hot reload
dotnet watch run --project DigitalIcebreakers/DigitalIcebreakers.csproj

# Run tests
dotnet test
```

### Frontend (from /web directory)

```bash
# Development
npm run dev          # Start Vite dev server (port 5173)

# Building
npm run build        # TypeScript check + build
npm run check-types  # Type checking only

# Testing & Quality
npm run lint         # ESLint
npm run e2e          # Playwright E2E tests
```

## Available Games

1. **YesNoMaybe** - Simple voting game
2. **Buzzer** - Team-based buzzer system
3. **Splat** - Interactive canvas game
4. **Doggos Vs Kittehs** - Voting competition
5. **ReactionGame** - Reflex testing
6. **Pong** - Collaborative pong
7. **Broadcast** - Message sharing
8. **IdeaWall** - Collaborative brainstorming
9. **Poll** - Real-time polling
10. **FistOfFive** - Consensus voting
11. **PinPoint** - Location guessing
12. **StartStopContinue** - Retrospective tool
13. **NamePicker** - Random name selection

## How to Add a New Game

1. **Backend** (DigitalIcebreakers/Games/):

   - Create `NewGame.cs` implementing `IGame`
   - Handle messages between Presenter/Clients/System
   - Add to `GameHub.cs` registration

2. **Frontend** (web/src/games/):

   - Create folder with `NewGame.tsx`, `NewGamePresenter.tsx`, `NewGameClient.tsx`
   - Add to `allGames.ts`
   - Use pixi.js for graphics if needed

3. **Follow existing patterns** - Look at Buzzer or YesNoMaybe for examples

## State Management Pattern

- Redux store with SignalR middleware
- Actions dispatched from components
- SignalR middleware intercepts and sends to backend
- Backend broadcasts updates to all connected clients
- State updates flow: Component → Redux → SignalR → Backend → All Clients

## Common Pitfalls

1. **SignalR proxy**: Frontend dev server proxies `/gameHub` to backend port 5000
2. **Version mismatches**: Ensure .NET 9.0 SDK is installed
3. **Port conflicts**: Backend runs on 5000, frontend dev on 5173
4. **Game registration**: New games must be registered in backend and frontend
5. **Real-time testing**: Always test with multiple browser windows (Presenter + Clients)

## Code Style Guidelines

- **C#**: Follow standard .NET conventions
- **TypeScript**: ESLint configured, run `npm run lint`
- **React**: Functional components with hooks
- **Testing**: Page Object Model for E2E tests
- **No comments unless necessary**: Code should be self-documenting

## Testing Strategy

- **Unit tests**: xUnit for C# backend logic
- **E2E tests**: Playwright (TypeScript) for user journeys
- **Manual testing**: Always test presenter + multiple clients
- **Test data**: Use TestData classes for consistent test scenarios

## Current Tech Debt

1. E2E test migration incomplete
2. Some games need MUI styling updates
3. CI/CD scripts need updating for Vite
4. Documentation scattered between old and new structures

## Tips for AI Assistants

1. **Check both backend and frontend** when implementing features
2. **Use existing game patterns** - don't reinvent the wheel
3. **Test real-time features** with multiple browser windows
4. **Run type checking and linting** before considering task complete
5. **Follow the SignalR message flow** for debugging issues
6. **Remember the presenter controls everything** - clients are passive tho are able to interact with the game
