import { createClientAdmin } from '../../../../../utils/supabase/client';
import { createClient } from '../../../../../utils/supabase/server';
import { NextResponse } from 'next/server';
import { login } from '../../../../../utils/odin/login';




export const POST = async (req: Request) => {
  const body = await req.json();
  const { 
        address,
        signature,
        publicKey,
        walletType
      } = body;

  if (!address ||
        !signature ||
        !publicKey ||
        !walletType)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });


  
  try {
    const reponseLogin = await login(
      address,
        signature,
        publicKey,
        walletType
    )


    return new Response(
      JSON.stringify({
        success: true,
        data: reponseLogin.data
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
