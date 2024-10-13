import CryptoJS from "crypto-js";

// Utility function to generate a random encryption key
export const generateEncryptionKey = (keyLength) => {
  const randomBytes = CryptoJS.lib.WordArray.random(keyLength); // Generate random bytes using CryptoJS
  const encryptionKeyBase64 = CryptoJS.enc.Base64.stringify(randomBytes); // Convert the random bytes to a Base64-encoded string
  return encryptionKeyBase64;
};

export default generateEncryptionKey;
