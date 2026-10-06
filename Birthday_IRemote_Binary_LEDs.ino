/*
 * FINAL CODE: IR Remote to 7-Segment and Binary LEDs
 * * This sketch listens for an IR remote.
 * - When a number (0-9) is pressed, it displays it on a 1-digit 7-segment display.
 * - It also displays the 4-bit binary version of that number on 4 LEDs.
 * * Assumed Wiring:
 * - IR Receiver Signal Pin -> Pin 11
 * - 7-Segment (a-g) -> Pins 2, 3, 4, 5, 6, 7, 8 (Common Cathode)
 * - 4 Binary LEDs (8, 4, 2, 1) -> Pins 9, 10, 12, 13
 */

#include <IRremote.h>

// --- PIN DEFINITIONS ---
#define IR_RECEIVE_PIN 11

// 1-Digit 7-Segment Display (Pins for segments a, b, c, d, e, f, g)
const int simpleSegmentPins[] = {2, 3, 4, 5, 6, 7, 8};

// 4 LEDs for Binary (Pins for 8, 4, 2, 1 bits)
// (Pin 9=8s, Pin 10=4s, Pin 12=2s, Pin 13=1s)
const int binaryLedPins[] = {9, 10, 12, 13};

// --- DATA PATTERNS ---
// 1-Digit Display (Common Cathode: 1=ON, 0=OFF)
byte decimalPatterns[10][7] = {
  {1, 1, 1, 1, 1, 1, 0}, // 0
  {0, 1, 1, 0, 0, 0, 0}, // 1
  {1, 1, 0, 1, 1, 0, 1}, // 2
  {1, 1, 1, 1, 0, 0, 1}, // 3
  {0, 1, 1, 0, 0, 1, 1}, // 4
  {1, 0, 1, 1, 0, 1, 1}, // 5
  {1, 0, 1, 1, 1, 1, 1}, // 6
  {1, 1, 1, 0, 0, 0, 0}, // 7
  {1, 1, 1, 1, 1, 1, 1}, // 8
  {1, 1, 1, 1, 0, 1, 1}  // 9
};

void setup() {

   Serial.begin(9600); 
  // Start IR Receiver
  IrReceiver.begin(IR_RECEIVE_PIN, false);
  
  // Set all 1-Digit pins to OUTPUT
  for (int i = 0; i < 7; i++) {
    pinMode(simpleSegmentPins[i], OUTPUT);
  }
  
  // Set all 4 Binary LED pins to OUTPUT
  for (int i = 0; i < 4; i++) {
    pinMode(binaryLedPins[i], OUTPUT);
  }

  // Display '0' on both displays to start
  displayDecimal(0);
  displayBinary(0);
}

void loop() {
  // Check if a signal has been received
  if (IrReceiver.decode()) {

    Serial.print("Code: 0x");
    Serial.println(IrReceiver.decodedIRData.decodedRawData, HEX);
    
    int newNumber = 0; // Default to -1 (no valid number)
    
    // Check which button was pressed
    switch (IrReceiver.decodedIRData.decodedRawData) {
      
      // ===============================================
      // !!! REPLACE THESE CODES WITH YOURS !!!
      // ===============================================
      case 0xE916FF00: newNumber = 0; break; 
      case 0xF30CFF00: newNumber = 1; break;
      case 0xE718FF00: newNumber = 2; break;
      case 0xA15EFF00: newNumber = 3; break;
      case 0xF708FF00: newNumber = 4; break;
      case 0xE31CFF00: newNumber = 5; break;
      case 0xA55AFF00: newNumber = 6; break;
      case 0xBD42FF00: newNumber = 7; break;
      case 0xAD52FF00: newNumber = 8; break;
      case 0xB54AFF00: newNumber = 9; break;
    }

    // If a valid number (0-9) was pressed
    if (newNumber >= 0) {
      // Update both displays
    Serial.println(newNumber);
      displayDecimal(newNumber);
      displayBinary(newNumber);
    }
    
    IrReceiver.resume(); // Ready for the next press
  }
}

/**
 * Displays a number (0-9) on the 1-digit 7-segment display.
 */
void displayDecimal(int num) {
  // Set all 7 segments based on the pattern
  for (int i = 0; i < 7; i++) {
    digitalWrite(simpleSegmentPins[i], decimalPatterns[num][i]);
  }
}

/**
 * Displays a number (0-9) in 4-bit binary on the 4 LEDs.
 */
void displayBinary(int num) {
  // Use bitwise math to get each of the 4 bits
  int bit3 = (num >> 3) & 1; // 8s bit
  int bit2 = (num >> 2) & 1; // 4s bit
  int bit1 = (num >> 1) & 1; // 2s bit
  int bit0 = num & 1;        // 1s bit

  // Serial.println("1's bit: " + bit1);

  // Write the state to the LEDs
  digitalWrite(binaryLedPins[0], bit3); // 8s bit
  digitalWrite(binaryLedPins[1], bit2); // 4s bit
  digitalWrite(binaryLedPins[2], bit1); // 2s bit
  digitalWrite(binaryLedPins[3], bit0); // 1s bit
}
