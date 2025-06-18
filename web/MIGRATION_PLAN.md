# DigitalIcebreakers E2E Test Migration Plan

This document tracks the migration of end-to-end tests from the .NET/C# test suite (`DigitalIcebreakers.EndToEndTests`) to the new Playwright TypeScript setup in `/web`.

## Overview

The existing test suite uses:

- **Framework**: xUnit with Playwright Sharp (C#)
- **Structure**: Page Object Model with `Presenter` and `Player` helper classes
- **Assertions**: Shouldly library
- **Test Organization**: Feature-based folders and descriptive test names

The new test suite will use:

- **Framework**: Playwright Test (TypeScript)
- **Structure**: Page Object Model (maintaining similar patterns)
- **Assertions**: Playwright's built-in assertions
- **Test Organization**: Similar feature-based structure in `/web/e2e`

## Migration Strategy

1. **Phase 1**: Set up base infrastructure

   - [ ] Create TypeScript versions of helper classes (Presenter, Player, BrowserFactory)
   - [ ] Set up test configuration and fixtures
   - [ ] Establish naming conventions and folder structure

2. **Phase 2**: Migrate simple tests first

   - [ ] Start with tests that have minimal dependencies
   - [ ] Validate the test infrastructure works correctly
   - [ ] Refine helper methods as needed

3. **Phase 3**: Migrate complex tests
   - [ ] Tests with multiple players
   - [ ] Tests with file uploads/downloads
   - [ ] Tests with complex state management

**Important**: Each C# test file must be deleted immediately after its TypeScript migration is verified and passing.

## Test Migration Checklist

### Infrastructure Setup

- [x] Create `/web/e2e/helpers/` directory
- [x] Port `AbstractBrowser.cs` → `abstractBrowser.ts`
- [x] Port `BrowserFactory.cs` → `browserFactory.ts`
- [x] Port `Player.cs` → `player.ts`
- [x] Port `Presenter.cs` → `presenter.ts`
- [x] Create base test fixtures and configuration
- [x] Set up test data management (for JSON files)

### Simple Tests (Priority 1)

- [x] **JoinCodeTest.cs** → `join-code.spec.ts` ✅ (C# file deleted)

  - Single presenter, single player
  - Tests basic join functionality
  - Good first test to validate infrastructure

- [x] **Given_a_lobby_When_players_join.cs** → `lobby/lobby-player-join.spec.ts` ✅ (C# file deleted)
  - Tests lobby count updates
  - Simple assertions on UI elements

### Game Tests (Priority 2)

- [x] **BroadcastTests.cs** → `games/broadcast.spec.ts` ✅ (C# file deleted)

  - Tests text broadcasting feature
  - Includes refresh scenario
  - Real-time communication testing

- [x] **FistOfFiveTests.cs** → `games/fist-of-five.spec.ts` ✅ (C# file deleted)

  - Multiple players (2)
  - Tests voting and average calculation
  - More complex interactions

- [x] **PongTests.cs** → `games/pong.spec.ts` ✅ (C# file deleted)
  - Multiple players (6)
  - Tests team balancing logic
  - Complex player join/leave scenarios

### Connection Tests (Priority 3)

- [x] **Given_a_Player_When_refreshed.cs** → `connection/player-refresh.spec.ts` ✅ (C# file deleted)
- [x] **Given_a_Presenter_When_page_loaded.cs** → `connection/presenter-page-loaded.spec.ts` ✅ (C# file deleted)
- [x] **Given_a_Presenter_When_refreshed.cs** → `connection/presenter-refresh.spec.ts` ✅ (C# file deleted)
- [x] **Given_two_lobbys_When_a_player_switches.cs** → `connection/player-lobby-switch.spec.ts` ✅ (C# file deleted)

### Complex Game Tests (Priority 4)

- [x] **RetrospectiveTests.cs** → `games/retrospective.spec.ts` ✅ (C# file deleted)

  - Tests custom category functionality
  - Single player test with category management

- [x] **Trivia Tests** → `games/trivia/` ✅ (All C# files deleted)
  - [x] **Given_Poll_When_switching_to_Trivia.cs** → `poll-to-trivia.spec.ts` ✅
  - [x] **Given_Trivia_When_clearing_questions.cs** → `clear-questions.spec.ts` ✅
  - [x] **Given_Trivia_When_clicking_scores.cs** → `scores.spec.ts` ✅
  - [x] **Given_Trivia_When_editing_questions.cs** → `edit-questions.spec.ts` ✅
  - [x] **Given_Trivia_with_multiple_players.cs** → `multiple-players.spec.ts` ✅
  - [x] Migrate test data files (questions.json, questions1.json, questions2.json) ✅

## Helper Method Mapping

Common patterns to port:

### C# → TypeScript

```csharp
await _presenter.Page.GetTextContentByTestId("lobby-id");
```

→

```typescript
await presenter.page.getByTestId("lobby-id").textContent();
```

```csharp
await _presenter.Page.ClickByTestId("show-responses");
```

→

```typescript
await presenter.page.getByTestId("show-responses").click();
```

```csharp
text.ShouldBe("expected");
```

→

```typescript
expect(text).toBe("expected");
```

```csharp
await page.ClickAsync("text='Present'", delay: 1000);
```

→

```typescript
await page.getByRole("button", { name: "Present" }).click();
```

## Playwright Locator Conventions

### Preferred Patterns

- **Buttons**: Use `getByRole('button', { name: 'Button Text' })` instead of `text=` selectors
- **Links**: Use `getByRole('link', { name: 'Text' })` for navigation items (Note: "New Activity" is a link, not a button)
- **Text inputs**: Use `getByRole('textbox')` instead of `locator("[type=text]")`
- **Test IDs**: Use `getByTestId("element-id")` instead of `page.locator('[data-testid=...]')`
- **Multiple matches**: Use `.first()` when multiple elements match: `page.getByTestId("lobby-id").first()`
- **Avoid**: String selectors and locator syntax when Playwright's semantic locators are available

## Test Data Migration

- [x] Create `/web/e2e/test-data/` directory ✅
- [x] Copy trivia question JSON files ✅
- [x] Update file paths in tests ✅

## CI/CD Considerations

- [ ] Update GitHub Actions to run TypeScript tests
- [ ] Ensure both test suites can run in parallel during migration
- [ ] Plan for deprecating C# tests once migration is complete

## Notes and Learnings

### Routing and URL Handling

- **Issue**: Direct navigation to lobby codes (e.g., `/XXXX`) was redirecting to root
- **Solution**: Added catch-all route for 4-character lobby codes and updated RouteLink interface to support both `path` and `route` properties

### Linting Requirements

- **Always run** `npm run lint:e2e` before considering a test migration complete
- **Common fixes**:
  - Unused fixture parameters: Use `expect(fixture).toBeDefined()` when a fixture is required but not directly used
  - This ensures fixtures are created (e.g., player joining affects presenter's lobby count)

### Multiple Elements with Same Test ID

- **Issue**: Some components appear multiple times (e.g., in desktop and mobile sidebars)
- **Solution**: Use `.first()` or `.nth()` to select specific instances
- **Example**: `presenter.page.getByTestId("menu-lobby").first()`

### Fixture Dependencies

- The `player` fixture automatically creates a player joined to the presenter's lobby
- Use `browserFactory.createPlayers()` when you need multiple players
- Both `presenter` and `player` fixtures are automatically cleaned up

### Test File Organization

- Connection tests go in `/e2e/connection/`
- Game tests go in `/e2e/games/`
- Lobby tests go in `/e2e/lobby/`

### Wait Strategies

- Replace C# `Task.Delay(300)` with `page.waitForTimeout(300)`
- Consider using better wait strategies when possible (waitForSelector, waitForLoadState)

### Migration Order Strategy

1. Start with simplest tests to validate infrastructure
2. Connection tests are simpler than game tests
3. Single player tests before multi-player tests
4. Delete C# files immediately after successful migration

### ES Module Considerations

- Use `import.meta.url` and `fileURLToPath` for file path resolution
- `__dirname` is not available in ES modules by default
- Must create it using `path.dirname(fileURLToPath(import.meta.url))`

## Completion Criteria

- [x] All tests migrated and passing
- [x] Old C# tests can be safely removed
- [ ] CI/CD updated to use new tests
- [ ] Documentation updated

---

Last Updated: 2025-06-17
