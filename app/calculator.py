#!/usr/bin/env python3
"""
Simple Calculator Program
Performs basic arithmetic operations: addition, subtraction, multiplication, and division.
"""

def add(a, b):
    """Add two numbers"""
    return a + b

def subtract(a, b):
    """Subtract two numbers"""
    return a - b

def multiply(a, b):
    """Multiply two numbers"""
    return a * b

def divide(a, b):
    """Divide two numbers"""
    if b == 0:
        return "Error: Division by zero"
    return a / b

def main():
    print("=== Simple Calculator ===")
    
    try:
        num1 = float(input("Enter first number: "))
        operation = input("Enter operation (+, -, *, /): ")
        num2 = float(input("Enter second number: "))
        
        if operation == "+":
            result = add(num1, num2)
        elif operation == "-":
            result = subtract(num1, num2)
        elif operation == "*":
            result = multiply(num1, num2)
        elif operation == "/":
            result = divide(num1, num2)
        else:
            result = "Error: Invalid operation"
        
        print(f"\nResult: {num1} {operation} {num2} = {result}")
    
    except ValueError:
        print("Error: Please enter valid numbers")

if __name__ == "__main__":
    main()
