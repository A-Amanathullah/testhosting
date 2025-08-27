import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, Camera, CheckCircle } from 'lucide-react';
import RealQRScanner from './RealQRScanner';

const QRScannerSimple = ({ isOpen, onClose, onScanResult }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const qrDetectorRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  useEffect(() => {
    // Initialize Real QR scanner
    qrDetectorRef.current = new RealQRScanner();
    
    // Check when library is loaded
    const checkLibrary = setInterval(() => {
      if (window.jsQR) {
        setLibraryLoading(false);
        clearInterval(checkLibrary);
      }
    }, 500);
    
    // Cleanup after 10 seconds
    setTimeout(() => {
      clearInterval(checkLibrary);
      setLibraryLoading(false);
    }, 10000);
    
  }, []);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Use back camera
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Just load the video, don't auto-start scanning
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          // Don't auto-start scanning - user must click "Scan QR Code"
        };
      }

    } catch (err) {
      console.error('Camera error:', err);
      setIsLoading(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application.');
      } else {
        setError('Unable to access camera. Please check permissions and try again.');
      }
    }
  };

  const startQRDetection = () => {
    if (!videoRef.current || !qrDetectorRef.current) return;

    setIsScanning(true);
    let scanCount = 0;
    const maxScans = 10; // Stop after 10 attempts
    
    // Start scanning every 1500ms (slower to be more careful)
    scanIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        scanCount++;
        console.log(`QR scan attempt ${scanCount}/${maxScans}...`);
        
        try {
          const result = await qrDetectorRef.current.detectWithWebAPI(videoRef.current);
          
          if (result && result.rawValue && !scanResult) {
            console.log('🎯 REAL QR Code detected:', result.rawValue);
            console.log('📄 Full data:', result);
            
            // Parse and display the actual QR content
            const qrContent = result.rawValue;
            let displayData = qrContent;
            
            // Try to parse if it's JSON
            try {
              const parsed = JSON.parse(qrContent);
              displayData = `JSON Data: ${JSON.stringify(parsed, null, 2)}`;
            } catch (e) {
              // Not JSON, show as-is
              displayData = `Text Data: ${qrContent}`;
            }
            
            setScanResult(displayData);
            stopQRDetection();
            
            // Auto-close after showing the real data
            setTimeout(() => {
              onScanResult(qrContent); // Pass the original QR content
              handleClose();
            }, 3000); // Longer delay to show the actual content
          } else if (scanCount >= maxScans) {
            console.log('❌ No valid QR code found after maximum attempts');
            setError('No QR code detected. Please ensure the QR code is clear and well-lit.');
            stopQRDetection();
          }
        } catch (error) {
          console.error('QR detection error:', error);
          if (scanCount >= maxScans) {
            stopQRDetection();
          }
        }
      }
    }, 1500); // Increased from 1000ms to 1500ms
  };

  const stopQRDetection = () => {
    setIsScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  };

  const stopCamera = () => {
    stopQRDetection();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setError(null);
    onClose();
  };

  const handleManualInput = () => {
    const input = prompt('Enter QR code value manually:');
    if (input && input.trim()) {
      setScanResult(input);
      stopQRDetection();
      setTimeout(() => {
        onScanResult(input);
        handleClose();
      }, 1500);
    }
  };

  const retryCamera = () => {
    setError(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${scanResult ? 'bg-green-100' : 'bg-purple-100'}`}>
              {scanResult ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <QrCode className="w-6 h-6 text-purple-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {scanResult ? 'QR Code Detected!' : 'QR Scanner'}
              </h2>
              <p className="text-sm text-gray-600">
                {scanResult ? 'Processing scan result...' : 'Scan ticket or boarding pass'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="bg-white px-6 pb-6">
          {error ? (
            <div className="aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-8">
              <div className="p-4 bg-red-100 rounded-full mb-4">
                <Camera className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button
                onClick={retryCamera}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="relative aspect-square bg-black rounded-2xl overflow-hidden">
              {/* Loading state */}
              {isLoading && (
                <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                    <p className="text-white text-sm">Starting camera...</p>
                  </div>
                </div>
              )}

              {/* Success overlay */}
              {scanResult && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-95 flex items-center justify-center z-20 p-4">
                  <div className="text-center text-white max-w-sm">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-bold mb-2">QR Code Scanned!</p>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto">
                      <p className="text-xs font-mono text-left break-all">
                        {scanResult}
                      </p>
                    </div>
                    <p className="text-sm opacity-90">Processing...</p>
                  </div>
                </div>
              )}
              
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                autoPlay
                playsInline
                muted
              />
              
              {/* Instructions overlay */}
              {!isLoading && !scanResult && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white">
                    <div className="relative w-64 h-64 border-2 border-white rounded-2xl mb-4 opacity-50">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-purple-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-purple-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-purple-400 rounded-br-lg"></div>
                      
                      {/* Scanning line animation */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent ${isScanning ? 'animate-pulse' : ''}`}></div>
                    </div>
                    <p className="text-lg font-semibold mb-1">Point camera at QR code</p>
                    <p className="text-sm opacity-75 mb-4">
                      {isScanning ? 'Scanning for QR codes...' : 'Position QR code in the frame and tap scan'}
                    </p>
                    
                    {/* Manual Scan Button */}
                    {!isScanning && (
                      <button
                        onClick={startQRDetection}
                        disabled={libraryLoading}
                        className={`px-6 py-2 rounded-lg transition-colors pointer-events-auto ${
                          libraryLoading 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {libraryLoading ? 'Loading Scanner...' : 'Scan Real QR Code'}
                      </button>
                    )}
                    
                    {isScanning && (
                      <div className="inline-flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded-full pointer-events-auto">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">Scanning... Hold steady</span>
                        <button
                          onClick={stopQRDetection}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Stop
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions and buttons */}
          {!scanResult && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                {isLoading ? 'Initializing camera...' : 
                 error ? 'Camera access required for scanning' :
                 isScanning ? 'Hold steady - scanning for QR codes' :
                 'Position the QR code within the frame and tap "Scan QR Code"'}
              </p>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleManualInput}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  Manual Input
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerSimple;
