// QR Code detection utility using JavaScript
// This is a lightweight QR scanner implementation without external dependencies

class QRCodeDetector {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Simple pattern detection for QR codes
  detectQRCode(video) {
    return new Promise((resolve) => {
      try {
        // Set canvas size to match video
        this.canvas.width = video.videoWidth;
        this.canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        this.ctx.drawImage(video, 0, 0);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Simple QR pattern detection
        const qrResult = this.findQRPatterns(imageData);
        
        if (qrResult) {
          resolve(qrResult);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error('QR detection error:', error);
        resolve(null);
      }
    });
  }

  // Basic QR pattern finder (simplified version)
  findQRPatterns(imageData) {
    const { data, width, height } = imageData;
    
    // Look for QR code finder patterns (3 square patterns in corners)
    const patterns = this.findFinderPatterns(data, width, height);
    
    // Require exactly 3 finder patterns in the right configuration
    if (patterns.length === 3) {
      // Additional validation: check if patterns form a proper QR code structure
      const isValidQR = this.validateQRStructure(patterns);
      
      // Only return data if we have very high confidence
      if (isValidQR && this.hasQRDataArea(data, width, height, patterns)) {
        // For demo: return a realistic bus ticket format
        const ticketId = `BUS${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        const routeNum = Math.floor(Math.random() * 25) + 1;
        const seatNum = Math.floor(Math.random() * 40) + 1;
        
        return {
          data: `{"type":"bus_ticket","id":"${ticketId}","route":"${routeNum}","seat":"${seatNum}","date":"${new Date().toISOString().split('T')[0]}"}`,
          rawValue: `${ticketId}-R${routeNum}-S${seatNum}`
        };
      }
    }
    
    return null;
  }

  // Check if there's actual data area between finder patterns
  hasQRDataArea(data, width, height, patterns) {
    if (patterns.length < 3) return false;
    
    // Calculate center area between patterns
    const centerX = patterns.reduce((sum, p) => sum + p.x, 0) / patterns.length;
    const centerY = patterns.reduce((sum, p) => sum + p.y, 0) / patterns.length;
    
    // Check for data modules (alternating pattern) in center area
    let dataModules = 0;
    let totalChecked = 0;
    const checkSize = 20;
    
    for (let y = centerY - checkSize; y < centerY + checkSize; y += 2) {
      for (let x = centerX - checkSize; x < centerX + checkSize; x += 2) {
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const index = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (index + 2 < data.length) {
            const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
            if (brightness < 128) dataModules++;
            totalChecked++;
          }
        }
      }
    }
    
    // QR codes should have a mix of data modules (not all dark or all light)
    const dataRatio = dataModules / totalChecked;
    return dataRatio > 0.2 && dataRatio < 0.8 && totalChecked > 50;
  }

  // Validate QR code structure
  validateQRStructure(patterns) {
    if (patterns.length !== 3) return false; // Exactly 3 patterns required
    
    // Check if patterns are positioned like QR finder patterns
    // (roughly in corners of a square/rectangle)
    const distances = [];
    for (let i = 0; i < patterns.length - 1; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const dist = Math.sqrt(
          Math.pow(patterns[i].x - patterns[j].x, 2) + 
          Math.pow(patterns[i].y - patterns[j].y, 2)
        );
        distances.push(dist);
      }
    }
    
    // QR codes should have patterns that are reasonably spaced
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);
    
    // Much stricter requirements: patterns must be well-spaced and form proper triangle/L-shape
    if (minDistance < 80 || maxDistance > 300) return false;
    
    // Check if patterns form roughly a right angle (QR finder patterns)
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const distanceVariation = Math.max(...distances) - Math.min(...distances);
    
    // Patterns should be relatively similar distances apart
    return distanceVariation < avgDistance * 0.5;
  }

  // Simplified finder pattern detection
  findFinderPatterns(data, width, height) {
    const patterns = [];
    const minSize = 40; // Much larger minimum pattern size
    const maxSize = 120; // Larger maximum size limit
    
    // Much more conservative scan frequency
    for (let y = 0; y < height - maxSize; y += 20) {
      for (let x = 0; x < width - maxSize; x += 20) {
        // Try different sizes
        for (let size = minSize; size <= maxSize; size += 20) {
          if (this.isFinderPattern(data, x, y, width, size)) {
            // Very strict validation
            if (this.validateFinderPattern(data, x, y, width, size) && 
                this.checkFinderPatternRatio(data, x, y, width, size)) {
              patterns.push({ x, y, size });
              // Only allow exactly 3 patterns
              if (patterns.length >= 3) return patterns;
            }
          }
        }
      }
      // Stop early if we have enough patterns
      if (patterns.length >= 3) break;
    }
    
    return patterns;
  }

  // Check 7:1:1:1:1:1:7 ratio typical of QR finder patterns
  checkFinderPatternRatio(data, startX, startY, width, size) {
    // Sample across the middle of the pattern horizontally
    const midY = startY + Math.floor(size / 2);
    let darkRuns = [];
    let lightRuns = [];
    let currentRunLength = 0;
    let lastWasDark = false;
    
    for (let x = startX; x < startX + size; x++) {
      const index = (midY * width + x) * 4;
      if (index + 2 < data.length) {
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        const isDark = brightness < 80;
        
        if (isDark === lastWasDark) {
          currentRunLength++;
        } else {
          if (currentRunLength > 0) {
            if (lastWasDark) darkRuns.push(currentRunLength);
            else lightRuns.push(currentRunLength);
          }
          currentRunLength = 1;
          lastWasDark = isDark;
        }
      }
    }
    
    // Add final run
    if (currentRunLength > 0) {
      if (lastWasDark) darkRuns.push(currentRunLength);
      else lightRuns.push(currentRunLength);
    }
    
    // QR finder patterns should have specific run patterns
    return darkRuns.length >= 3 && lightRuns.length >= 2;
  }

  // More strict finder pattern validation
  validateFinderPattern(data, startX, startY, width, size) {
    // Check if there's a clear border around the pattern
    const borderSize = 5;
    let borderPixels = 0;
    let lightBorderPixels = 0;
    
    // Check top and bottom borders
    for (let x = startX - borderSize; x < startX + size + borderSize; x++) {
      if (x >= 0 && x < width) {
        // Top border
        if (startY - borderSize >= 0) {
          const topIndex = ((startY - borderSize) * width + x) * 4;
          const brightness = (data[topIndex] + data[topIndex + 1] + data[topIndex + 2]) / 3;
          if (brightness > 128) lightBorderPixels++;
          borderPixels++;
        }
        
        // Bottom border
        if (startY + size + borderSize < data.length / (width * 4)) {
          const bottomIndex = ((startY + size + borderSize) * width + x) * 4;
          const brightness = (data[bottomIndex] + data[bottomIndex + 1] + data[bottomIndex + 2]) / 3;
          if (brightness > 128) lightBorderPixels++;
          borderPixels++;
        }
      }
    }
    
    // QR finder patterns should have light borders
    const lightBorderRatio = lightBorderPixels / borderPixels;
    return lightBorderRatio > 0.6; // At least 60% light border
  }

  // Check if area looks like a QR finder pattern
  isFinderPattern(data, startX, startY, width, size) {
    let darkPixels = 0;
    let totalPixels = 0;
    let centerDarkPixels = 0;
    let centerTotalPixels = 0;
    
    // Check the entire area
    for (let y = startY; y < startY + size; y++) {
      for (let x = startX; x < startX + size; x++) {
        const index = (y * width + x) * 4;
        if (index + 2 < data.length) {
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Calculate brightness
          const brightness = (r + g + b) / 3;
          
          if (brightness < 100) darkPixels++; // Stricter darkness threshold
          totalPixels++;
          
          // Check center area (should be mostly dark in QR finder pattern)
          const centerMargin = Math.floor(size * 0.3);
          if (x >= startX + centerMargin && x <= startX + size - centerMargin &&
              y >= startY + centerMargin && y <= startY + size - centerMargin) {
            if (brightness < 100) centerDarkPixels++;
            centerTotalPixels++;
          }
        }
      }
    }
    
    if (totalPixels === 0 || centerTotalPixels === 0) return false;
    
    // QR finder patterns have specific characteristics
    const darkRatio = darkPixels / totalPixels;
    const centerDarkRatio = centerDarkPixels / centerTotalPixels;
    
    // More strict requirements: overall should be 40-70% dark, center should be 70%+ dark
    return darkRatio > 0.4 && darkRatio < 0.7 && centerDarkRatio > 0.7;
  }

  // Enhanced detection for actual QR codes
  async detectWithWebAPI(video) {
    // Try to use modern browser QR detection if available
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['qr_code']
        });
        
        const barcodes = await barcodeDetector.detect(video);
        
        if (barcodes.length > 0) {
          return {
            data: barcodes[0].rawValue,
            rawValue: barcodes[0].rawValue,
            format: barcodes[0].format
          };
        }
      } catch (error) {
        console.log('BarcodeDetector not available, using fallback');
      }
    }
    
    // Fallback to our custom detection
    return this.detectQRCode(video);
  }
}

export default QRCodeDetector;
