// Enhanced Expense Tracker with Authentication and CRUD
// Includes: User management, Login/Signup, Edit/Delete expenses

'use strict';

// Global application state
let currentUser = null;
let expenseTracker = null;
let currentEditingExpense = null;

// DOM element references
let elements = {};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Simple hash function for password storage (basic security)
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

/**
 * Validate description input
 */
function validateDescription(description) {
    if (!description || typeof description !== 'string') return false;
    const trimmed = description.trim();
    return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Validate amount input
 */
function validateAmount(amount) {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 999999.99;
}

/**
 * Format currency display
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date display
 */
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// =============================================================================
// USER MANAGEMENT SYSTEM
// =============================================================================

class UserManager {
    constructor() {
        this.users = this.loadUsers();
    }

    loadUsers() {
        try {
            const users = localStorage.getItem('expenseTracker_users');
            return users ? JSON.parse(users) : {};
        } catch (error) {
            console.error('Error loading users:', error);
            return {};
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('expenseTracker_users', JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    createUser(username, password) {
        const trimmedUsername = username.trim().toLowerCase();
        
        // Validation
        if (!trimmedUsername || trimmedUsername.length < 3 || trimmedUsername.length > 20) {
            throw new Error('Username must be 3-20 characters long');
        }
        
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        if (this.users[trimmedUsername]) {
            throw new Error('Username already exists');
        }
        
        // Create user
        this.users[trimmedUsername] = {
            username: trimmedUsername,
            passwordHash: simpleHash(password),
            createdAt: Date.now(),
            expenses: []
        };
        
        if (this.saveUsers()) {
            return trimmedUsername;
        } else {
            throw new Error('Failed to save user data');
        }
    }

    authenticateUser(username, password) {
        const trimmedUsername = username.trim().toLowerCase();
        const user = this.users[trimmedUsername];
        
        if (!user) {
            throw new Error('Username not found');
        }
        
        if (user.passwordHash !== simpleHash(password)) {
            throw new Error('Invalid password');
        }
        
        return trimmedUsername;
    }

    getUser(username) {
        return this.users[username];
    }

    getUserExpenses(username) {
        const user = this.users[username];
        return user ? user.expenses : [];
    }

    saveUserExpenses(username, expenses) {
        if (this.users[username]) {
            this.users[username].expenses = expenses;
            return this.saveUsers();
        }
        return false;
    }
}

// =============================================================================
// EXPENSE CLASS
// =============================================================================

class Expense {
    constructor(description, amount, id = null, timestamp = null) {
        // Validate inputs
        if (!validateDescription(description)) {
            throw new Error('Description must be 1-100 characters long and cannot be empty');
        }
        
        if (!validateAmount(amount)) {
            throw new Error('Amount must be a positive number up to $999,999.99');
        }
        
        // Set properties
        this.id = id || generateId();
        this.description = description.trim();
        this.amount = parseFloat(amount);
        this.timestamp = timestamp || Date.now();
        this.date = formatDate(this.timestamp);
    }

    // Method to update expense
    update(description, amount) {
        if (!validateDescription(description)) {
            throw new Error('Description must be 1-100 characters long and cannot be empty');
        }
        
        if (!validateAmount(amount)) {
            throw new Error('Amount must be a positive number up to $999,999.99');
        }
        
        this.description = description.trim();
        this.amount = parseFloat(amount);
        // Keep original timestamp but update date formatting
        this.date = formatDate(this.timestamp);
    }

    // Convert to plain object for storage
    toJSON() {
        return {
            id: this.id,
            description: this.description,
            amount: this.amount,
            timestamp: this.timestamp,
            date: this.date
        };
    }

    // Create from plain object
    static fromJSON(data) {
        return new Expense(data.description, data.amount, data.id, data.timestamp);
    }
}

// =============================================================================
// EXPENSE TRACKER CLASS
// =============================================================================

class ExpenseTracker {
    constructor(userManager, username) {
        this.userManager = userManager;
        this.username = username;
        this.expenses = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const expenseData = this.userManager.getUserExpenses(this.username);
            this.expenses = expenseData.map(data => Expense.fromJSON(data));
            return true;
        } catch (error) {
            console.error('Error loading expenses:', error);
            this.expenses = [];
            return false;
        }
    }

    saveToStorage() {
        try {
            const expenseData = this.expenses.map(expense => expense.toJSON());
            return this.userManager.saveUserExpenses(this.username, expenseData);
        } catch (error) {
            console.error('Error saving expenses:', error);
            return false;
        }
    }

    addExpense(description, amount) {
        try {
            const expense = new Expense(description, amount);
            this.expenses.unshift(expense); // Add to beginning for newest first
            
            if (this.saveToStorage()) {
                return expense;
            } else {
                // Rollback if save failed
                this.expenses.shift();
                throw new Error('Failed to save expense');
            }
        } catch (error) {
            throw error;
        }
    }

    updateExpense(id, description, amount) {
        const expenseIndex = this.expenses.findIndex(expense => expense.id === id);
        if (expenseIndex === -1) {
            throw new Error('Expense not found');
        }

        const originalExpense = { ...this.expenses[expenseIndex] };
        
        try {
            this.expenses[expenseIndex].update(description, amount);
            
            if (this.saveToStorage()) {
                return this.expenses[expenseIndex];
            } else {
                // Rollback if save failed
                this.expenses[expenseIndex] = originalExpense;
                throw new Error('Failed to save expense');
            }
        } catch (error) {
            // Rollback if validation failed
            this.expenses[expenseIndex] = originalExpense;
            throw error;
        }
    }

    deleteExpense(id) {
        const expenseIndex = this.expenses.findIndex(expense => expense.id === id);
        if (expenseIndex === -1) {
            throw new Error('Expense not found');
        }

        const deletedExpense = this.expenses.splice(expenseIndex, 1)[0];
        
        if (this.saveToStorage()) {
            return deletedExpense;
        } else {
            // Rollback if save failed
            this.expenses.splice(expenseIndex, 0, deletedExpense);
            throw new Error('Failed to delete expense');
        }
    }

    getExpense(id) {
        return this.expenses.find(expense => expense.id === id);
    }

    getAllExpenses() {
        return [...this.expenses]; // Return copy to prevent external modification
    }

    getTotalAmount() {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    getExpenseCount() {
        return this.expenses.length;
    }
}

// =============================================================================
// AUTHENTICATION MANAGER
// =============================================================================

class AuthManager {
    constructor() {
        this.userManager = new UserManager();
        this.currentSession = this.loadSession();
    }

    loadSession() {
        try {
            const session = localStorage.getItem('expenseTracker_session');
            return session ? JSON.parse(session) : null;
        } catch (error) {
            console.error('Error loading session:', error);
            return null;
        }
    }

    saveSession(username) {
        try {
            const session = {
                username: username,
                loginTime: Date.now()
            };
            localStorage.setItem('expenseTracker_session', JSON.stringify(session));
            this.currentSession = session;
            return true;
        } catch (error) {
            console.error('Error saving session:', error);
            return false;
        }
    }

    clearSession() {
        try {
            localStorage.removeItem('expenseTracker_session');
            this.currentSession = null;
            return true;
        } catch (error) {
            console.error('Error clearing session:', error);
            return false;
        }
    }

    signup(username, password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        const newUsername = this.userManager.createUser(username, password);
        return this.login(newUsername, password);
    }

    login(username, password) {
        const authenticatedUsername = this.userManager.authenticateUser(username, password);
        
        if (this.saveSession(authenticatedUsername)) {
            return authenticatedUsername;
        } else {
            throw new Error('Failed to create session');
        }
    }

    logout() {
        this.clearSession();
        currentUser = null;
        expenseTracker = null;
    }

    isLoggedIn() {
        return this.currentSession !== null;
    }

    getCurrentUser() {
        return this.currentSession ? this.currentSession.username : null;
    }

    getUserManager() {
        return this.userManager;
    }
}

// =============================================================================
// UI MANAGER
// =============================================================================

class UIManager {
    constructor() {
        this.authManager = new AuthManager();
        this.initializeElements();
        this.setupEventListeners();
        this.initializeApp();
    }

    initializeElements() {
        elements = {
            // Auth elements
            authContainer: document.getElementById('auth-container'),
            loginSection: document.getElementById('login-section'),
            signupSection: document.getElementById('signup-section'),
            loginForm: document.getElementById('login-form'),
            signupForm: document.getElementById('signup-form'),
            showSignup: document.getElementById('show-signup'),
            showLogin: document.getElementById('show-login'),
            authError: document.getElementById('auth-error'),
            
            // App elements
            appContainer: document.getElementById('app-container'),
            currentUser: document.getElementById('current-user'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Expense form elements
            expenseForm: document.getElementById('expense-form'),
            descriptionInput: document.getElementById('description-input'),
            amountInput: document.getElementById('amount-input'),
            errorMessage: document.getElementById('error-message'),
            
            // Expense list elements
            expenseList: document.getElementById('expense-list'),
            emptyState: document.getElementById('empty-state'),
            totalAmount: document.getElementById('total-amount'),
            
            // Modal elements
            editModal: document.getElementById('edit-modal'),
            editForm: document.getElementById('edit-expense-form'),
            editDescription: document.getElementById('edit-description'),
            editAmount: document.getElementById('edit-amount'),
            closeModal: document.getElementById('close-modal'),
            cancelEdit: document.getElementById('cancel-edit'),
            
            deleteModal: document.getElementById('delete-modal'),
            deleteExpenseDetails: document.getElementById('delete-expense-details'),
            closeDeleteModal: document.getElementById('close-delete-modal'),
            cancelDelete: document.getElementById('cancel-delete'),
            confirmDelete: document.getElementById('confirm-delete')
        };
    }

    setupEventListeners() {
        // Check if elements exist before adding listeners
        if (elements.showSignup) {
            elements.showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupForm();
            });
        }

        if (elements.showLogin) {
            elements.showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (elements.signupForm) {
            elements.signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        if (elements.logoutBtn) {
            elements.logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Expense form event listeners
        if (elements.expenseForm) {
            elements.expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddExpense();
            });
        }

        // Modal event listeners
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', () => {
                this.hideEditModal();
            });
        }

        if (elements.cancelEdit) {
            elements.cancelEdit.addEventListener('click', () => {
                this.hideEditModal();
            });
        }

        if (elements.editForm) {
            elements.editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEditExpense();
            });
        }

        if (elements.closeDeleteModal) {
            elements.closeDeleteModal.addEventListener('click', () => {
                this.hideDeleteModal();
            });
        }

        if (elements.cancelDelete) {
            elements.cancelDelete.addEventListener('click', () => {
                this.hideDeleteModal();
            });
        }

        if (elements.confirmDelete) {
            elements.confirmDelete.addEventListener('click', () => {
                this.handleDeleteExpense();
            });
        }

        // Close modals when clicking outside
        if (elements.editModal) {
            elements.editModal.addEventListener('click', (e) => {
                if (e.target === elements.editModal) {
                    this.hideEditModal();
                }
            });
        }

        if (elements.deleteModal) {
            elements.deleteModal.addEventListener('click', (e) => {
                if (e.target === elements.deleteModal) {
                    this.hideDeleteModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEditModal();
                this.hideDeleteModal();
            }
        });
    }

    initializeApp() {
        console.log('Initializing app...');
        
        // Check if we have the auth container
        if (!elements.authContainer) {
            console.error('Auth container not found');
            return;
        }

        if (this.authManager.isLoggedIn()) {
            const username = this.authManager.getCurrentUser();
            this.loginUser(username);
        } else {
            this.showAuthContainer();
        }
    }

    // Auth UI methods
    showAuthContainer() {
        console.log('Showing auth container');
        if (elements.authContainer) {
            elements.authContainer.classList.remove('hidden');
        }
        if (elements.appContainer) {
            elements.appContainer.classList.add('hidden');
        }
        this.showLoginForm();
    }

    showAppContainer() {
        if (elements.authContainer) {
            elements.authContainer.classList.add('hidden');
        }
        if (elements.appContainer) {
            elements.appContainer.classList.remove('hidden');
        }
    }

    showLoginForm() {
        console.log('Showing login form');
        if (elements.loginSection) {
            elements.loginSection.classList.remove('hidden');
        }
        if (elements.signupSection) {
            elements.signupSection.classList.add('hidden');
        }
        this.clearAuthError();
    }

    showSignupForm() {
        console.log('Showing signup form');
        if (elements.loginSection) {
            elements.loginSection.classList.add('hidden');
        }
        if (elements.signupSection) {
            elements.signupSection.classList.remove('hidden');
        }
        this.clearAuthError();
    }

    showAuthError(message) {
        if (elements.authError) {
            elements.authError.textContent = message;
            elements.authError.classList.remove('hidden');
        }
    }

    clearAuthError() {
        if (elements.authError) {
            elements.authError.classList.add('hidden');
            elements.authError.textContent = '';
        }
    }

    // Auth handlers
    handleLogin() {
        const formData = new FormData(elements.loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const authenticatedUser = this.authManager.login(username, password);
            this.loginUser(authenticatedUser);
        } catch (error) {
            this.showAuthError(error.message);
        }
    }

    handleSignup() {
        console.log('Handling signup...');
        const formData = new FormData(elements.signupForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        try {
            const newUser = this.authManager.signup(username, password, confirmPassword);
            this.loginUser(newUser);
        } catch (error) {
            console.error('Signup error:', error);
            this.showAuthError(error.message);
        }
    }

    loginUser(username) {
        currentUser = username;
        expenseTracker = new ExpenseTracker(this.authManager.getUserManager(), username);
        
        if (elements.currentUser) {
            elements.currentUser.textContent = username;
        }
        this.showAppContainer();
        this.updateExpenseDisplay();
        
        // Clear forms
        if (elements.loginForm) {
            elements.loginForm.reset();
        }
        if (elements.signupForm) {
            elements.signupForm.reset();
        }
    }

    handleLogout() {
        this.authManager.logout();
        this.showAuthContainer();
        this.clearExpenseForm();
        this.hideEditModal();
        this.hideDeleteModal();
    }

    // Expense UI methods
    handleAddExpense() {
        const description = elements.descriptionInput.value.trim();
        const amount = elements.amountInput.value;

        try {
            const expense = expenseTracker.addExpense(description, amount);
            this.clearExpenseForm();
            this.hideError();
            this.updateExpenseDisplay();
            this.showSuccessMessage(`Added "${expense.description}" - ${formatCurrency(expense.amount)}`);
        } catch (error) {
            this.showError(error.message);
        }
    }

    clearExpenseForm() {
        if (elements.descriptionInput) {
            elements.descriptionInput.value = '';
        }
        if (elements.amountInput) {
            elements.amountInput.value = '';
        }
        if (elements.descriptionInput) {
            elements.descriptionInput.focus();
        }
    }

    showError(message) {
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
        }
    }

    hideError() {
        if (elements.errorMessage) {
            elements.errorMessage.style.display = 'none';
            elements.errorMessage.textContent = '';
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-top: 20px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
            border-left: 4px solid rgba(255, 255, 255, 0.3);
            animation: slideInFromTop 0.3s ease;
        `;
        
        if (elements.expenseForm) {
            elements.expenseForm.appendChild(successDiv);
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 3000);
        }
    }

    updateExpenseDisplay() {
        if (!expenseTracker) return;
        this.updateExpenseList();
        this.updateTotalAmount();
    }

    updateExpenseList() {
        if (!expenseTracker || !elements.expenseList) return;
        
        const expenses = expenseTracker.getAllExpenses();
        
        if (expenses.length === 0) {
            elements.expenseList.style.display = 'none';
            if (elements.emptyState) {
                elements.emptyState.style.display = 'block';
            }
            return;
        }
        
        elements.expenseList.style.display = 'block';
        if (elements.emptyState) {
            elements.emptyState.style.display = 'none';
        }
        
        elements.expenseList.innerHTML = expenses.map(expense => 
            this.createExpenseItemHTML(expense)
        ).join('');
        
        // Add event listeners to action buttons
        this.setupExpenseActionListeners();
    }

    createExpenseItemHTML(expense) {
        return `
            <li class="expense-item" data-expense-id="${expense.id}">
                <div class="expense-details">
                    <div class="expense-description">${this.escapeHTML(expense.description)}</div>
                    <div class="expense-date">${expense.date}</div>
                </div>
                <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                <div class="expense-actions">
                    <button class="action-btn edit-btn" data-expense-id="${expense.id}">Edit</button>
                    <button class="action-btn delete-btn-small" data-expense-id="${expense.id}">Delete</button>
                </div>
            </li>
        `;
    }

    setupExpenseActionListeners() {
        // Edit button listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const expenseId = e.target.getAttribute('data-expense-id');
                this.showEditModal(expenseId);
            });
        });

        // Delete button listeners
        document.querySelectorAll('.delete-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const expenseId = e.target.getAttribute('data-expense-id');
                this.showDeleteModal(expenseId);
            });
        });
    }

    updateTotalAmount() {
        if (!expenseTracker || !elements.totalAmount) return;
        
        const total = expenseTracker.getTotalAmount();
        elements.totalAmount.textContent = formatCurrency(total);
    }

    // Modal methods
    showEditModal(expenseId) {
        if (!expenseTracker || !elements.editModal) return;
        
        const expense = expenseTracker.getExpense(expenseId);
        if (!expense) return;

        currentEditingExpense = expense;
        if (elements.editDescription) {
            elements.editDescription.value = expense.description;
        }
        if (elements.editAmount) {
            elements.editAmount.value = expense.amount;
        }
        elements.editModal.classList.remove('hidden');
        if (elements.editDescription) {
            elements.editDescription.focus();
        }
    }

    hideEditModal() {
        if (elements.editModal) {
            elements.editModal.classList.add('hidden');
        }
        currentEditingExpense = null;
        if (elements.editForm) {
            elements.editForm.reset();
        }
    }

    handleEditExpense() {
        if (!currentEditingExpense || !elements.editDescription || !elements.editAmount) return;

        const description = elements.editDescription.value.trim();
        const amount = elements.editAmount.value;

        try {
            const updatedExpense = expenseTracker.updateExpense(
                currentEditingExpense.id, 
                description, 
                amount
            );
            this.hideEditModal();
            this.updateExpenseDisplay();
            this.showSuccessMessage(`Updated "${updatedExpense.description}" - ${formatCurrency(updatedExpense.amount)}`);
        } catch (error) {
            this.showError(error.message);
        }
    }

    showDeleteModal(expenseId) {
        if (!expenseTracker || !elements.deleteModal) return;
        
        const expense = expenseTracker.getExpense(expenseId);
        if (!expense) return;

        currentEditingExpense = expense;
        if (elements.deleteExpenseDetails) {
            elements.deleteExpenseDetails.innerHTML = `
                <div class="preview-description">${this.escapeHTML(expense.description)}</div>
                <div class="preview-amount">${formatCurrency(expense.amount)}</div>
            `;
        }
        elements.deleteModal.classList.remove('hidden');
    }

    hideDeleteModal() {
        if (elements.deleteModal) {
            elements.deleteModal.classList.add('hidden');
        }
        currentEditingExpense = null;
    }

    handleDeleteExpense() {
        if (!currentEditingExpense) return;

        try {
            const deletedExpense = expenseTracker.deleteExpense(currentEditingExpense.id);
            this.hideDeleteModal();
            this.updateExpenseDisplay();
            this.showSuccessMessage(`Deleted "${deletedExpense.description}" - ${formatCurrency(deletedExpense.amount)}`);
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Utility methods
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, initializing app...');
        new UIManager();
        console.log('Enhanced Expense Tracker initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;">
                <h1>Application Error</h1>
                <p>Failed to initialize the expense tracker. Please refresh the page.</p>
                <p><small>Error: ${error.message}</small></p>
            </div>
        `;
    }
});

