"use client";

import React, { useEffect, useState } from "react";
import { FaCrown, FaFlagCheckered, FaGamepad, FaTrophy } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function GameStatus({ status }) {
  const [visible, setVisible] = useState(false);
  const [internalStatus, setInternalStatus] = useState(null);

  useEffect(() => {
    if (status?.type) {
      setInternalStatus(status);
      setVisible(true);

      const duration = status.type === "matchWinner" ? 5000 : 3000;

      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible || !internalStatus) return null;

  const { type, data } = internalStatus;

  const statusContent = {
    welcome: {
      icon: <FaGamepad className="text-blue-400 text-5xl mb-2" />,
      title: "Welcome!",
      subtitle: "Get ready to play 🎮",
    },
    start: {
      icon: <FaFlagCheckered className="text-green-400 text-5xl mb-2" />,
      title: "Round Started!",
      subtitle: "Give it your best shot!",
    },
    scoreUpdate: {
      icon: <FaCrown className="text-yellow-300 text-5xl mb-2" />,
      title: "Scores Updated!",
      subtitle: "Keep pushing forward!",
    },
    roundWinner: {
      icon: <FaTrophy className="text-purple-300 text-5xl mb-2" />,
      title: `Round Winner: ${data}`,
      subtitle: "Nice round! 🎉",
    },
    matchWinner: {
      icon: <FaTrophy className="text-yellow-400 text-6xl mb-2 animate-bounce" />,
      title: `🏆 Match Winner: ${data} 🏆`,
      subtitle: "Victory is yours!",
    },
    default: {
      icon: <FaGamepad className="text-white text-5xl mb-2" />,
      title: "Connecting...",
      subtitle: "Please wait...",
    },
  };

  const content = statusContent[type] || statusContent.default;

  if(status.type === "game") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4 }}
        className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="bg-gray-800 text-white rounded-xl px-10 py-6 shadow-lg border border-gray-600 text-center max-w-md w-full flex flex-col justify-center items-center">
          {content.icon}
          <h2 className="text-3xl font-extrabold">{content.title}</h2>
          <p className="text-lg text-gray-300 mt-2">{content.subtitle}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
