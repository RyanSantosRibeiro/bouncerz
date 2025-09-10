export default function getRandomCryptoNameAndColor() {
  const names = [
    "Satoshi",
    "Odin",
    "Blocksmith",
    "CryptoWolf",
    "ChainSeer",
    "RuneMiner",
    "HodlViking",
    "BitThor",
    "Nakamoto",
    "FrostLedger",
    "NodeRaider",
    "ValhallaMiner",
    "SigRune",
    "HashGuardian",
    "BifrostTrader",
    "Asgardian",
    "LightningLoki",
    "Hodlheim",
    "Runesigner",
    "ValkyNode"
  ];

  const colors = [
    "#f7931a", // Bitcoin orange
    "#0d1117", // GitHub dark / deep black
    "#627eea", // Ethereum blue
    "#2e86ab", // Nordic ice blue
    "#8e44ad", // Purple rune
    "#34495e", // Ledger grey
    "#2980b9", // Odin blue
    "#1abc9c", // Blockchain teal
    "#e67e22", // Mining orange
    "#16a085", // Crypto green
    "#c0392b", // Node red
    "#95a5a6", // Frost silver
    "#d35400", // Hodl rust
    "#7f8c8d", // Hash grey
    "#9b59b6", // Sigil violet
    "#bdc3c7", // Bifrost light
    "#ecf0f1", // Rune white
    "#f1c40f", // Lightning yellow
    "#e74c3c", // Viking blood
    "#3498db"  // Asgard blue
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    name: randomName,
    color: randomColor
  };
}