"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useWallet } from "../../../context/WalletContext";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
import logo from "../../logo.png";
import QueueButtons from "../Queue";
export default function Interface() {
  const { user, balance, match, setUser } = useWallet();
  const [status, setStatus] = useState("initial"); // category | idle | searching | found

  if (user?.name == "guest") {
    return (
      <div className="z-50 fixed right-[0%] w-[0%] h-full w-full text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2">
        <QueueButtons />
      </div>
    );
  }

  if (!user || user == null) {
    return (
      <div className="z-50 fixed right-[10%] h-full w-[80%] text-xs flex flex-row justify-start items-center  p-2 rounded-md gap-2">
        <div className="flex flex-col items-center justify-start w-auto h-auto max-h-auto card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
          {status == "initial" && (
            <div className="card-body max-w-full w-[300px]">
              <img src={logo.src} className="w-auto h-auto" />
              <p
                onClick={() => setStatus("wallet")}
                className="btn btn-primary hover:opacity-60 text-white rounded"
              >
                Connect your wallet to play
              </p>
              <p
                onClick={() => setUser({name: "guest"})}
                className="btn btn-secondary hover:opacity-60 text-white rounded"
              >
                Play as guest
              </p>
              <p className="text-gray-300 text-sm/4 font-regular text-justify">
                Bouncerz is a fast-paced multiplayer arena game where players
                bounce, battle, and gain prices. Join intense matches, and
                dominate the arena in this chaotic and competitive game.
              </p>
            </div>
          )}

          {status == "wallet" && (
            <div className="card-body">
              <WalletConnect />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="z-50 fixed top-[10%] left-[5%] w-auto h-auto text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2 card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
        <img
          src={user?.profile?.image}
          className="w-8 h-8 rounded-sm font-bold"
        />
        <p className="text-white text-md font-semibold">
          {user?.profile?.username}
        </p>
      </div>
      <div className="z-50 fixed top-[10%] right-[5%] w-auto h-auto text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2 card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
        <p className="text-white text-md font-semibold">{balance}</p>
      </div>
      {match == null && (
        <div className="z-50 fixed right-[0%] w-[0%] h-full w-full text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2">
          <QueueButtons />
        </div>
      )}
    </>
  );
}
