# JavaScript API Contract: Expense Tracker

## ExpenseTracker Class API

### Constructor
```javascript
ExpenseTracker()
```
**Description**: Creates new instance and loads existing data from localStorage
**Returns**: ExpenseTracker instance
**Side Effects**: Loads data from localStorage if available

### addExpense(description, amount)
```javascript
addExpense(description: string, amount: number): boolean
```
**Description**: Adds a new expense to the collection
**Parameters**:
- `description`: Non-empty string, max 100 characters
- `amount`: Positive number, max 2 decimal places

**Returns**: 
- `true` if expense added successfully
- `false` if validation failed

**Side Effects**: 
- Updates localStorage
- Triggers UI refresh
- Updates total amount display

**Validation**:
- Throws Error if description is empty or not string
- Throws Error if amount is not positive number
- Throws Error if amount > 999999.99

### getAllExpenses()
```javascript
getAllExpenses(): Array<Expense>
```
**Description**: Returns all expenses sorted by timestamp (newest first)
**Returns**: Array of Expense objects
**Side Effects**: None (read-only operation)

### getTotalAmount()
```javascript
getTotalAmount(): number
```
**Description**: Calculates and returns sum of all expense amounts
**Returns**: Total amount as number, rounded to 2 decimal places
**Side Effects**: None (calculated field)

### loadFromStorage()
```javascript
loadFromStorage(): void
```
**Description**: Loads expense data from localStorage
**Returns**: void
**Side Effects**: Updates internal expense collection
**Error Handling**: Returns empty collection if storage unavailable or corrupted

### saveToStorage()
```javascript
saveToStorage(): boolean
```
**Description**: Persists current expense collection to localStorage
**Returns**: 
- `true` if saved successfully
- `false` if save failed

**Error Handling**: Logs error and returns false if localStorage unavailable

## DOM API Contract

### Form Elements
```javascript
// Required DOM elements with specific IDs
#expense-form: HTMLFormElement
#description-input: HTMLInputElement (type="text")
#amount-input: HTMLInputElement (type="number")
#add-expense-btn: HTMLButtonElement
#expense-list: HTMLUListElement
#total-amount: HTMLSpanElement
#error-message: HTMLDivElement
```

### Event Handlers
```javascript
// Form submission
expenseForm.addEventListener('submit', handleAddExpense)

// Input validation (real-time)
amountInput.addEventListener('input', validateAmount)
descriptionInput.addEventListener('input', validateDescription)
```

### UI Update Functions
```javascript
updateExpenseList(): void
```
**Description**: Refreshes the expense list display
**Side Effects**: Updates #expense-list innerHTML

```javascript
updateTotalDisplay(): void
```
**Description**: Updates the total amount display
**Side Effects**: Updates #total-amount textContent

```javascript
showError(message): void
```
**Description**: Displays error message to user
**Parameters**: `message` - Error message string
**Side Effects**: Updates #error-message innerHTML and visibility

```javascript
clearError(): void
```
**Description**: Hides error message
**Side Effects**: Clears #error-message and hides element

```javascript
clearForm(): void
```
**Description**: Resets form inputs after successful addition
**Side Effects**: Clears description and amount inputs, focuses description

## Data Contracts

### Expense Object Structure
```javascript
{
  id: string,           // Timestamp-based unique ID
  description: string,  // User-provided description
  amount: number,       // Expense amount (positive)
  timestamp: number,    // Creation timestamp
  date: string         // Formatted date (YYYY-MM-DD)
}
```

### Storage Contract
```javascript
// localStorage key: 'expenseTracker'
{
  expenses: Array<Expense>
}
```

## Error Contracts

### Validation Errors
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    this.message = message;
    this.field = field;
  }
}
```

### Storage Errors
```javascript
class StorageError extends Error {
  constructor(message, operation) {
    this.message = message;
    this.operation = operation; // 'save' or 'load'
  }
}
```

## Test Contract Requirements

### Unit Tests Required
- ExpenseTracker.addExpense() with valid inputs
- ExpenseTracker.addExpense() with invalid inputs
- ExpenseTracker.getTotalAmount() calculation
- ExpenseTracker.loadFromStorage() with valid data
- ExpenseTracker.loadFromStorage() with corrupted data
- ExpenseTracker.saveToStorage() success and failure

### Integration Tests Required
- Complete add expense flow (form → storage → display)
- Page load with existing data
- Error handling and display
- Form validation and user feedback

### Browser Tests Required
- localStorage availability check
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Responsive design validation
- Accessibility compliance (keyboard navigation, screen readers)
