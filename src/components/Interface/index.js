"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useWallet } from "../../../context/WalletContext";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
export default function Interface() {
  const { user, balance } = useWallet();

  if (!user || user == null) {
    return (
      <div className="fixed top-[10%] right-[10%] w-auto h-[50px] flex justify-center z-50">
        <Modal cta={{ text: "Connect Wallet", type: "primary" }}>
          <WalletConnect />
        </Modal>
      </div>
    );
  }

  return (
    <>
      <div className="z-50 fixed top-[10%] left-[5%] w-auto h-auto text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2 card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
        <img src={user?.profile?.image} className="w-8 h-8 rounded-sm font-bold" />
        <p className="text-white text-md">{user?.profile?.username}</p>
      </div>
      <div className="z-50 fixed top-[10%] right-[5%] w-auto h-auto text-xs flex flex-row justify-center items-center  p-2 rounded-md gap-2 card bg-base-100 card-border border-base-300 from-base-content/5 bg-linear-to-bl to-50%">
        <img src={user?.profile?.image} className="w-8 h-8 rounded-sm font-bold" />
        <p className="text-white text-md">{balance}</p>
      </div>
    </>
  );
}
