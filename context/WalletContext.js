'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';
import { getUserByWallet } from '../utils/supabase/queries';
import { checkWalletConnection } from '../services/WalletsProviders/Unisat';
import { fromSatoshis } from '../utils/helpers';
import { createClient } from '../utils/supabase/client';

const WalletContext = createContext(undefined);

const WALLET_STORAGE_KEY = 'aurion_wallet_data';

export function WalletProvider({ children }) {
  const [walletData, setWalletDataState] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState(null);
  const [match, setMatch] = useState(null);
  const [balance, setBalance] = useState(0);
  

  useEffect(() => {
    const loadWalletFromStorage = async () => {
      try {
        const savedWallet = localStorage.getItem(WALLET_STORAGE_KEY);
        if (savedWallet) {
          const parsedWallet = JSON.parse(savedWallet);

          const { address, isConnected } = await checkWalletConnection();

          if (isConnected && address === parsedWallet.address) {
            setWalletDataState(parsedWallet);
            console.log(
              '🔄 Wallet carregada do localStorage e validada:',
              parsedWallet.address
            );
          } else {
            // localStorage.removeItem(WALLET_STORAGE_KEY);
            console.log('Remove local storage');
          }
        }
      } catch (error) {
        console.error('erfro', error);
        // localStorage.removeItem(WALLET_STORAGE_KEY);
        console.log('Remove local storage');
      } finally {
        setIsInitialized(true);
      }
    };

    loadWalletFromStorage();

    // setInterval(() => {
    //   getToken();
    // }, 4000);
  }, []);

  useEffect(() => {
    console.log({ walletData, user });
    if (walletData && walletData != null && user == null) {
      getUserInfo(walletData);
    }
  }, [walletData]);


  const getToken = async () => {
    // https://api.odin.fun/v1/tokens
    try {
      const response = await fetch(`https://api.odin.fun/v1/token/2k6r`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      const btcPriceResponse = await fetch(
        `https://api.odin.fun/v1/currency/btc`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const btcPriceData = await btcPriceResponse.json();
      const btcUsd = btcPriceData.amount;
      const satsTokenPrice = result.price / 1000;
      const btcTokenPrice = fromSatoshis(satsTokenPrice);
      const dolarToken = btcTokenPrice * btcUsd;
      const priceDolar = Number(dolarToken.toFixed(5));
      const newToken = { ...result, priceDolar };
      console.log({ newToken });

      setToken(newToken);
      return result.data;
    } catch (error) {
      return error;
    }
  };

  const formatBalance = (balance, divisibility) => {
    return balance / Math.pow(10, divisibility);
  };

  const getBalance = async (principal) => {
    // https://api.odin.fun/v1/tokens
    try {
      const response = await fetch(
        `https://api.odin.fun/v1/user/${principal}/balances?lp=true&limit=999999`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      // @ts-ignore
      const tokenBalance = result.data.filter((t) => t.id == '2k6r')[0] || null;
      const balance = tokenBalance.balance;
      const divisibility = tokenBalance.divisibility;

      const humanReadable = balance / Math.pow(10, divisibility+3);
      console.log({ balance2: result, balance, divisibility, humanReadable });

      setBalance(humanReadable);
      return result.data;
    } catch (error) {
      return error;
    }
  };

  const getUserInfo = async (payload) => {
    const userData = await getUserByWallet(payload);
    const profileResponse = await fetch(`https://api.odin.fun/v1/user/${userData.user.odinData.userPrincipal}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

  const profile = await profileResponse.json()
  const image = profile.image != null ? profile.image : "https://zvmkcmwlmcugpelqxcpb.supabase.co/storage/v1/object/public/profile//default.png"

    console.log({ userData,profile });
    if (userData) {
      getBalance(userData.user.odinData.userPrincipal);
      setUser({...userData.user, profile: {...profile, image}});
    }
  };

  const setWalletData = (data) => {
    setWalletDataState(data);

    if (data) {
      try {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('erro', error);
      }
    } else {
      try {
        // localStorage.removeItem(WALLET_STORAGE_KEY);
        console.log('Remove local storage');
      } catch (error) {
        console.error('erro', error);
      }
    }
  };

  const disconnectWallet = () => {
    setWalletData(null);
  };

 

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <WalletContext.Provider
      value={{ walletData, setWalletData, disconnectWallet, user, token , balance, match, setMatch, setUser}}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
