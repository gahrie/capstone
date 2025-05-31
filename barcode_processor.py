import serial
import time
import re
import requests
import argparse
import logging
from urllib.parse import urlparse, parse_qs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("barcode_processor.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("BarcodeProcessor")

class BarcodeProcessor:
    def __init__(self, port, baud_rate=9600):
        self.port = port
        self.baud_rate = baud_rate
        self.serial_conn = None
        self.base_url = None
        
    def connect(self):
        try:
            self.serial_conn = serial.Serial(self.port, self.baud_rate, timeout=1)
            logger.info(f"Connected to Arduino on {self.port}")
            time.sleep(2)
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Arduino: {e}")
            return False
            
    def process_barcode(self, barcode_data):
        logger.info(f"Processing barcode: {barcode_data}")
        
        if barcode_data.startswith(('http://', 'https://')):
            url = barcode_data
        else:
            logger.info(f"Barcode is not a URL, treating as ID: {barcode_data}")
            if self.base_url:
                url = f"{self.base_url}/api/timelogs/toggle/{barcode_data}"
            else:
                return False, f"Not a URL and no base URL configured: {barcode_data}"
        
        try:
            response = requests.post(url, timeout=10)
            logger.info(f"Request sent to {url} - Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                try:
                    action = response.json().get('action', 'processed')
                    return True, f"Successfully {action}: {url}"
                except:
                    return True, f"Successfully processed: {url}"
            else:
                return False, f"Request failed with status code: {response.status_code}"
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {e}")
            return False, f"Request error: {e}"
    
    def run(self):
        if not self.serial_conn and not self.connect():
            logger.error("Cannot start processing without serial connection")
            return
            
        logger.info("Starting barcode processing loop. Press Ctrl+C to exit.")
        
        try:
            while True:
                if self.serial_conn.in_waiting > 0:
                    line = self.serial_conn.readline().decode('utf-8').strip()
                    if line.startswith("BARCODE:"):
                        barcode_data = line[8:]
                        success, message = self.process_barcode(barcode_data)
                        logger.info(message)
                time.sleep(0.1)
                
        except KeyboardInterrupt:
            logger.info("Stopping barcode processor...")
        except Exception as e:
            logger.error(f"Error in processing loop: {e}")
        finally:
            if self.serial_conn:
                self.serial_conn.close()
                logger.info("Serial connection closed")

def main():
    parser = argparse.ArgumentParser(description="Barcode Scanner Processor")
    parser.add_argument("--port", required=True, help="Serial port (e.g., COM3 on Windows, /dev/ttyUSB0 on Linux)")
    parser.add_argument("--baud", type=int, default=9600, help="Baud rate (default: 9600)")
    parser.add_argument("--base-url", help="Base URL for non-URL barcodes (e.g., http://localhost:3000)")
    
    args = parser.parse_args()
    
    processor = BarcodeProcessor(args.port, args.baud)
    if args.base_url:
        processor.base_url = args.base_url
    
    processor.run()

if __name__ == "__main__":
    main() 