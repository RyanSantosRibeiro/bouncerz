import { NextResponse } from "next/server";
import { createClientAdmin } from "../../../../utils/supabase/client";

import defaultMaps from '../../../../utils/maps'

const generateMatchId = () =>
  Math.random().toString(36).substring(2, 6) +
  Date.now().toString(36).substring(2, 6);

export const POST = async (req) => {

  const body = await req.json();
  const { players, match_id } = body;

  if(!players) return NextResponse.json({ error: "Wallet não encontrada" }, { status: 400 }); 
  const supabase = createClientAdmin();


  const { data: updateMatchData, error: updateMatchError} = await supabase
    .from("match")
    .update({
      status: "in_progress",
      players
    })
    .eq("id", match_id)
    .select();

  console.log({ updateMatchData, updateMatchError })


  return new Response(
    JSON.stringify({
      success: true,
      data: updateMatchData,
      message: "New Match",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const GET = async () => {
  const supabase = createClientAdmin();

  const { data, error } = await supabase
    .from("match")
    .select("id,hash")
    .eq("status", "open");

  console.log({ match2: data, error });

  if (error && error.code != "PGRST116") {
    return new Response(
      JSON.stringify({
        success: false,
        message: error,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (data.length > 0 && data != null) {
    return new Response(
      JSON.stringify({
        success: true,
        data: data,
        message: "Match Found!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const randomNumber = Math.floor(Math.random() * defaultMaps.length);

  const { data: newMatchData, error: newMatchError } = await supabase
    .from("match")
    .insert({
      hash: generateMatchId(),
      status: "open",
      map: defaultMaps[randomNumber]
    })
    .select();

    console.log({ newMatchData, newMatchError })

  return new Response(
    JSON.stringify({
      success: true,
      data: newMatchData,
      message: "New Match",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};