// =============================================================================
// TEST FUNCTIONS (for development and debugging)
// =============================================================================

// Test authentication system
function testAuth() {
    console.log('Testing authentication system...');
    const userManager = new UserManager();
    
    try {
        // Test user creation
        const username = userManager.createUser('testuser', 'password123');
        console.log('✓ User created:', username);
        
        // Test authentication
        const authUser = userManager.authenticateUser('testuser', 'password123');
        console.log('✓ User authenticated:', authUser);
        
        // Test wrong password
        try {
            userManager.authenticateUser('testuser', 'wrongpassword');
            console.log('✗ Should have failed with wrong password');
        } catch (error) {
            console.log('✓ Correctly rejected wrong password:', error.message);
        }
        
        console.log('Authentication tests completed successfully');
    } catch (error) {
        console.error('Authentication test failed:', error.message);
    }
}

// Test expense CRUD operations
function testExpenseCRUD() {
    console.log('Testing expense CRUD operations...');
    const userManager = new UserManager();
    
    try {
        // Create test user
        userManager.createUser('crudtest', 'password123');
        const tracker = new ExpenseTracker(userManager, 'crudtest');
        
        // Test Create
        const expense1 = tracker.addExpense('Test Coffee', 4.50);
        console.log('✓ Created expense:', expense1);
        
        // Test Read
        const expenses = tracker.getAllExpenses();
        console.log('✓ Read expenses:', expenses.length);
        
        // Test Update
        const updated = tracker.updateExpense(expense1.id, 'Updated Coffee', 5.00);
        console.log('✓ Updated expense:', updated);
        
        // Test Delete
        const deleted = tracker.deleteExpense(expense1.id);
        console.log('✓ Deleted expense:', deleted);
        
        console.log('CRUD tests completed successfully');
    } catch (error) {
        console.error('CRUD test failed:', error.message);
    }
}

// Make test functions available globally for debugging
window.testAuth = testAuth;
window.testExpenseCRUD = testExpenseCRUD;
