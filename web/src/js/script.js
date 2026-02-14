// Calculator App
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.result = document.getElementById('result');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.updateDisplay();
    }

    appendNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = String(num);
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0' && num !== '.') {
                this.currentValue = String(num);
            } else if (num === '.' && this.currentValue.includes('.')) {
                return; // Prevent duplicate decimal points
            } else {
                this.currentValue += String(num);
            }
        }
        this.updateDisplay();
        this.result.textContent = '';
    }

    appendOperator(op) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetDisplay = true;
        this.result.textContent = '';
    }

    calculate() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }

        let calculation;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) {
            this.result.textContent = 'Error: Invalid input';
            return;
        }

        switch (this.operation) {
            case '+':
                calculation = prev + current;
                break;
            case '-':
                calculation = prev - current;
                break;
            case '*':
                calculation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError('Error: Division by zero');
                    return;
                }
                calculation = prev / current;
                break;
            default:
                return;
        }

        // Format result
        const formattedResult = Math.round(calculation * 100000000) / 100000000;
        this.currentValue = String(formattedResult);
        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        
        this.updateDisplay();
        this.showSuccess(`${prev} ${this.operation} ${current} = ${formattedResult}`);
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
        this.result.textContent = '';
    }

    deleteLast() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
        this.result.textContent = '';
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }

    showError(message) {
        this.result.textContent = message;
        this.result.className = 'result error';
        setTimeout(() => {
            this.result.textContent = '';
            this.result.className = '';
        }, 3000);
        this.clear();
    }

    showSuccess(message) {
        this.result.textContent = message;
        this.result.className = 'result success';
    }
}

// Initialize calculator
let calc;
document.addEventListener('DOMContentLoaded', function() {
    calc = new Calculator();
    console.log('Calculator initialized successfully!');
});

// Global functions for button onclick handlers
function appendNumber(num) {
    if (calc) calc.appendNumber(num);
}

function appendOperator(op) {
    if (calc) calc.appendOperator(op);
}

function calculate() {
    if (calc) calc.calculate();
}

function clearDisplay() {
    if (calc) calc.clear();
}

function deleteLastChar() {
    if (calc) calc.deleteLast();
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
