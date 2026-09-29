const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const historyContainer = document.getElementById("history");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

const themeButton = document.getElementById("theme-btn");
const clearHistoryButton = document.getElementById("clear-history");

let currentValue = "";
let previousValue = "";
let operator = null;
let resetScreen = false;


// ===============================
// Number Input
// ===============================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        if (resetScreen) {
            currentValue = "";
            resetScreen = false;
        }

        if (number === "." && currentValue.includes(".")) {
            return;
        }

        if (currentValue === "0" && number !== ".") {
            currentValue = "";
        }

        currentValue += number;

        updateDisplay();
    });
});


// ===============================
// Operator Input
// ===============================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (currentValue === "") {
            return;
        }

        if (operator !== null) {
            calculate();
        }

        previousValue = currentValue;
        operator = button.dataset.operator;

        resetScreen = true;

        updateDisplay();
    });
});


// ===============================
// Actions
// ===============================

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        else if (action === "delete") {
            deleteNumber();
        }

        else if (action === "percent") {
            calculatePercentage();
        }

        else if (action === "calculate") {
            calculate();
        }
    });
});


// ===============================
// Calculation
// ===============================

function calculate() {

    if (operator === null || previousValue === "" || currentValue === "") {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;
    }

    result = parseFloat(result.toFixed(10));

    const expression =
        `${firstNumber} ${getOperatorSymbol(operator)} ${secondNumber} = ${result}`;

    addToHistory(expression);

    currentValue = result.toString();
    previousValue = "";
    operator = null;
    resetScreen = true;

    updateDisplay();
}


// ===============================
// Percentage
// ===============================

function calculatePercentage() {

    if (currentValue === "") {
        return;
    }

    const value = parseFloat(currentValue);

    currentValue = (value / 100).toString();

    updateDisplay();
}


// ===============================
// Delete
// ===============================

function deleteNumber() {

    if (resetScreen) {
        return;
    }

    currentValue = currentValue.slice(0, -1);

    if (currentValue === "") {
        currentValue = "0";
    }

    updateDisplay();
}


// ===============================
// Clear Calculator
// ===============================

function clearCalculator() {

    currentValue = "";
    previousValue = "";
    operator = null;
    resetScreen = false;

    updateDisplay();
}


// ===============================
// Display
// ===============================

function updateDisplay() {

    currentDisplay.textContent =
        currentValue || "0";

    if (operator && previousValue) {

        previousDisplay.textContent =
            `${previousValue} ${getOperatorSymbol(operator)}`;

    } else {

        previousDisplay.textContent = "";
    }
}


// ===============================
// Operator Symbols
// ===============================

function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator];
}


// ===============================
// History
// ===============================

function addToHistory(expression) {

    const item = document.createElement("div");

    item.classList.add("history-item");

    item.textContent = expression;

    historyContainer.prepend(item);
}


// ===============================
// Clear History
// ===============================

clearHistoryButton.addEventListener("click", () => {

    historyContainer.innerHTML = "";
});


// ===============================
// Dark Mode
// ===============================

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "☀";
    } else {
        themeButton.textContent = "☾";
    }
});


// ===============================
// Keyboard Support
// ===============================

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        handleKeyboardNumber(key);
    }

    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        handleKeyboardOperator(key);
    }

    else if (key === "Enter" || key === "=") {

        calculate();
    }

    else if (key === "Backspace") {

        deleteNumber();
    }

    else if (key === "Escape") {

        clearCalculator();
    }

    else if (key === "%") {

        calculatePercentage();
    }
});


// ===============================
// Keyboard Number
// ===============================

function handleKeyboardNumber(number) {

    if (resetScreen) {
        currentValue = "";
        resetScreen = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = "";
    }

    currentValue += number;

    updateDisplay();
}


// ===============================
// Keyboard Operator
// ===============================

function handleKeyboardOperator(selectedOperator) {

    if (currentValue === "") {
        return;
    }

    if (operator !== null) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    resetScreen = true;

    updateDisplay();
}


// Initial Display

updateDisplay();