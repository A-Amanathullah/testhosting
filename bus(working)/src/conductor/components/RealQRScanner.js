// Real QR Code Scanner using jsQR library
// This will read actual QR code data instead of generating fake data

class RealQRScanner {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.jsQRLoaded = false;
    this.loadJsQR();
  }

  // Load jsQR library dynamically
  async loadJsQR() {
    try {
      if (window.jsQR) {
        this.jsQRLoaded = true;
        return;
      }

      // Load jsQR from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      script.onload = () => {
        this.jsQRLoaded = true;
        console.log('✅ jsQR library loaded successfully');
      };
      script.onerror = () => {
        console.error('❌ Failed to load jsQR library');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading jsQR:', error);
    }
  }

  // Scan for real QR codes in video stream
  async scanQRCode(video) {
    try {
      if (!this.jsQRLoaded || !window.jsQR) {
        console.log('⏳ jsQR library not loaded yet, waiting...');
        return null;
      }

      // Set canvas size to match video
      this.canvas.width = video.videoWidth || video.width;
      this.canvas.height = video.videoHeight || video.height;

      if (this.canvas.width === 0 || this.canvas.height === 0) {
        return null;
      }

      // Draw current video frame to canvas
      this.ctx.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);

      // Get image data
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      // Use jsQR to decode the QR code
      const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log('🎯 Real QR Code Found!');
        console.log('📄 QR Content:', code.data);
        console.log('📍 QR Location:', code.location);
        
        return {
          data: code.data,
          rawValue: code.data,
          location: code.location,
          isReal: true
        };
      }

      return null;
    } catch (error) {
      console.error('QR scanning error:', error);
      return null;
    }
  }

  // Enhanced detection with multiple attempts
  async detectWithWebAPI(video) {
    // First try native BarcodeDetector if available
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['qr_code']
        });
        
        const barcodes = await barcodeDetector.detect(video);
        
        if (barcodes.length > 0) {
          console.log('🔍 Native BarcodeDetector found QR:', barcodes[0].rawValue);
          return {
            data: barcodes[0].rawValue,
            rawValue: barcodes[0].rawValue,
            format: barcodes[0].format,
            isReal: true,
            source: 'BarcodeDetector'
          };
        }
      } catch (error) {
        console.log('BarcodeDetector not available, using jsQR fallback');
      }
    }
    
    // Fallback to jsQR
    return this.scanQRCode(video);
  }
}

export default RealQRScanner;
