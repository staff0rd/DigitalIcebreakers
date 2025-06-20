# Redux to Jotai Migration Plan

## Overview

Complete migration from Redux to Jotai, removing all Redux dependencies while maintaining SignalR real-time functionality.

**Prerequisites**: Before proceeding with any migration steps, execute `npm run check-types` to ensure there are no type errors in the codebase.

## Migration Strategy

### Phase 1: Setup & Infrastructure

- [ ] Install Jotai (`npm install jotai`)
- [ ] Create Jotai provider wrapper component
- [ ] Create SignalR integration for Jotai (replacing middleware)
- [ ] Create test utilities for Jotai atoms
- [ ] Set up migration testing framework

### Phase 2: Core State Migration (Order matters!)

#### 1. Connection State (Simplest, no dependencies)

- [ ] Create connection atoms (status atom)
- [ ] Create connection hooks
- [ ] Write tests comparing Redux vs Jotai behavior
- [ ] Replace all `useSelector(state => state.connection)` calls
- [ ] Remove connection reducer
- [ ] Verify SignalR connection management works

#### 2. User State (Simple, no dependencies)

- [ ] Create user atoms (id, name, isRegistered)
- [ ] Create user hooks and actions
- [ ] Write migration tests
- [ ] Replace all `useSelector(state => state.user)` calls
- [ ] Remove user reducer
- [ ] Test registration flow

#### 3. Shell State (UI state, depends on user/lobby)

- [ ] Create shell atoms (version, menuItems, showMenu, showDrawer)
- [ ] Create navigation atoms and hooks
- [ ] Write migration tests
- [ ] Replace all `useSelector(state => state.shell)` calls
- [ ] Migrate navigation middleware to Jotai
- [ ] Remove shell reducer
- [ ] Test navigation flows

#### 4. Lobby State (Complex, central to app)

- [ ] Create lobby atoms (id, name, isPresenter, players, currentGame, joiningLobbyId)
- [ ] Create derived atoms for lobby state
- [ ] Implement SignalR event handlers for Jotai
- [ ] Write comprehensive migration tests
- [ ] Replace all `useSelector(state => state.lobby)` calls
- [ ] Remove lobby reducer
- [ ] Test presenter/player flows

### Phase 3: SignalR Middleware Replacement

- [ ] Create Jotai-based SignalR manager
- [ ] Implement connection lifecycle management
- [ ] Port reconnection logic with exponential backoff
- [ ] Implement hub method invocations
- [ ] Port all SignalR event listeners
- [ ] Create game message routing system
- [ ] Test real-time synchronization
- [ ] Remove SignalR middleware

### Phase 4: Game Migration (Simple → Complex)

#### Simple Games

- [ ] YesNoMaybe - Create atoms, migrate component, test
- [ ] Broadcast - Create atoms, migrate component, test
- [ ] NamePicker - Create atoms, migrate component, test
- [ ] Buzzer - Create atoms, migrate component, test

#### Medium Complexity Games

- [ ] DoggosVsKittehs - Create atoms, migrate component, test
- [ ] FistOfFive - Create atoms, migrate component, test
- [ ] Splat - Create atoms, migrate component, test
- [ ] Pong - Create atoms, migrate component, test
- [ ] Reaction - Create atoms, migrate component, test

#### Complex Games

- [ ] IdeaWall - Create atoms, handle localStorage, migrate components, test
- [ ] Poll - Create presenter/player atoms, migrate components, test
- [ ] Retrospective - Create category atoms, migrate components, test
- [ ] Trivia - Create question/score atoms, migrate components, test

### Phase 5: Cleanup

- [ ] Remove Redux store configuration
- [ ] Remove all Redux imports
- [ ] Remove Redux DevTools integration
- [ ] Remove Redux dependencies from package.json
- [ ] Remove all reducer files
- [ ] Remove all Redux action files
- [ ] Remove all Redux type files
- [ ] Update documentation

## Implementation Details

### SignalR Integration Pattern

```typescript
// Instead of Redux middleware, use Jotai atoms with effects
const connectionAtom = atom<HubConnection | null>(null);
const lobbyAtom = atom<LobbyState>({...});

// SignalR event handling
const signalREffectAtom = atom(
  (get) => get(connectionAtom),
  (get, set, connection: HubConnection) => {
    connection.on('joined', (user) => {
      set(lobbyAtom, (prev) => ({
        ...prev,
        players: [...prev.players, user]
      }));
    });
    // ... other event handlers
  }
);
```

### Testing Strategy

1. For each reducer migration:
   - Create parallel Redux/Jotai implementations
   - Write tests that verify identical behavior
   - Use feature flags to switch between implementations
   - Manual testing with presenter + multiple clients

### Rollback Strategy

- Keep Redux code in feature branches
- Use feature flags to toggle between Redux/Jotai
- Maintain backwards compatibility during migration

## Success Criteria

- All Redux dependencies removed
- All tests passing
- Real-time synchronization working
- No performance regressions
- Clean separation of concerns with Jotai atoms

## Estimated Timeline

- Phase 1: 1 day
- Phase 2: 3-4 days
- Phase 3: 2-3 days
- Phase 4: 5-7 days
- Phase 5: 1 day
- **Total: 12-16 days**

## Progress Tracking

Last updated: 2025-06-20

### Current Status

Starting Phase 1: Setup & Infrastructure

### Notes

- Migration is being done incrementally to ensure stability
- Each phase should be tested thoroughly before moving to the next
- Manual testing with multiple browser windows is essential for real-time features
