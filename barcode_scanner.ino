#define RX_PIN 2 // Papalitan na lang
#define TX_PIN 3 // Papalitan na lang

#include <SoftwareSerial.h>

SoftwareSerial barcodeScanner(RX_PIN, TX_PIN);

String inputBuffer = "";
boolean completeData = false;

void setup() {
  Serial.begin(9600);
  
  barcodeScanner.begin(9600);
  
  Serial.println("Barcode Scanner System Initialized");
}

void loop() {
  while (barcodeScanner.available() > 0) {
    char inChar = (char)barcodeScanner.read();
    
    if (inChar == '\r' || inChar == '\n') {
      if (inputBuffer.length() > 0) {
        completeData = true;
      }
    } else {
      inputBuffer += inChar;
    }
  }
  
  if (completeData) {
    Serial.print("BARCODE:");
    Serial.println(inputBuffer);

    inputBuffer = "";
    completeData = false;
  }

  while (Serial.available() > 0) {
    char inChar = (char)Serial.read();
  }
  
  delay(10);
} 