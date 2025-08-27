import React, { useEffect, useRef, useState } from 'react';
import { X, QrCode, Camera, CheckCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScannerHTML5 = ({ isOpen, onClose, onScanResult }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (isOpen && !html5QrcodeScannerRef.current) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        facingMode: 'environment',
      };

      const onScanSuccess = (decodedText, decodedResult) => {
        console.log('QR Code detected:', decodedText);
        setScanResult(decodedText);
        
        // Stop scanning
        if (html5QrcodeScannerRef.current) {
          html5QrcodeScannerRef.current.clear();
        }
        
        // Auto-close after successful scan
        setTimeout(() => {
          onScanResult(decodedText);
          handleClose();
        }, 1500);
      };

      const onScanError = (error) => {
        // Ignore scanning errors - they're normal when no QR code is in view
        console.debug('QR scan error:', error);
      };

      try {
        html5QrcodeScannerRef.current = new Html5QrcodeScanner(
          'qr-reader',
          config,
          false
        );
        html5QrcodeScannerRef.current.render(onScanSuccess, onScanError);
      } catch (err) {
        console.error('Error starting QR scanner:', err);
        setError('Failed to start camera. Please check permissions and try again.');
      }
    }

    return () => {
      if (html5QrcodeScannerRef.current) {
        try {
          html5QrcodeScannerRef.current.clear();
          html5QrcodeScannerRef.current = null;
        } catch (err) {
          console.warn('Error clearing scanner:', err);
        }
      }
    };
  }, [isOpen, onScanResult]);

  const handleClose = () => {
    if (html5QrcodeScannerRef.current) {
      try {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      } catch (err) {
        console.warn('Error clearing scanner on close:', err);
      }
    }
    setScanResult(null);
    setError(null);
    onClose();
  };

  const handleManualInput = () => {
    const input = prompt('Enter QR code value manually:');
    if (input) {
      onScanResult(input);
      handleClose();
    }
  };

  const retryCamera = () => {
    setError(null);
    setScanResult(null);
    // The scanner will auto-restart due to useEffect dependency
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
            <div className="relative bg-black rounded-2xl overflow-hidden">
              {/* Success overlay */}
              {scanResult && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center z-20">
                  <div className="text-center text-white">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-bold mb-2">QR Code Scanned!</p>
                    <p className="text-sm opacity-90">Processing result...</p>
                  </div>
                </div>
              )}
              
              {/* QR Scanner Container */}
              <div 
                id="qr-reader" 
                ref={scannerRef}
                className="w-full"
                style={{ minHeight: '400px' }}
              />
            </div>
          )}

          {/* Instructions and buttons */}
          {!scanResult && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-4">
                {error ? 'Camera access required for scanning' :
                 'Position the QR code within the frame to scan'}
              </p>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleManualInput}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Manual Input
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
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

export default QRScannerHTML5;
