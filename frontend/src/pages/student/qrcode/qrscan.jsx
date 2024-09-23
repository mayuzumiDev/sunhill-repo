import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

function QRCodeScanner() {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      console.log('Scanned data:', data);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-600">
      {/* Header or title */}
      <h3 className="text-white text-sm mb-4">Align the QR code within the box to auto scan</h3>

      {/* Scanner container styled like the image */}
      <div className="relative w-80 h-80 border-4 border-white rounded-lg overflow-hidden shadow-lg">
        <QrReader
          delay={300}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result?.text);
            }
            if (!!error) {
              handleError(error);
            }
          }}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Scanner overlay box (this creates the effect of a scanner box like the one in the image) */}
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
      </div>

      {/* Scanned result display */}
      {scanResult && (
        <div className="text-green-500 mt-4">
          <p>Scanned Result: {scanResult}</p>
        </div>
      )}
    </div>
  );
}

export default QRCodeScanner;
