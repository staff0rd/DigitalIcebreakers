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
- [ ] Set up test data management (for JSON files)

### Simple Tests (Priority 1)

- [x] **JoinCodeTest.cs** → `join-code.spec.ts` ✅ (C# file deleted)

  - Single presenter, single player
  - Tests basic join functionality
  - Good first test to validate infrastructure

- [ ] **Given_a_lobby_When_players_join.cs** → `lobby/players-join.spec.ts`
  - Tests lobby count updates
  - Simple assertions on UI elements

### Game Tests (Priority 2)

- [ ] **BroadcastTests.cs** → `games/broadcast.spec.ts`

  - Tests text broadcasting feature
  - Includes refresh scenario
  - Real-time communication testing

- [ ] **FistOfFiveTests.cs** → `games/fist-of-five.spec.ts`

  - Multiple players (2)
  - Tests voting and average calculation
  - More complex interactions

- [ ] **PongTests.cs** → `games/pong.spec.ts`
  - Check existing structure first

### Connection Tests (Priority 3)

- [ ] **Given_a_Player_When_refreshed.cs** → `connection/player-refresh.spec.ts`
- [ ] **Given_a_Presenter_When_page_loaded.cs** → `connection/presenter-page-load.spec.ts`
- [ ] **Given_a_Presenter_When_refreshed.cs** → `connection/presenter-refresh.spec.ts`
- [ ] **Given_two_lobbys_When_a_player_switches.cs** → `connection/player-lobby-switch.spec.ts`

### Complex Game Tests (Priority 4)

- [ ] **RetrospectiveTests.cs** → `games/retrospective.spec.ts`

  - Check complexity and dependencies

- [ ] **Trivia Tests** → `games/trivia/`
  - [ ] **Given_Poll_When_switching_to_Trivia.cs** → `poll-to-trivia.spec.ts`
  - [ ] **Given_Trivia_When_clearing_questions.cs** → `clear-questions.spec.ts`
  - [ ] **Given_Trivia_When_clicking_scores.cs** → `scores.spec.ts`
  - [ ] **Given_Trivia_When_editing_questions.cs** → `edit-questions.spec.ts`
  - [ ] **Given_Trivia_with_multiple_players.cs** → `multiple-players.spec.ts`
  - [ ] Migrate test data files (questions.json, questions1.json, questions2.json)

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
await page.getByRole('button', { name: 'Present' }).click();
```

## Playwright Locator Conventions

### Preferred Patterns
- **Buttons**: Use `getByRole('button', { name: 'Button Text' })` instead of `text=` selectors
- **Test IDs**: Use `getByTestId("element-id")` instead of `page.locator('[data-testid=...]')`
- **Multiple matches**: Use `.first()` when multiple elements match: `page.getByTestId("lobby-id").first()`
- **Avoid**: String selectors and locator syntax when Playwright's semantic locators are available

## Test Data Migration

- [ ] Create `/web/e2e/test-data/` directory
- [ ] Copy trivia question JSON files
- [ ] Update file paths in tests

## CI/CD Considerations

- [ ] Update GitHub Actions to run TypeScript tests
- [ ] Ensure both test suites can run in parallel during migration
- [ ] Plan for deprecating C# tests once migration is complete

## Notes and Learnings

- Add discoveries and patterns here as migration progresses
- Document any significant differences between C# and TypeScript implementations
- Track any bugs found during migration

## Completion Criteria

- [ ] All tests migrated and passing
- [ ] Old C# tests can be safely removed
- [ ] CI/CD updated to use new tests
- [ ] Documentation updated
- [ ] Team trained on new test structure

---

Last Updated: [Date will be updated as progress is made]
