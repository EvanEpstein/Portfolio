document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary DOM elements
    const inputNumberEl = document.getElementById('input-number');
    const fromBaseEl = document.getElementById('from-base');
    const toBaseEl = a= document.getElementById('to-base');
    const errorMessageEl = document.getElementById('error-message');

    // Output elements
    const outputBinaryEl = document.getElementById('output-binary');
    const outputOctalEl = document.getElementById('output-octal');
    const outputHexEl = document.getElementById('output-hex');
    const outputCustomEl = document.getElementById('output-custom');
    const customBaseLabelEl = document.getElementById('custom-base-label');

    // The main function that triggers on any input change
    const updateConversions = () => {
        // Get current values from the input fields
        const numberStr = inputNumberEl.value.trim();
        const fromBase = parseInt(fromBaseEl.value);
        const toBase = parseInt(toBaseEl.value);

        // Clear previous outputs and errors
        errorMessageEl.textContent = '';
        outputBinaryEl.textContent = '...';
        outputOctalEl.textContent = '...';
        outputHexEl.textContent = '...';
        outputCustomEl.textContent = '...';
        
        // Update the custom base label dynamically
        customBaseLabelEl.textContent = `Result (Base ${toBase || '?'})`;

        // If there's no number to convert, do nothing
        if (numberStr === '') {
            return;
        }

        // --- Input Validation ---
        if (isNaN(fromBase) || isNaN(toBase) || fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
            errorMessageEl.textContent = 'Error: Bases must be between 2 and 36.';
            return;
        }

        // Use a regular expression to validate the input number against its base
        // This creates a character set like [0-9a-f] for base 16, or [01] for base 2
        const validChars = '0123456789abcdefghijklmnopqrstuvwxyz'.substring(0, fromBase);
        const validationRegex = new RegExp(`^[${validChars}]+$`, 'i');

        if (!validationRegex.test(numberStr)) {
            errorMessageEl.textContent = `Error: Invalid digit for base ${fromBase}.`;
            return;
        }

        // --- Conversion Logic ---
        // Step 1: Parse the input string from its original base into a standard base-10 number.
        const decimalValue = parseInt(numberStr, fromBase);

        // Check if parsing resulted in a valid number (it might be too large)
        if (isNaN(decimalValue)) {
            errorMessageEl.textContent = 'Error: Could not parse number. It might be too large.';
            return;
        }

        // Step 2: Convert the base-10 number to the target bases and display them.
        outputBinaryEl.textContent = decimalValue.toString(2).toUpperCase();
        outputOctalEl.textContent = decimalValue.toString(8).toUpperCase();
        outputHexEl.textContent = decimalValue.toString(16).toUpperCase();
        outputCustomEl.textContent = decimalValue.toString(toBase).toUpperCase();
    };

    // Add event listeners to all input fields to trigger the conversion function
    inputNumberEl.addEventListener('input', updateConversions);
    fromBaseEl.addEventListener('input', updateConversions);
    toBaseEl.addEventListener('input', updateConversions);

    // Run the function once on page load to initialize
    updateConversions();
});
