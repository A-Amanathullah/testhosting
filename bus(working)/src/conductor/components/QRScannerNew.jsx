import React, { useState, useCallback } from 'react';
import { X, QrCode, Camera, CheckCircle } from 'lucide-react';
import { QrScanner } from '@yudiel/react-qr-scanner';

const QRScannerNew = ({ isOpen, onClose, onScanResult }) => {
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = useCallback((result) => {
    if (result && result[0]) {
      const scannedData = result[0].rawValue;
      console.log('QR Code detected:', scannedData);
      setScanResult(scannedData);
      
      // Auto-close after successful scan
      setTimeout(() => {
        onScanResult(scannedData);
        handleClose();
      }, 1500);
    }
  }, [onScanResult]);

  const handleError = useCallback((error) => {
    console.error('QR Scanner error:', error);
    if (error?.name === 'NotAllowedError') {
      setError('Camera permission denied. Please allow camera access and try again.');
    } else if (error?.name === 'NotFoundError') {
      setError('No camera found on this device.');
    } else if (error?.name === 'NotReadableError') {
      setError('Camera is being used by another application.');
    } else {
      setError('Unable to access camera. Please check permissions and try again.');
    }
  }, []);

  const handleClose = useCallback(() => {
    setScanResult(null);
    setError(null);
    onClose();
  }, [onClose]);

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
              
              {!scanResult && (
                <QrScanner
                  onDecode={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment'
                  }}
                  containerStyle={{
                    width: '100%',
                    height: '100%'
                  }}
                  videoStyle={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
              
              {/* Instructions overlay */}
              {!scanResult && !error && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white">
                    <div className="relative w-64 h-64 border-2 border-white rounded-2xl mb-4 opacity-50">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-purple-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-purple-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-purple-400 rounded-br-lg"></div>
                      
                      {/* Scanning line animation */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
                    </div>
                    <p className="text-lg font-semibold mb-1">Point camera at QR code</p>
                    <p className="text-sm opacity-75">Scanner will detect automatically</p>
                  </div>
                </div>
              )}
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

export default QRScannerNew;
