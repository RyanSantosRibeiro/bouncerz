export const odinFormat = (amount) => {
    let [integerPart, decimalPart = ''] = amount.toString().split('.');
  
    if (!decimalPart) decimalPart = '00000000000';
    else decimalPart = decimalPart.padEnd(11, '0').slice(0, 11);
    
    return `${integerPart}.${decimalPart}`;
  };
  
export const toSatoshis = (value) => {
    return Math.floor(value * 100000000);
};
  
export const fromSatoshis = (satoshis) => {
    return satoshis / 100000000;
};
  
export const btcToOdinSats = (btc) => {
    const sats = Math.floor(btc * 100000000);
    return sats * 1000;
};
  
export const odinSatsToSats = (odinSats) => {
    return Math.floor(odinSats / 1000);
};
  
export const validatePrincipalId = (address) => {
    const principalRegex = /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/;
    return principalRegex.test(address);
};
  