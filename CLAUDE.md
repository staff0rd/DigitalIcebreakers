# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Digital Icebreakers is a real-time interactive presentation platform where presenters create lobbies for audience participation through QR codes. The platform enables collaborative games and activities during presentations.

**Architecture**: React SPA with Firebase Realtime Database as the transport — there is no application server. The presenter's browser is the game-state authority: it aggregates player input, balances teams, and publishes results back to RTDB. Development and tests run entirely against the local Firebase emulator (requires Java).

## Development Commands

All commands run from `web/`:

```bash
npm install              # Install dependencies
npm run dev              # Start vite (port 5173) + firebase emulators (db 9000, auth 9099)
npm run build            # Build for production
npm run lint             # Run ESLint
npm run check-types      # Run TypeScript compiler check
npm test                 # Run Vitest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:rules       # Run database security-rules tests (spawns its own emulator on port 9100)
npm run e2e              # Run Playwright e2e tests (starts vite on 5273 + emulators)
npm run e2e:headed       # Run e2e tests headed
```

## Code Architecture

### Transport

- `web/src/store/transport/Transport.ts` — transport interface (lobby lifecycle, presence, game messages, state mirrors)
- `web/src/store/transport/FirebaseTransport.ts` — the only implementation: anonymous auth, collision-checked 4-char lobby codes, onDisconnect presence, per-lobby message channels, presenter/player state mirrors with replay cursors, idle-lobby sweep
- `web/src/store/transport/fakeFirebase.ts` — in-memory firebase fake used by transport unit tests (multiple clients, one database, no emulator)
- `web/src/store/jotai/transportAtoms.ts` — binds the transport to Jotai; `initializeTransport(store, transport)` is called from `App.tsx`

### RTDB data layout

- `lobbies/{code}` — `name`, `presenterId`, `presenterUid`, `currentGame`, `players/{playerId}`, `presenterState`, `playerState/{playerId}`, `messages/{toPresenter,toPlayers}`
- `playerLobbies/{playerId}` — `{code, uid}` index for refresh/rejoin
- `lobbyActivity/{code}` — timestamp, touched on create/newGame; lobbies idle >1h are swept when someone creates a lobby

Security rules live in `web/database.rules.json` (tests in `web/rules/database.rules.test.ts`): only the lobby creator (`presenterUid`) can write presenter-owned paths; players can only write their own player record, state, and `toPresenter` messages; anyone can delete a stale lobby.

### Game Architecture Pattern

Each game lives in `web/src/games/[GameName]/`:

- `[GameName]Client.tsx` — participant view (sends input, receives presenter updates)
- `[GameName]Presenter.tsx` — presenter view (owns game state, aggregates player messages)
- `[gameName]Atoms.ts` — Jotai atoms; register incoming message handling via `registerGame(name, atom, handler)`; presenter-side aggregation happens in these handlers

Games are registered in `web/src/games/Games.ts`.

### State Management

State management is **Jotai**.

- Game-specific atoms: `web/src/games/[gameName]/[gameName]Atoms.ts`
- Shared atoms (user, lobby, connection, shell): `web/src/store/atoms/`
- Transport atoms and game handler registry: `web/src/store/jotai/`

### Reconnect / late join

Presenter and player state mirror to RTDB as `{json, cursor}`; on rejoin the mirror is restored and the message log replays after the cursor, so presenter refresh keeps the lobby and late joiners see current game state.

## Testing Strategy

- **Unit tests**: Vitest, `*.test.ts(x)` alongside source; transport tests run against the in-memory fake
- **Rules tests**: `web/rules/`, run with `npm run test:rules` against a real database emulator
- **E2E tests**: Playwright specs in `web/e2e/` covering presenter + client workflows per game

> **Never change the e2e timeouts** (`--timeout`, `--global-timeout`, `--retries`, or the `timeout` in `playwright.config.ts`). Inflating them only masks misconfigured or genuinely-broken tests and burns time on runs that should have failed fast. If the suite doesn't fit, fix the test or the test environment (e.g. port/state isolation) — not the clock.

## Key Files

- `web/src/main.tsx` / `web/src/App.tsx` — app entry, transport initialization, routing
- `web/src/layout/` — shared layout components
- `web/firebase.json` — emulator config used by `npm run dev` and e2e
- `web/playwright.config.ts` — e2e web servers (vite on 5273 + emulators)

## Workflow

### TDD approach

All changes must follow a TDD approach. Every line of production code must be covered by a test (that first fails). Do not write production code or changes without first writing a (vi)test that requires that code.

### BDD only

Do not write unit tests or test implementation. All tests must test the behaviour of the application, not the internal implementation.

- Test component behavior (what users see and do)
- Test state changes through user interactions
- Test message handling through component behavior (use `initializeMockTransport` from `web/src/store/jotai/transportTestHelpers.ts` to simulate transport traffic)

**Testing atoms:**

- **Never test atoms directly** - test user interactions and observable outcomes; atoms are implementation detail
- **Write minimal atoms** - only the atoms needed to make the behavior tests pass

### Testing style

- Any test that has the word "when" in it is describing state, and that should instead be inside a `describe` block.
- Do not duplicate the same render or mock data creation over and over again. Instead create factory functions that set sensible defaults and pass optional, overridable `Partial<T>` to set relevant parameters.
