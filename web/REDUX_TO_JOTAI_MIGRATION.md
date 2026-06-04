# Redux to Jotai Migration Plan - Strangler Fig Approach

## Overview

Incrementally migrate from Redux to Jotai using a strangler-fig pattern. Each migration step will be small, complete, and verifiable before moving to the next.

**Prerequisites**: Before each migration step, execute `npm run check-types` to ensure no type errors.

**Important**: Maintain strict TypeScript typing. Never use `any` type - use proper types or `unknown` when the type is genuinely unknown.

## Migration Strategy

### Approach

1. Start with the simplest, most isolated game reducers
2. For each migration (following strict TDD):
   - Install Jotai if not already installed
   - **FIRST**: Write failing BDD tests that describe the desired behavior with Jotai atoms
   - Create atoms to make the tests pass (minimum implementation)
   - Update components to use Jotai atoms instead of Redux
   - Refactor and ensure all tests pass
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
   - [x] Create Buzzer atoms
   - [x] Update components
   - [x] Test functionality
   - [x] Remove BuzzerReducer

#### Phase 2: Medium Complexity Games

5. **DoggosVsKittehs** - Vote counts with images

   - [x] Create atoms
   - [x] Migrate components
   - [x] Test and remove reducer

6. **FistOfFive** - Response tracking

   - [x] Create atoms
   - [x] Migrate components
   - [x] Run e2e tests (fist-of-five.spec.ts)
   - [x] Remove reducer

7. **Splat** - Canvas interactions

   - [x] Create atoms
   - [x] Migrate components
   - [x] Test and remove reducer

8. **Pong** - Team assignments

   - [x] Create atoms
   - [x] Migrate components
   - [x] Run e2e tests (pong.spec.ts)
   - [x] Remove reducer

9. **Reaction** - Shape tracking
   - [x] Convert PIXI.js components to React DOM elements
   - [x] Write BDD tests for Jotai behavior
   - [x] Create minimal atoms to make behavior tests pass
   - [x] Remove Redux reducer after all tests pass

#### Phase 3: Complex Games

10. **IdeaWall** - Ideas with localStorage

    - [x] Convert PixiJS presenter to React components
    - [x] Create atoms with localStorage sync using atomWithStorage
    - [x] Migrate components to use Jotai atoms
    - [x] Test persistence and React text-based rendering
    - [x] Remove reducer

11. **Poll** - Questions and responses

    - [x] Create atoms for questions/responses
    - [x] Migrate presenter and client views
    - [x] Test functionality
    - [x] Remove reducer

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

## TDD Compliance for Migrations

**CRITICAL**: All migrations must follow strict TDD principles:

### Test-First Approach

1. **Test Existing Redux Behavior**: First write BDD tests that verify current Redux components work correctly
2. **Convert to Jotai Expectations**: Modify tests to expect the same behavior but using Jotai patterns
3. **Minimal Implementation**: Write only the atoms needed to make behavior tests pass
4. **Never Test Internal State**: Focus on user interactions and observable outcomes

### Test Structure for Component Migration

```typescript
// CORRECT: Test component behavior, not atoms
describe('Reaction game', () => {
  describe('player interactions', () => {
    it('should allow player to click on shapes', () => {
      // Test clicking behavior and visual feedback
    });
    
    it('should show selected shape visually', () => {
      // Test UI changes when shape is selected
    });
  });
  
  describe('presenter controls', () => {
    it('should display shapes when round starts', () => {
      // Test presenter view updates
    });
    
    it('should show correct scores after round ends', () => {
      // Test score display behavior
    });
  });
});
```

### WRONG Examples to Avoid

```typescript
// WRONG: Testing atoms directly
import { reactionAtom } from './atoms';
it('should update atom when called', () => {
  // This tests implementation, not behavior
});

// WRONG: Testing reducers/state management
it('should return new state when action is dispatched', () => {
  // This tests internal implementation
});
```

### Factory Functions

Create reusable factory functions for test data:

```typescript
// Create factory functions instead of duplicating setup
function createMockShapes(overrides: Partial<Shape>[] = []): Shape[] {
  // Return sensible defaults with overrides
}

function createMockPlayers(count: number = 2): Player[] {
  // Return mock players
}
```

