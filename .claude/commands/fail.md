# /fail

Use this command to interrupt development when a workflow violation is detected.

## Usage

```
/fail [violation-type]
```

## Parameters

- `violation-type` (optional): The specific type of violation detected.

## Examples

- `/fail` - General violation without specifying type
- `/fail BDD principles` - Specifies BDD principles violation
- `/fail testing patterns` - Specifies testing patterns violation

## Purpose

Provides a quick way to halt development and focus on correcting methodology violations before continuing with implementation.

## Prompt

{{#if violation-type}}
You have violated the {{violation-type}} in @CLAUDE.md. Let's pause for now and focus on the violation. What changes to the codebase and/or guidance should be applied to ensure the {{violation-type}} in @CLAUDE.md is not violated when adding or changing code?
{{else}}
You have violated the approach in @CLAUDE.md. Let's pause for now and focus on the violation. What changes to the codebase and/or guidance should be applied to ensure the approach in @CLAUDE.md is not violated when adding or changing code?
{{/if}}