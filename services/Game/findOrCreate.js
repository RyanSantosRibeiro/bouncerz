
import { createClient } from "../../utils/supabase/client";
import { getMatch, startMatch } from "../../utils/supabase/queries";

export async function findOrCreateMatch(userId,setMatch) {
  const supabase = createClient();
  const maxPlayers = 2;
  let playersQtd = 0;
  let host = null;

  // 1. Buscar partida aberta
  const openMatches = await getMatch();

  let match = openMatches?.[0];
  const matchHash = match?.hash;

  // 3. Entrar no canal realtime da partida
  const channel = supabase.channel(`match-${matchHash}`, {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  // 6. Receber confirmação de pagamento dos jogadores
  const paymentConfirmed = new Set();

  // 4. Subscribing e monitorando presença
  channel
    .on("presence", { event: "sync" }, async ({payload}) => {
      const players = Object.keys(channel.presenceState());
      playersQtd = players.length;
      console.log("Players:", players);

      if (players.length === 1) {
        host = players[0];
      }

      // 5. Se todos os 8 jogadores estiverem presentes
      if (players.length === maxPlayers) {
        // 5.1. Envia broadcast para todos realizarem o pagamento
        await channel.send({
          type: "broadcast",
          event: "request-payment",
          payload: { matchId: matchHash },
        });
      }
    })
    .on("broadcast", { event: "request-payment" }, async ({ payload }) => {

      // Aqui o cliente realiza o pagamento com token/api/etc
      //pagou
      paymentConfirmed.add(userId);

      await channel.send({
        type: "broadcast",
        event: "confirm-payment",
        payload: { userId, matchId: payload.matchId },
      });
    })
    .on("broadcast", { event: "confirm-payment" }, async ({ payload }) => {
      paymentConfirmed.add(payload.userId);

      // 7. Se todos confirmaram pagamento, mudar para in_progress
      if (paymentConfirmed.size === maxPlayers) {
        
        // Update to in_progress
        // const updateMatch = await getMatch(); 

        if(host == userId) {
          // Update to in_progress
          const updateMatch = await startMatch({
            players: Array.from(paymentConfirmed),
            match_id: match.id
          }); 


          if(!updateMatch) return;
          setMatch(updateMatch[0])

          channel.send({
            type: "broadcast",
            event: "start-game",
            payload: {match: updateMatch[0]},
          });
        }
      }
    })
    .on("broadcast", { event: "start-game" }, async ({ payload }) => {
      console.log({x: "Start Game", payload})
      setMatch(payload.match)
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId });
      }
    });

  return { match, channel, players: playersQtd };
}