## Verification Strategy

For each migration:

1. **TDD Cycle**: Ensure all tests fail first, then pass after implementation
2. Run `npm run check-types`
3. Run relevant e2e tests: `npm run e2e -- <test-file>`
4. Manual testing with presenter + player windows
5. Add React Testing Library tests if e2e coverage is insufficient

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

Last updated: 2025-06-24

### Current Status

✅ YesNoMaybe - Completed
✅ Broadcast - Completed
✅ NamePicker - Completed
✅ Buzzer - Completed
✅ DoggosVsKittehs - Completed
✅ FistOfFive - Completed
✅ Splat - Completed
✅ Pong - Completed
✅ Reaction - Completed
✅ IdeaWall - Completed
✅ Poll - Completed

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

### Lessons Learned from FistOfFive Migration

1. **Message Handling Flexibility**
   - SignalR messages can come in different formats depending on the source
   - Presenter messages from clients may arrive as direct payloads without type wrapper
   - Message handler should check for both `message.type` and handle direct payloads
   - Pattern: Check if message has type property, otherwise infer from context

2. **Shared Components Migration**
   - FistOfFive reused PollClient, so created a new FistOfFiveClient using Jotai
   - Custom Button component doesn't support sx prop - wrap content in Box instead
   - Migrated makeStyles to sx props for better MUI v5 compatibility

3. **Type Consistency**
   - Ensured all IDs are strings (questionId, answerId) for consistency
   - Response tracking requires proper typing for player responses

### Lessons Learned from Pong Migration

1. **GameMessage Wrapper Structure**
   - Redux implementation wraps presenter messages in a `GameMessage` structure with a `payload` field
   - Message handler needs to handle both wrapped (`message.payload`) and unwrapped formats
   - Pattern: `const payload = message.payload || message;` for backward compatibility

2. **Combined State Pattern**
   - Successfully used combined atom pattern with client and presenter states in single atom
   - Action atoms for presenter-specific actions (score updates, paddle settings)
   - Message handler routes messages based on `isPresenter` flag

3. **Class Component Migration**
   - Used wrapper component pattern to migrate class components with HOCs
   - Wrapper uses hooks and passes props to the core class component
   - ReactAnimationFrame HOC applied to the wrapper component

4. **Testing Considerations**
   - E2E tests may fail if message format expectations don't match
   - Need to properly type message handlers in tests using `GameAtomWithHandler<StateType>`
   - Some component tests may be difficult to mock during migration if they still use Redux for actions

### Lessons Learned from IdeaWall Migration

1. **PixiJS to React Conversion**
   - Successfully converted PixiJS-based rendering to React components using Material-UI
   - React components make testing much easier - can assert on actual text content instead of data attributes
   - Used `Paper` components with dynamic background colors to replicate the visual appeal of PixiJS cards
   - Typography components handle text rendering and word-breaking automatically

2. **localStorage Integration with Jotai**
   - `atomWithStorage` from `jotai/utils` provides seamless localStorage persistence
   - Combined storage atom with main game state using derived atoms
   - Storage persistence happens automatically without manual save/load operations
   - Pattern: separate storage atom + derived atom that combines with other state

3. **Complex State Management**
   - Successfully used multiple action atoms for different presenter controls
   - Message handler pattern scales well to more complex state updates
   - localStorage sync only updates when ideas array changes, not other state properties
   - Action atoms can trigger immediate side effects (like setTimeout for arrange flag reset)

4. **Menu Component Migration**
   - Menu components also needed migration from Redux actions to Jotai atoms
   - Action atoms work well with UI event handlers - cleaner than dispatch calls
   - Dialog confirmation patterns work the same with Jotai as with Redux

5. **Testing Approach**
   - BDD tests can focus on actual text content rather than implementation details
   - React text content is directly accessible to e2e tests without special data attributes
   - Tests describe behavior from user perspective rather than testing internal state
   - E2E tests require running backend but provide the most confidence

### Notes

- Each game/reducer is migrated completely before moving to the next
- SignalR is handled last to avoid complexity during game migrations
- We can adjust the order based on what we learn from early migrations
