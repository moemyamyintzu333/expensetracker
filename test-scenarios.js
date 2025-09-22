// Manual Test Scenarios for Simple Expense Tracker
// These scenarios should be tested manually in the browser

const ManualTestScenarios = {
    /**
     * Test Scenario 1: First Time User
     */
    scenario1_FirstTimeUser: {
        name: "First Time User",
        steps: [
            "1. Open index.html in browser",
            "2. Verify page loads with empty expense list",
            "3. Verify total shows $0.00",
            "4. Verify form is ready for input",
            "5. Verify empty state message is visible"
        ],
        expectedResult: "Clean interface ready for first expense",
        checkpoints: [
            "Total display shows $0.00",
            "Expense list is empty",
            "Form inputs are clear and focusable",
            "Empty state message is displayed",
            "No error messages visible"
        ]
    },

    /**
     * Test Scenario 2: Add Single Expense
     */
    scenario2_AddSingleExpense: {
        name: "Add Single Expense",
        steps: [
            "1. Enter 'Coffee' in description field",
            "2. Enter '4.50' in amount field",
            "3. Click 'Add Expense' button",
            "4. Verify expense appears in list",
            "5. Verify total shows $4.50",
            "6. Verify form is cleared"
        ],
        expectedResult: "Expense added successfully, totals updated",
        checkpoints: [
            "Expense appears in list with correct description",
            "Amount is displayed correctly as $4.50",
            "Total display updates to $4.50",
            "Form inputs are cleared after submission",
            "Empty state message is hidden"
        ]
    },

    /**
     * Test Scenario 3: Add Multiple Expenses
     */
    scenario3_AddMultipleExpenses: {
        name: "Add Multiple Expenses",
        steps: [
            "1. Add expense: 'Coffee' - $4.50",
            "2. Add expense: 'Lunch' - $12.00", 
            "3. Add expense: 'Gas' - $35.00",
            "4. Verify all three expenses in list",
            "5. Verify total shows $51.50"
        ],
        expectedResult: "All expenses tracked, correct total calculated",
        checkpoints: [
            "Three expenses visible in list",
            "Each expense shows correct description and amount",
            "Total calculates correctly: $51.50",
            "Expenses are ordered by date (newest first)",
            "List scrolls properly if needed"
        ]
    },

    /**
     * Test Scenario 4: Data Persistence
     */
    scenario4_DataPersistence: {
        name: "Data Persistence",
        steps: [
            "1. Add several expenses",
            "2. Note the total amount",
            "3. Refresh the browser page (F5 or Ctrl+R)",
            "4. Verify all expenses are still there",
            "5. Verify total is unchanged"
        ],
        expectedResult: "Data persists across browser sessions",
        checkpoints: [
            "All expenses reload after page refresh",
            "Total amount remains the same",
            "Expense order is preserved",
            "No data loss occurs",
            "localStorage contains the data"
        ]
    },

    /**
     * Test Scenario 5: Input Validation
     */
    scenario5_InputValidation: {
        name: "Input Validation",
        steps: [
            "1. Try to submit with empty description → Should show error",
            "2. Try to submit with negative amount → Should show error",
            "3. Try to submit with zero amount → Should show error", 
            "4. Try to submit with non-numeric amount → Should show error",
            "5. Submit valid expense → Should work normally"
        ],
        expectedResult: "Invalid inputs rejected with helpful error messages",
        checkpoints: [
            "Empty description triggers validation error",
            "Negative amounts are rejected",
            "Zero amounts are rejected",
            "Non-numeric amounts are rejected",
            "Error messages are clear and helpful",
            "Valid inputs are accepted normally"
        ]
    },

    /**
     * Test Scenario 6: Error Recovery
     */
    scenario6_ErrorRecovery: {
        name: "Error Recovery",
        steps: [
            "1. Submit invalid expense (triggers error)",
            "2. Correct the input",
            "3. Submit again",
            "4. Verify error message disappears",
            "5. Verify expense is added normally"
        ],
        expectedResult: "Application recovers gracefully from validation errors",
        checkpoints: [
            "Error message appears for invalid input",
            "Error message disappears when input is corrected",
            "Form remains functional after error",
            "Valid submission works after error",
            "No persistent error state"
        ]
    },

    /**
     * Execute a specific test scenario
     */
    executeScenario(scenarioName) {
        const scenario = this[scenarioName];
        if (!scenario) {
            console.error(`Scenario ${scenarioName} not found`);
            return;
        }

        console.log(`\n=== Executing: ${scenario.name} ===`);
        console.log('Steps to follow:');
        scenario.steps.forEach(step => console.log(step));
        
        console.log('\nExpected Result:');
        console.log(scenario.expectedResult);
        
        console.log('\nCheckpoints to verify:');
        scenario.checkpoints.forEach(checkpoint => console.log(`- ${checkpoint}`));
        
        console.log('\n--- Manual testing required ---');
    },

    /**
     * List all available scenarios
     */
    listAllScenarios() {
        console.log('=== Available Test Scenarios ===');
        Object.keys(this).forEach(key => {
            if (key.startsWith('scenario')) {
                const scenario = this[key];
                console.log(`${scenario.name}: ${scenario.expectedResult}`);
            }
        });
    },

    /**
     * Run all scenarios (just display instructions)
     */
    runAllScenarios() {
        console.log('=== Running All Manual Test Scenarios ===');
        Object.keys(this).forEach(key => {
            if (key.startsWith('scenario')) {
                this.executeScenario(key);
            }
        });
    }
};

// Make scenarios available globally for browser console testing
if (typeof window !== 'undefined') {
    window.ManualTestScenarios = ManualTestScenarios;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ManualTestScenarios;
}
