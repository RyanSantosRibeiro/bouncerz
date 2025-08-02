"use client";
import { useEffect, useState } from "react";
import { findOrCreateMatch } from "../../../services/Game/findOrCreate";
import { useWallet } from "../../../context/WalletContext";
import bg from "../../default.png";
import searching from "../../loading.gif";

export default function QueueButtons() {
  const [status, setStatus] = useState("category"); // category | idle | searching | found
  const { setMatch, match } = useWallet();

  useEffect(()=>{
    if(status == "searching" && match != null) {
        setStatus("found")
    }
  },[match])

  const handleFindMatch = async () => {
    setStatus("searching");
    try {
      const userId = "user-" + crypto.randomUUID(); // trocar pelo ID real do usuário logado
      const { match, channel } = await findOrCreateMatch(userId, setMatch);

      setStatus("found");

      // Aqui você pode redirecionar para a tela de jogo, por exemplo:
      // router.push(`/match/${match.id}`)
    } catch (err) {
      console.error("Erro ao buscar partida:", err);
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-auto h-auto max-h-auto card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
      {status === "menu" && (
        <div className="card-body gap-4 flex flex-col">
          <h1 className="border-base-300  text-white font-bold text-center text-3xl">
            Bouncerz
          </h1>
          <p
            onClick={() => setStatus("quick")}
            className="btn btn-primary hover:opacity-60 text-white px-4 py-2 rounded cursor-pointer m-0 min-w-[200px]"
          >
            Quick play
          </p>
          <p className="btn btn-accent hover:opacity-60 text-white px-4 py-2 rounded cursor-pointer m-0 min-w-[200px]">
            Tutorial
          </p>
          <p className="btn btn-active hover:opacity-60 text-white px-4 py-2 rounded cursor-pointer m-0 min-w-[200px]">
            RoadMap
          </p>
          <p className="btn btn-active hover:opacity-60 text-white px-4 py-2 rounded cursor-pointer m-0 min-w-[200px]">
            Buy Token
          </p>
        </div>
      )}

      {status === "category" && (
        <div className="card-body gap-4 flex flex-col hHGuuM">
          <h1 className="border-base-300  text-white font-bold text-center text-3xl">
            Bouncerz
          </h1>
          <div className="w-full grid grid-cols-3 gap-3">
            <div
              onClick={handleFindMatch}
              className="relative w-full flex flex-col justify-center items-center max-w-[200px] cursor-pointer gap-2"
            >
              <div className="relative w-full h-full flex gap-2 justify-center items-center flex-col">
                <img
                  src={bg.src}
                  className="w-full h-full object-cover border-base-300 border rounded"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start hover:bg-[rgba(0,0,0,0.5)] transition group p-5">
                  <h4 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 flex">
                    Instructions
                  </h4>
                  <p className="text-white opacity-0 group-hover:opacity-100">
                    8 players and one champion! The champion gain 4x your ticket!
                  </p>
                  
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-200">Battle</p>
            </div>
            <div
              onClick={() => setStatus("searching")}
              className="relative w-full flex flex-col justify-center items-center max-w-[200px] cursor-pointer gap-2"
            >
              <div className="relative w-full h-full flex gap-2 justify-center items-center flex-col">
                <img
                  src={bg.src}
                  className="w-full h-full object-cover border-base-300 border rounded"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start hover:bg-[rgba(0,0,0,0.5)] transition group p-5">
                  <h4 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 flex">
                    Instructions
                  </h4>
                  <p className="text-white opacity-0 group-hover:opacity-100">
                    8 players and one champion! The champion gain 4x your ticket!
                  </p>
                  
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-200">Racer</p>
            </div>
            <div
              onClick={() => setStatus("searching")}
              className="relative w-full flex flex-col justify-center items-center max-w-[200px] cursor-pointer gap-2"
            >
              <div className="relative w-full h-full flex gap-2 justify-center items-center flex-col">
                <img
                  src={bg.src}
                  className="w-full h-full object-cover border-base-300 border rounded"
                />
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-start hover:bg-[rgba(0,0,0,0.5)] transition group p-5">
                  <h4 className="text-white text-xl font-bold opacity-0 group-hover:opacity-100 flex">
                    Instructions
                  </h4>
                  <p className="text-white opacity-0 group-hover:opacity-100">
                    8 players and one champion! The champion gain 4x your ticket!
                  </p>
                  
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-200">Arena</p>
            </div>
          </div>
        </div>
      )}

      {status === "searching" && (
        <div className="card-body gap-4 flex flex-col hHGuuM">
          <h1 className="border-base-300  text-white font-bold text-center text-3xl">
            Bouncerz
          </h1>
          <div className="flex justify-center items-center flex-col gap-2">
            <img src={searching.src} />
            <p className="text-white text-xl font-semibold">
              {" "}
              Looking for a match...
            </p>
            <p
              onClick={() => setStatus("category")}
              className="btn btn-error btn-sm rounded-2xl mt-2"
            >
              Cancel
            </p>
          </div>
        </div>
      )}
      {status === "found" && (
        <div className="card-body gap-4 flex flex-col hHGuuM">
          <h1 className="border-base-300  text-white font-bold text-center text-3xl">
            Bouncerz
          </h1>
          <div className="flex justify-center items-center flex-col gap-2">
            <img src={searching.src} />
            <p className="text-white text-xl font-semibold">
              {" "}
              Match Found!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
