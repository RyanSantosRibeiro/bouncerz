"use client";

import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import WalletConnect from "../Wallet";
export default function Header() {
  
  return (
    <div className="w-screen h-[40px] flex justify-center items-center">
      <Modal cta={{ text: 'Connect Wallet', type: 'primary' }}>
          <WalletConnect />
      </Modal>
    </div>
  );
}
