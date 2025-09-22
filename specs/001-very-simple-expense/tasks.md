# Tasks: Simple Expense Tracker

**Input**: Design documents from `/specs/001-very-simple-expense/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Found: tech stack HTML5/CSS3/JavaScript ES6+, LocalStorage, web app structure
2. Load optional design documents:
   → ✅ data-model.md: Expense and ExpenseCollection entities identified
   → ✅ contracts/: JavaScript API contract loaded
   → ✅ research.md: Vanilla JS decisions, LocalStorage patterns identified
3. Generate tasks by category:
   → ✅ Setup: HTML structure, CSS foundation, JS modules
   → ✅ Tests: Manual test scenarios, validation functions
   → ✅ Core: Expense model, ExpenseTracker class, UI components
   → ✅ Integration: Form handling, localStorage, display updates
   → ✅ Polish: Cross-browser testing, accessibility, documentation
4. Apply task rules:
   → ✅ Different files = mark [P] for parallel
   → ✅ Same file = sequential (no [P])
   → ✅ Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All API methods have validation tests
   → ✅ All entities have implementation tasks
   → ✅ All user scenarios covered
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Frontend-only web app**: Files at repository root
- `index.html` - Main HTML file
- `styles.css` - CSS styling
- `script.js` - JavaScript functionality

## Phase 3.1: Setup
- [ ] T001 Create basic HTML structure in `index.html` with form, expense list, and total display
- [ ] T002 [P] Create CSS foundation in `styles.css` with responsive layout and basic styling
- [ ] T003 [P] Create JavaScript module structure in `script.js` with main app initialization

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These validation functions MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Create validation test functions in `script.js` for expense input validation
- [ ] T005 [P] Create manual test scenarios in `test-scenarios.js` for user interactions
- [ ] T006 [P] Create localStorage test functions in `script.js` for data persistence testing
- [ ] T007 Create integration test scenarios in `script.js` for complete add expense flow

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T008 [P] Implement Expense class in `script.js` with validation and auto-generated fields
- [ ] T009 [P] Implement ExpenseTracker class constructor and loadFromStorage in `script.js`
- [ ] T010 Implement addExpense method in ExpenseTracker class in `script.js`
- [ ] T011 Implement getTotalAmount method in ExpenseTracker class in `script.js`
- [ ] T012 Implement getAllExpenses method in ExpenseTracker class in `script.js`
- [ ] T013 Implement saveToStorage method in ExpenseTracker class in `script.js`
- [ ] T014 [P] Create form handling functions in `script.js` for user input
- [ ] T015 [P] Create display update functions in `script.js` for expense list and total

## Phase 3.4: Integration
- [ ] T016 Connect form submission to ExpenseTracker.addExpense in `script.js`
- [ ] T017 Connect page load to data loading and display updates in `script.js`
- [ ] T018 Implement error handling and user feedback in `script.js`
- [ ] T019 Add input validation and real-time feedback in `script.js`
- [ ] T020 Connect all UI updates to data changes in `script.js`

## Phase 3.5: Polish
- [ ] T021 [P] Add responsive design and mobile optimization to `styles.css`
- [ ] T022 [P] Add accessibility features (ARIA labels, keyboard navigation) to `index.html`
- [ ] T023 [P] Create browser compatibility testing checklist
- [ ] T024 Run all manual test scenarios from quickstart.md
- [ ] T025 [P] Add error handling for localStorage unavailable in `script.js`
- [ ] T026 [P] Create user documentation in `README.md`

## Dependencies
- Setup (T001-T003) before everything
- Tests (T004-T007) before implementation (T008-T020)
- T008 (Expense class) blocks T009-T013 (ExpenseTracker methods)
- T009 (constructor/load) blocks T010-T013 (other methods)
- T014-T015 (UI functions) before T016-T020 (integration)
- Implementation (T008-T020) before polish (T021-T026)

## Parallel Example
```bash
# Launch setup tasks together:
Task: "Create CSS foundation in styles.css with responsive layout"
Task: "Create JavaScript module structure in script.js"

# Launch test creation tasks together:
Task: "Create validation test functions in script.js for expense input"
Task: "Create manual test scenarios in test-scenarios.js"
Task: "Create localStorage test functions in script.js"

# Launch core model tasks together:
Task: "Implement Expense class in script.js with validation"
Task: "Create form handling functions in script.js"
Task: "Create display update functions in script.js"
```

## Detailed Task Specifications

### Critical Path: T001 → T004-T007 → T008 → T009-T013 → T016-T020 → T024

### Test-First Requirements
Each implementation task (T008-T020) MUST have corresponding failing tests before code is written:
- T004: Tests for Expense validation rules
- T005: Manual scenarios for user interactions  
- T006: Tests for localStorage operations
- T007: End-to-end add expense flow tests

### File Modification Map
- `index.html`: T001, T022
- `styles.css`: T002, T021
- `script.js`: T003, T004, T006-T020, T025
- `test-scenarios.js`: T005
- `README.md`: T026
- New files: T023 (browser test checklist)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All API methods have corresponding tests (T004-T007)
- [x] All entities have model tasks (T008 Expense, T009-T013 ExpenseTracker)
- [x] All tests come before implementation (T004-T007 before T008-T020)
- [x] Parallel tasks truly independent (different files or independent functions)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task (except where explicitly sequential)

## User Story Coverage
- **First Time User**: T001 (HTML structure), T017 (page load), T024 (manual testing)
- **Add Single Expense**: T010 (addExpense), T016 (form integration), T024 (testing)
- **Add Multiple Expenses**: T010-T012 (core methods), T015 (display updates), T024 (testing)
- **Data Persistence**: T009 (loadFromStorage), T013 (saveToStorage), T017 (page load)
- **Input Validation**: T004 (validation tests), T008 (Expense validation), T019 (UI validation)
- **Error Recovery**: T018 (error handling), T019 (validation feedback), T025 (storage errors)

## Notes
- All tasks follow constitutional principles of simplicity
- No external dependencies or frameworks required
- Manual testing approach appropriate for scope
- Each task produces testable, incremental progress
- Focus on clear data flow and immediate user feedback
