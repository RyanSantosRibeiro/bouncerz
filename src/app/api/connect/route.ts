
import { NextResponse } from 'next/server';
import { createClientAdmin } from '../../../../utils/supabase/client';


export const POST = async (req: Request) => {
  const body = await req.json();
  const { wallet } = body;

  if(!wallet) return NextResponse.json({ error: "Wallet não encontrada" }, { status: 400 }); 

  const supabase = createClientAdmin();

  const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("address", wallet.address)
      .single();

    console.log({user: data, error})
      
  if(error && error.code != "PGRST116") {
    return new Response(JSON.stringify({
      success: false,
      message: error
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if(data && data != null) {

    return new Response(JSON.stringify({
      success: true,
      user: {...data},
      message: "Wallet connected"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }


  const { data: newUserData , error: newUseError } = await supabase
      .from("user")
      .insert({
        address: wallet.address,
        odinData: wallet.odinData
      })
      .select()

  return new Response(JSON.stringify({
      success: true,
      user: newUserData,
      message: "New Wallet connected"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  

};
