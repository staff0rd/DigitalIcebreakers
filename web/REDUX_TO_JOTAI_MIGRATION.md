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
   - Verify with existing e2e tests
   - Add React Testing Library tests if needed. Each reducer should have at least one test to ensure functionality.
   - Remove the Redux reducer
   - Pause for feedback from the team

### Migration Order (Subject to Change)

#### Phase 1: Simple Games (No external dependencies)

1. **YesNoMaybe** - Simplest game, just vote counts

   - [ ] Install Jotai and add provider to App.tsx
   - [ ] Create YesNoMaybe atoms
   - [ ] Update YesNoMaybeClient and YesNoMaybePresenter to use atoms
   - [ ] Run e2e tests
   - [ ] Remove YesNoMaybeReducer
   - [ ] Remove from games reducer

2. **Broadcast** - Simple message state

   - [ ] Create Broadcast atoms
   - [ ] Update BroadcastClient and BroadcastPresenter
   - [ ] Run e2e tests (broadcast.spec.ts)
   - [ ] Remove BroadcastReducer
   - [ ] Remove from games reducer

3. **NamePicker** - Array of names

   - [ ] Create NamePicker atoms
   - [ ] Update components
   - [ ] Test functionality
   - [ ] Remove NamePickerReducer

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

## Progress Tracking

Last updated: 2025-06-20

### Current Status

Starting fresh with strangler-fig approach. No migrations completed yet.

### Notes

- Each game/reducer is migrated completely before moving to the next
- SignalR is handled last to avoid complexity during game migrations
- We can adjust the order based on what we learn from early migrations
