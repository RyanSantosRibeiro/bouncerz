'use client';

import { useState } from 'react';


export const checkWalletConnection = async () => {
  try {
    if ('unisat' in window) {
      const anyWindow = window ;
      const provider = anyWindow.unisat;

      if (provider) {
        const accounts = await provider.getAccounts();
        const address = accounts[0];
        return { address, isConnected: !!address };
      }
    }
    return { address: '', isConnected: false };
  } catch (error) {
    return { address: '', isConnected: false };
  }
};

const UnisatConnect = ({ onAddressChange, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getUnisatProvider = () => {
    if ('unisat' in window) {
      const anyWindow = window;
      const provider = anyWindow.unisat;

      if (provider) {
        return provider;
      }
    }

    window.open('https://unisat.io/', '_blank');
    return null;
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const provider = getUnisatProvider();
      if (!provider) {
        throw new Error('unisat not found');
      }

      const accounts = await provider.requestAccounts();
      const address = accounts[0];

      if (!address) {
        throw new Error('0 account found');
      }

      const publicKey = await provider.getPublicKey()

      // const message = `Connect to Aurion! \n\nAddress: ${address}}`;
      //fetch prepare_login
      // 

      const response = await fetch(`/api/connect/prepare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);


      // @ts-ignore
      const signature = await provider.signMessage(result.message);

      if (!signature) {
        throw new Error('sign fail');
      }

      const payload = {
        address,
        signature,
        publicKey,
        walletType: 'unisat'
      }

      const responseLogin = await fetch(`/api/connect/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseLoginA = await responseLogin.json()
      if (onAddressChange) {
        // @ts-ignore
        onAddressChange(address, signature, responseLoginA.data);
      }

      if (onClose) {
        onClose();
      }

      window.location.reload();


    } catch (err) {
      console.error('erro:', err);
      setError(err.message || 'Failed to connect to Unisat wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Connect Unisat
          </>
        )}
      </button>
    </div>
  );
};

export default UnisatConnect;
