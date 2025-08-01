
import { NextResponse } from 'next/server';
import { Actor, HttpAgent } from '@dfinity/agent';
import { wallet } from '../../../../../utils/odin/idlFactory';

const canisterIds = {
  siwbCanisterId: 'bcxqa-kqaaa-aaaak-qotba-cai',
  fastbtcCanisterId: 'ztwhb-qiaaa-aaaaj-azw7a-cai',
  ckbtcLedgerCanisterId: 'mxzaz-hqaaa-aaaar-qaada-cai',
  ckbtcMinterCanisterId: 'mqygn-kiaaa-aaaar-qaadq-cai',
  voltCanisterId: 'aclt4-uaaaa-aaaak-qb4zq-cai'
};

export const POST = async (req) => {
  const body = await req.json();
  const { address } = body;

  if (!address)
    return NextResponse.json({ error: 'Invalid Address' }, { status: 400 });
  try {
    const anonimousAgent = new HttpAgent({
      host: 'https://ic0.app'
    });

    const anonimousActor = Actor.createActor(wallet, {
      agent: anonimousAgent,
      canisterId: canisterIds.siwbCanisterId
    });

    console.log('Calling siwb_prepare_login...');
    const prepareResult = await anonimousActor.siwb_prepare_login(address);
    // @ts-ignore
    const message = prepareResult.Ok;
    return new Response(
      JSON.stringify({
        success: true,
        message
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error preparing login:', error);
    throw error;
  }
};
