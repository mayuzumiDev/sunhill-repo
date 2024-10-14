import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRCodeScanner = () => {
  const [data, setData] = useState('No result');

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Scan QR Code</h2>
      <div className="w-64 h-64">
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }
            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: '100%' }}
        />
      </div>
      <p className="mt-4 text-lg">{data}</p>
    </div>
  );
};

export default QRCodeScanner;
