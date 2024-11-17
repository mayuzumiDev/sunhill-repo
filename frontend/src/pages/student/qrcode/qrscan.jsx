import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../utils/axiosInstance';
import useLogin from '../../../hooks/useLogin';

const QRCodeScanner = ({ onClose }) => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);
  const navigate = useNavigate();
  const { handleLogin } = useLogin();

  const handleQRCodeResult = async (result) => {
    if (result) {
      try {
        // Parse the QR code data
        const qrData = JSON.parse(result.text);
        
        // Verify the QR code format
        if (!qrData.username || !qrData.password) {
          setError('Invalid QR code format');
          return;
        }

        // Use the existing login hook with QR data
        await handleLogin({
          username: qrData.username,
          password: qrData.password,
          loginPageName: 'student'
        });

        // Stop scanning
        setScanning(false);
        
        // Close the scanner modal
        if (onClose) onClose();
        
        // Success - navigation will be handled by the login hook
      } catch (err) {
        console.error('QR Login Error:', err);
        setError(err.response?.data?.message || 'Failed to authenticate QR code');
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Scan Your Student ID</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {scanning && (
        <div className="w-64 h-64 relative">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                handleQRCodeResult(result);
              }
              if (error) {
                console.info(error);
              }
            }}
            constraints={{
              facingMode: 'environment'
            }}
            className="w-full h-full"
          />
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
          </div>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Position your student ID QR code within the frame
      </p>
    </div>
  );
};

export default QRCodeScanner;
