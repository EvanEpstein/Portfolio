// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Constants ---
    const ROWS = 5;
    const COLS = 5;
    const ON_COLOR = 'rgb(255, 0, 0)'; // Red
    const OFF_COLOR = 'rgb(240, 240, 240)'; // Light Gray
    const WIN_COLOR = 'rgb(0, 255, 0)'; // Green
    const WIN_ALT_COLOR = 'rgb(0, 0, 255)'; // Blue

    // --- Game State Variables ---
    let attempts = 0;
    let buttons = []; // 2D array to hold button elements
    let isGameWon = false;

    // --- DOM Element References ---
    const gamePanel = document.getElementById('game-panel');
    const messageLabel = document.getElementById('message-label');
    const resetButton = document.getElementById('reset-button');

    /**
     * Toggles the color of a single button between ON and OFF.
     * @param {HTMLElement} button The button element to switch.
     */
    const switchLight = (button) => {
        if (button.style.backgroundColor === ON_COLOR) {
            button.style.backgroundColor = OFF_COLOR;
        } else {
            button.style.backgroundColor = ON_COLOR;
        }
    };

    /**
     * Checks if all lights are off, indicating a win.
     * @returns {boolean} True if the game is won, false otherwise.
     */
    const isWin = () => {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (buttons[r][c].style.backgroundColor === ON_COLOR) {
                    return false; // Found a light that is still on
                }
            }
        }
        return true;
    };

    /**
     * Executes the winning sequence visual and updates the message.
     */
    const doWinStuff = () => {
        isGameWon = true;
        messageLabel.textContent = `WIN! moves: ${attempts}`;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (r % 2 === 0) {
                    buttons[r][c].style.backgroundColor = WIN_COLOR;
                } else {
                    buttons[r][c].style.backgroundColor = WIN_ALT_COLOR;
                }
            }
        }
    };

    /**
     * Toggles the clicked button and its adjacent neighbors.
     * @param {number} r The row of the clicked button.
     * @param {number} c The column of the clicked button.
     */
    const makeMove = (r, c) => {
        switchLight(buttons[r][c]);
        if (r > 0) switchLight(buttons[r - 1][c]); // Top
        if (r < ROWS - 1) switchLight(buttons[r + 1][c]); // Bottom
        if (c > 0) switchLight(buttons[r][c - 1]); // Left
        if (c < COLS - 1) switchLight(buttons[r][c + 1]); // Right
    };

    /**
     * Turns all lights off.
     */
    const wipeBoard = () => {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                buttons[r][c].style.backgroundColor = OFF_COLOR;
            }
        }
    };

    /**
     * Sets up a new game by making random moves.
     */
    const startGame = () => {
        isGameWon = false;
        // The original code had a 'normal' vs 'difficult' option.
        // This version defaults to the 'difficult' (8 moves) setup.
        for (let i = 0; i < 8; i++) {
            const randomRow = Math.floor(Math.random() * ROWS);
            const randomCol = Math.floor(Math.random() * COLS);
            makeMove(randomRow, randomCol);
        }

        // It's possible for the random setup to result in an instant win.
        // If so, just make one more move to ensure there's a puzzle.
        if (isWin()) {
            makeMove(0, 0);
        }
    };

    /**
     * Handles the click event for any game button.
     * @param {number} row The row of the clicked button.
     * @param {number} col The column of the clicked button.
     */
    const onButtonClick = (row, col) => {
        if (!isGameWon) {
            makeMove(row, col);
            attempts++;
            messageLabel.textContent = `Moves: ${attempts}`;
        }

        // Check for a win after the move
        if (!isGameWon && isWin()) {
            doWinStuff();
        }
    };


    /**
     * Resets the entire game to a new random state.
     */
    const resetGame = () => {
        wipeBoard();
        startGame();
        attempts = 0;
        messageLabel.textContent = "WELCOME!";
    };

    /**
     * Initializes the game board, creates buttons, and sets up event listeners.
     */
    const initializeGame = () => {
        // Create the 2D array and the button elements
        for (let r = 0; r < ROWS; r++) {
            buttons[r] = []; // Initialize inner array
            for (let c = 0; c < COLS; c++) {
                const button = document.createElement('button');
                button.classList.add('game-button');
                button.style.backgroundColor = OFF_COLOR;

                // Use a closure to capture the correct row and column for the event listener
                button.addEventListener('click', () => onButtonClick(r, c));

                gamePanel.appendChild(button);
                buttons[r][c] = button;
            }
        }

        // Set up the reset button
        resetButton.addEventListener('click', resetGame);

        // Start the first game
        resetGame();
    };

    // --- Start the Game ---
    initializeGame();
});
