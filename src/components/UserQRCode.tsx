import React, { useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, RefreshCw, X } from 'lucide-react';
import { QRCodeService } from '../services/QRCodeService';

interface UserQRCodeProps {
  userData: {
    name: string;
    email: string;
    registrationDate?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const UserQRCode: React.FC<UserQRCodeProps> = ({ userData, isOpen, onClose }) => {
  const [qrData, setQrData] = useState<{
    qrCodeDataUrl: string;
    registrationId: string;
    checkInCode: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'id' | 'code' | null>(null);

  useEffect(() => {
    if (isOpen && userData) {
      generateQRCode();
    }
  }, [isOpen, userData]);

  const generateQRCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await QRCodeService.generateQRCode(userData);
      setQrData(result);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      console.error('QR generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrData) return;
    
    const link = document.createElement('a');
    link.download = `TechHack2025_QR_${qrData.registrationId}.png`;
    link.href = qrData.qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async (text: string, type: 'id' | 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center">
              <QrCode className="w-6 h-6 text-[#E63946] mr-2" />
              Your Event QR Code
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
                  <RefreshCw className="w-8 h-8 text-[#E63946] animate-spin" />
                </div>
                <p className="text-gray-400">Generating your unique QR code...</p>
              </div>
            )}

            {error && (
              <div className="text-center">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-red-400">{error}</p>
                </div>
                <button
                  onClick={generateQRCode}
                  className="bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {qrData && !isLoading && (
              <>
                {/* QR Code Display */}
                <div className="text-center">
                  <div className="inline-block bg-white p-4 rounded-xl mb-4">
                    <img 
                      src={qrData.qrCodeDataUrl} 
                      alt="User QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Scan this QR code for event check-in and identification
                  </p>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Registration ID</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm">
                        #{qrData.registrationId}
                      </div>
                      <button
                        onClick={() => copyToClipboard(qrData.registrationId, 'id')}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                      >
                        {copied === 'id' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-in Code</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm">
                        {qrData.checkInCode}
                      </div>
                      <button
                        onClick={() => copyToClipboard(qrData.checkInCode, 'code')}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                      >
                        {copied === 'code' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Participant Info</h4>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-400">Name:</span> <span className="text-white">{userData.name}</span></div>
                      <div><span className="text-gray-400">Email:</span> <span className="text-white">{userData.email}</span></div>
                      <div><span className="text-gray-400">Event:</span> <span className="text-white">TechHack 2025</span></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={downloadQR}
                    className="flex-1 bg-[#E63946] hover:bg-[#C5303E] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Download size={16} className="mr-2" />
                    Download QR
                  </button>
                  <button
                    onClick={generateQRCode}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    title="Regenerate QR Code"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">How to use:</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Show this QR code at registration desk</li>
                    <li>• Use for event check-in and check-out</li>
                    <li>• Required for workshop attendance</li>
                    <li>• Keep your registration ID for reference</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQRCode;