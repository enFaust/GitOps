// Calculator Variables
let display = document.getElementById('display');
let result = document.getElementById('result');
let currentExpression = '';
let lastOperator = '';
let lastValue = '';

// Append number to display
function appendNumber(num) {
    if (display.value === '0') {
        display.value = num;
    } else {
        display.value += num;
    }
    result.textContent = '';
}

// Append operator
function appendOperator(op) {
    if (display.value === '') {
        return;
    }
    
    currentExpression = display.value + ' ' + op + ' ';
    lastOperator = op;
    lastValue = display.value;
    display.value = '';
    result.textContent = '';
}

// Add decimal point
function appendDecimal() {
    if (display.value === '') {
        display.value = '0.';
    } else if (!display.value.includes('.')) {
        display.value += '.';
    }
}

// Clear display
function clearDisplay() {
    display.value = '';
    currentExpression = '';
    lastOperator = '';
    lastValue = '';
    result.textContent = '';
}

// Delete last character
function deleteLastChar() {
    display.value = display.value.toString().slice(0, -1);
    result.textContent = '';
}

// Calculate result
function calculate() {
    if (display.value === '' || lastOperator === '') {
        return;
    }
    
    const num1 = parseFloat(lastValue);
    const num2 = parseFloat(display.value);
    let calculatedResult;
    
    // Perform calculation based on operator
    switch(lastOperator) {
        case '+':
            calculatedResult = num1 + num2;
            break;
        case '-':
            calculatedResult = num1 - num2;
            break;
        case '*':
            calculatedResult = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                showError('Error: Division by zero');
                return;
            }
            calculatedResult = num1 / num2;
            break;
        default:
            return;
    }
    
    // Format result (remove trailing zeros)
    const formattedResult = calculatedResult % 1 !== 0 
        ? calculatedResult.toFixed(10).replace(/\.?0+$/, '')
        : calculatedResult;
    
    display.value = formattedResult;
    showSuccess(`${lastValue} ${lastOperator} ${num2} = ${formattedResult}`);
    
    // Reset for next calculation
    currentExpression = '';
    lastOperator = '';
    lastValue = '';
}

// Show error message
function showError(message) {
    result.textContent = message;
    result.className = 'result error';
    clearDisplay();
    setTimeout(() => {
        result.textContent = '';
        result.className = '';
    }, 3000);
}

// Show success message
function showSuccess(message) {
    result.textContent = message;
    result.className = 'result success';
}

// Smooth scrolling for navigation links
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

// Page load event
window.addEventListener('load', function() {
    console.log('GitOps Calculator loaded successfully!');
});
