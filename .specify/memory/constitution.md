<!--
Sync Impact Report:
- Version change: new → 1.0.0
- New constitution created with focus on code simplicity and testing simplicity
- Added sections: Core Principles (5), Code Quality Standards, Development Workflow
- Templates requiring updates: ✅ constitution.md created
- Follow-up TODOs: None
-->

# Expense Tracker Constitution

## Core Principles

### I. Code Simplicity (NON-NEGOTIABLE)
Every piece of code MUST follow the principle of simplicity first. Functions should do one thing well, modules should have clear single responsibilities, and complexity must be explicitly justified. No premature optimization or over-engineering is allowed. When in doubt, choose the simpler solution that solves the immediate problem.

**Rationale**: Simple code is easier to understand, test, debug, and maintain. Complex solutions create technical debt and increase development time.

### II. Testing Simplicity  
Tests MUST be simple, focused, and readable. Each test should verify one specific behavior. Test names must clearly describe what is being tested. Avoid complex test setups, mocking frameworks when simple stubs suffice, and testing implementation details instead of behavior.

**Rationale**: Simple tests serve as living documentation and provide confidence in code changes. Complex tests are brittle and difficult to maintain.

### III. Test-First Development
All new features and bug fixes MUST start with a failing test that demonstrates the expected behavior. The cycle is: Write test → Test fails → Write minimal code to pass → Refactor if needed. No code without tests, no tests without purpose.

**Rationale**: Test-first development ensures we build what we need, prevents over-engineering, and provides immediate feedback on design decisions.

### IV. Clear Data Flow
Data flow through the application MUST be explicit and traceable. Avoid hidden state mutations, implicit dependencies, and magic behavior. Functions should clearly indicate their inputs and outputs. State changes should be obvious and intentional.

**Rationale**: Clear data flow makes the application predictable and debuggable, reducing the cognitive load for developers.

### V. Fail Fast and Obvious
The application MUST fail quickly and clearly when something goes wrong. Error messages must be actionable and specific. Invalid states should be impossible to represent in the code. Use types and validation to prevent errors rather than handling them after they occur.

**Rationale**: Fast, obvious failures reduce debugging time and prevent cascading issues that are harder to diagnose.

## Code Quality Standards

All code MUST pass automated quality checks including linting, formatting, and type checking before being committed. Code reviews focus on adherence to principles rather than style preferences. Performance optimizations require benchmarks and justification.

## Development Workflow

Every change follows the same process: Specification → Test → Implementation → Review → Integration. Breaking changes require explicit documentation and migration plans. All features must include user documentation and examples.

## Governance

This constitution supersedes all other development practices and guidelines. Violations must be justified in writing before proceeding. Amendments require review of impact on existing code and templates.

All development decisions must be evaluated against these principles. When principles conflict, simplicity takes precedence. Complex solutions require explicit justification and approval.

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22