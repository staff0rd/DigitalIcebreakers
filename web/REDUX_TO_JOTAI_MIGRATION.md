# Redux to Jotai Migration Plan - Strangler Fig Approach

## Overview

Incrementally migrate from Redux to Jotai using a strangler-fig pattern. Each migration step will be small, complete, and verifiable before moving to the next.

**Prerequisites**: Before each migration step, execute `npm run check-types` to ensure no type errors.

**Important**: Maintain strict TypeScript typing. Never use `any` type - use proper types or `unknown` when the type is genuinely unknown.

## Migration Strategy

### Approach

1. Start with the simplest, most isolated game reducers
2. For each migration:
   - Install Jotai if not already installed
   - Create atoms to replace the reducer
   - Update components to use Jotai atoms instead of Redux
   - Verify with e2e tests, add new tests if necessary
   - Remove the Redux reducer
   - Write any approach modifications or lessons learned in this document - only do this if it will affect future migration steps
   - Update the checkboxes in this document to reflect the completed migration step
   - Pause for feedback from the team - wait for approval before proceeding to the next step
   - Write a commit message summarizing the change

### Migration Order (Subject to Change)

#### Phase 1: Simple Games (No external dependencies)

1. **YesNoMaybe** - Simplest game, just vote counts

   - [x] Install Jotai and add provider to App.tsx
   - [x] Create YesNoMaybe atoms
   - [x] Update YesNoMaybeClient and YesNoMaybePresenter to use atoms
   - [x] Run e2e tests
   - [x] Remove YesNoMaybeReducer
   - [x] Remove from games reducer

2. **Broadcast** - Simple message state

   - [x] Create Broadcast atoms
   - [x] Update BroadcastClient and BroadcastPresenter
   - [x] Run e2e tests (broadcast.spec.ts)
   - [x] Remove BroadcastReducer
   - [x] Remove from games reducer

3. **NamePicker** - Array of names

   - [x] Create NamePicker atoms
   - [x] Update components
   - [x] Test functionality
   - [x] Remove NamePickerReducer

4. **Buzzer** - Player array
   - [ ] Create Buzzer atoms
   - [ ] Update components
   - [ ] Test functionality
   - [ ] Remove BuzzerReducer

#### Phase 2: Medium Complexity Games

5. **DoggosVsKittehs** - Vote counts with images

   - [ ] Create atoms
   - [ ] Migrate components
   - [ ] Test and remove reducer

6. **FistOfFive** - Response tracking

   - [ ] Create atoms
   - [ ] Migrate components
   - [ ] Run e2e tests (fist-of-five.spec.ts)
   - [ ] Remove reducer

7. **Splat** - Canvas interactions

   - [ ] Create atoms
   - [ ] Migrate components
   - [ ] Test and remove reducer

8. **Pong** - Team assignments

   - [ ] Create atoms
   - [ ] Migrate components
   - [ ] Run e2e tests (pong.spec.ts)
   - [ ] Remove reducer

9. **Reaction** - Shape tracking
   - [ ] Create atoms
   - [ ] Migrate components
   - [ ] Test and remove reducer

#### Phase 3: Complex Games

10. **IdeaWall** - Ideas with localStorage

    - [ ] Create atoms with localStorage sync
    - [ ] Migrate components
    - [ ] Test persistence
    - [ ] Remove reducer

11. **Poll** - Questions and responses

    - [ ] Create atoms for questions/responses
    - [ ] Migrate presenter and client views
    - [ ] Test functionality
    - [ ] Remove reducer

12. **Retrospective** - Categories and ideas

    - [ ] Create atoms
    - [ ] Migrate components
    - [ ] Run e2e tests (retrospective.spec.ts)
    - [ ] Remove reducer

13. **Trivia** - Questions, scores, and state
    - [ ] Create atoms
    - [ ] Migrate components
    - [ ] Run e2e tests (trivia/\*.spec.ts)
    - [ ] Remove reducer

#### Phase 4: Core App State

14. **User State** - id, name, isRegistered

    - [ ] Create user atoms
    - [ ] Update all components using user state
    - [ ] Test registration flow
    - [ ] Remove user reducer

15. **Shell State** - UI state, navigation

    - [ ] Create shell atoms
    - [ ] Update navigation components
    - [ ] Test navigation
    - [ ] Remove shell reducer

16. **Connection State** - connection status

    - [ ] Create connection atoms
    - [ ] Update connection-dependent components
    - [ ] Test connection states
    - [ ] Remove connection reducer

17. **Lobby State** - lobby info, players, current game
    - [ ] Create lobby atoms
    - [ ] Update lobby components
    - [ ] Test lobby functionality
    - [ ] Remove lobby reducer

#### Phase 5: SignalR Migration

