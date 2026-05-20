# Bug Remediation Jira Ticket Template

## Summary
`[Bug] <short description of the issue>`

## Issue Type
`Bug`

## Priority / Severity
`<Priority>` / `<Severity>`

## Description
### Issue
<Describe the bug clearly and directly. Explain what is broken, who is impacted, and the business or user impact.>

### Current Behavior
<Describe what the system does today when the bug occurs.>

### Expected Behavior
<Describe what the system should do instead.>

## Environment
- Environment: <Production / Staging / Local>
- Platform: <Web / iOS / Android / Backend / API>
- Version / Build: <version if known>
- Affected Users: <all users / subset / specific role>

## Steps to Reproduce
1. <First step>
2. <Second step>
3. <Third step>
4. <Observe the issue>

## Actual Result
<State the observed result after following the steps above.>

## Expected Result
<State the correct result that should occur instead.>

## Remediation Scope
<Describe the intended fix at a high level, including any guardrails, validation, or regression coverage that should be added.>

## Acceptance Criteria
- The reported bug no longer occurs when the reproduction steps are followed.
- The expected behavior is restored for `<affected users/flows>`.
- No regression is introduced in related workflows.
- Relevant automated or manual test coverage is added or updated as appropriate.

## Root Cause / Notes
- <Known root cause, suspected cause, or investigation notes>
- <Logs, screenshots, error messages, or related tickets>

## Validation
- <How QA or engineering should verify the fix>
- <Any edge cases that must be checked before closing the ticket>
