import { WalletData } from '@/contexts/WalletContext';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getMatch = cache(async (supabase: SupabaseClient) => {
  const { data: match, error } = await supabase
    .from('matches')
    .select(`*,
      white_player:profile!white_player_id(*),
      black_player:profile!black_player_id(*)`
    )
    .eq('url_hash', "vemr")
    .single()
  return  match
;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('active', true)
    .single();
  return profile;
});


export const getUserByWallet = async (wallet: WalletData) => {
  try {
      console.log({walletP: wallet})
      const response = await fetch(`/api/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result;
    } catch (error: any) {
      return error;
    } 
}

export const createMatch = async (payload: any) => {
  try {
      const response = await fetch(`/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result;
    } catch (error: any) {
      return error;
    } 
}

export const getScoreboard = async () => {
  try {
      const response = await fetch(`/api/scoreboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.data;
    } catch (error: any) {
      return error;
    } 
}

export const getMatchTypes = async (type:string) => {
  try {
      const response = await fetch(`/api/match/types/${type}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.data;
    } catch (error: any) {
      return error;
    } 
}

export const updateMatch = async (payload: any) => {
  try {
      const response = await fetch(`/api/match/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.data;
    } catch (error: any) {
      return error;
    } 
}

export const saveWallet = async (payload: any) => {
  try {
      const response = await fetch(`/api/connect/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.data;
    } catch (error: any) {
      return error;
    } 
}

export const sendTicket = async (payload: any) => {
  try {
      const response = await fetch(`/api/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.data;
    } catch (error: any) {
      return error;
    } 
}