18. **SignalR Middleware**
    - [ ] Create Jotai-based SignalR handling
    - [ ] Migrate message routing
    - [ ] Test real-time sync
    - [ ] Remove Redux middleware

#### Phase 6: Cleanup

19. **Final Cleanup**
    - [ ] Remove Redux store configuration
    - [ ] Remove Redux dependencies from package.json
    - [ ] Remove all Redux-related files
    - [ ] Update documentation

## Verification Strategy

For each migration:

1. Run `npm run check-types`
2. Run relevant e2e tests: `npm run e2e -- <test-file>`
3. Manual testing with presenter + player windows
4. Add React Testing Library tests if e2e coverage is insufficient

## Success Criteria

- Each migration step leaves the app fully functional
- All existing tests continue to pass
- No TypeScript errors
- Real-time functionality maintained

## Game Message Handler Registration Pattern

When migrating a game to Jotai, each game must register itself with the SignalR middleware. This keeps the middleware game-agnostic while allowing each game to handle its own message processing.

### Registration Steps

1. **Create your Jotai atom** with the game state interface
2. **Define a message handler function** that processes incoming SignalR messages
3. **Register the game** using the `registerGame()` function
4. **Remove the Redux reducer** after successful migration

### Message Handler Function

The message handler receives:
- `currentState`: The current state from the atom
- `message`: The incoming message from SignalR
- `isPresenter`: Boolean indicating if this is the presenter

It should return the new state for the atom.

### Implementation Examples

- **Simple state replacement**: See `yesNoMaybeAtoms.ts` - the handler simply returns the incoming message as the new state
- **Conditional updates**: See `broadcastAtoms.ts` - the handler has different logic for presenter (increment dings) vs client (update text)

### File References

- Registration pattern: `src/store/jotai/gameMessageHandlers.ts`
- YesNoMaybe example: `src/games/YesNoMaybe/yesNoMaybeAtoms.ts`
- Broadcast example: `src/games/Broadcast/broadcastAtoms.ts`
- SignalR middleware: `src/store/SignalRMiddlewareWithJotai.ts`

## Progress Tracking

Last updated: 2025-06-20

### Current Status

✅ YesNoMaybe - Completed
✅ Broadcast - Completed
✅ NamePicker - Completed

### Lessons Learned from NamePicker Migration

1. **Testing Animations**
   - Made fade animation duration configurable via window object for testing
   - Tests can override long animations to run faster
   - Pattern: `(window as any).__NAME_PICKER_FADE_SECONDS__ = 0.5`

2. **Data Attributes for Testing**
   - Added data attributes to Pixi component for test assertions
   - `data-names`: comma-separated list of player names
   - `data-selected-name`: the selected player's name
   - Pixi component passes through rest props including data attributes

3. **E2E Test Creation**
   - Created comprehensive e2e test with multiple players
   - Test verifies exactly one winner is selected from the group
   - No need for manual cleanup in tests - framework handles it

### Lessons Learned from Broadcast Migration

1. **Game-Agnostic Message Handling**
   - Created a registration pattern where each game provides its own message handler
   - SignalR middleware remains completely game-agnostic
   - Games register themselves with: `registerGame(gameName, atom, messageHandler)`
   - Each game encapsulates its own message handling logic
   - This pattern maintains separation of concerns and improves maintainability

2. **Material-UI Migration**
   - Migrated from makeStyles to sx props as part of the Jotai migration
   - Custom Button component doesn't support sx prop, use style or className instead

### Lessons Learned from YesNoMaybe Migration

1. **SignalR Integration Approach**

   - Created a hybrid SignalR middleware (`SignalRMiddlewareWithJotai`) that checks if a game is migrated to Jotai
   - Maintains a game registry (`gameAtomRegistry`) to track migrated games
   - Updates both Jotai atoms AND dispatches Redux actions during transition (for backward compatibility)
   - This allows incremental migration without breaking non-migrated games

2. **Testing Considerations**

   - For games using Pixi.js or canvas rendering, add data attributes to expose state for e2e tests
   - Modified the Pixi component to accept and pass through props via `{...rest}` spread
   - E2E tests should assert on actual state changes, not just UI interactions

3. **Cleanup Process**

   - Remove the reducer file completely
   - Remove from rootReducer.ts and RootState.ts
   - Update any games that were importing types from the removed reducer (e.g., DoggosVsKittehs was using YesNoMaybeState)
   - Update Games.ts to use string literals instead of importing Name constants from reducers

4. **Type Safety**
   - Jotai atoms need proper TypeScript interfaces
   - The hybrid middleware needs careful typing to handle both systems

### Notes

- Each game/reducer is migrated completely before moving to the next
- SignalR is handled last to avoid complexity during game migrations
- We can adjust the order based on what we learn from early migrations
