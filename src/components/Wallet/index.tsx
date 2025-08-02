'use client';

import { useState } from 'react';
import UnisatConnect from '../../../services/WalletsProviders/Unisat';
import { useWallet } from '../../../context/WalletContext';

export default function WalletConnect() {
  const { walletData, setWalletData, user } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleAddressChange = (newAddress: string, signature?: string, odinData?: any) => {
    setWalletData({ address: newAddress, signature, odinData });
    setError(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Connect Wallet
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded">
          {error}
        </div>
      )}

      {walletData ? (
        <div className="mb-4 p-4 bg-green-900 border border-green-700 text-green-200 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Connected Wallet</p>
              <p className="text-sm text-green-300 font-mono">
                {user?.username}
              </p>
              {walletData.signature && (
                <p className="text-xs text-green-400 mt-1">
                  Signature: {walletData.signature.slice(0, 10)}...
                </p>
              )}
            </div>
            <button
              onClick={() => setWalletData(null)}
              className="text-green-300 hover:text-green-100 text-sm underline"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 cursor-pointer">
          <UnisatConnect 
            onAddressChange={handleAddressChange}
            onClose={() => {
              const modal = document.getElementById('my_modal_2') as HTMLDialogElement;
              if (modal) {
                modal.close();
              }
            }}
          />
        </div>
      )}
    </div>
  );
} 