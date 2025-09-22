# Data Model: Simple Expense Tracker

## Entities

### Expense
**Purpose**: Represents a single expense entry with user-provided information

**Fields**:
- `id`: String - Unique identifier (timestamp-based)
- `description`: String - User-provided description of the expense
- `amount`: Number - Expense amount (positive decimal number)
- `timestamp`: Number - Creation timestamp (Date.now())
- `date`: String - Human-readable date (YYYY-MM-DD format)

**Validation Rules**:
- `description`: Required, non-empty string, max 100 characters
- `amount`: Required, positive number, max 2 decimal places, max value 999999.99
- `id`: Auto-generated, must be unique
- `timestamp`: Auto-generated on creation
- `date`: Auto-generated from timestamp

**State Transitions**:
- Created → Persisted (saved to localStorage)
- No update or delete operations (per requirements)

### ExpenseCollection
**Purpose**: Manages the collection of all expenses and provides calculated totals

**Fields**:
- `expenses`: Array<Expense> - All recorded expenses
- `totalAmount`: Number - Calculated sum of all expense amounts (read-only)

**Validation Rules**:
- `expenses`: Must be valid array, each item must be valid Expense
- `totalAmount`: Calculated field, always reflects sum of expense amounts

**Methods**:
- `addExpense(description, amount)`: Add new expense to collection
- `getTotalAmount()`: Calculate and return sum of all expenses
- `getAllExpenses()`: Return array of all expenses
- `saveToStorage()`: Persist collection to localStorage
- `loadFromStorage()`: Load collection from localStorage

## Data Flow

### Add Expense Flow
1. User enters description and amount
2. Validate input format and rules
3. Create new Expense object with auto-generated fields
4. Add to ExpenseCollection
5. Save updated collection to localStorage
6. Update UI to show new expense and updated total

### Load Data Flow
1. Check if localStorage contains saved data
2. Parse and validate stored data structure
3. Create ExpenseCollection from stored data
4. Display all expenses and calculated total
5. Handle gracefully if no data or corrupted data

## Storage Schema

### LocalStorage Key: 'expenseTracker'
```javascript
{
  "expenses": [
    {
      "id": "1732287600000",
      "description": "Coffee",
      "amount": 4.50,
      "timestamp": 1732287600000,
      "date": "2025-09-22"
    },
    {
      "id": "1732287660000", 
      "description": "Lunch",
      "amount": 12.00,
      "timestamp": 1732287660000,
      "date": "2025-09-22"
    }
  ]
}
```

### Calculated Fields
- Total amount is calculated on-demand from expenses array
- Never stored to avoid data inconsistency
- Recalculated on every page load and after each addition

## Error Handling

### Validation Errors
- Empty description → "Description is required"
- Invalid amount → "Amount must be a positive number"
- Amount too large → "Amount cannot exceed $999,999.99"
- Non-numeric amount → "Please enter a valid number"

### Storage Errors
- localStorage unavailable → "Cannot save data - localStorage not supported"
- Storage quota exceeded → "Cannot save - storage full"
- Corrupted data → Clear storage and start fresh with empty collection
- JSON parse errors → Log error and use empty collection

## Constraints

### Browser Compatibility
- Requires localStorage support (IE8+, all modern browsers)
- Uses ES6 features (const, let, arrow functions)
- Requires JSON methods for serialization

### Performance Considerations
- Linear calculation of total (O(n) where n = number of expenses)
- Full data reload from localStorage on each operation
- Acceptable for expected scale (<10k expenses)

### Data Integrity
- No referential integrity needed (single entity type)
- Timestamp uniqueness ensures ID uniqueness
- Immutable expense records (no updates allowed)
