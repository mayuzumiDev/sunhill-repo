import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const EncryptionKey = ({ keyLength }) => {
  const [encryptionKey, setEncryptionKey] = useState(null);

  useEffect(() => {
    generateEncryptionKey(keyLength);
  }, [keyLength]);

  const generateEncryptionKey = (keyLength) => {
    const randomBytes = CryptoJS.lib.WordArray.random(keyLength);
    const encryptionKeyBase64 = CryptoJS.enc.Base64.stringify(randomBytes);
    setEncryptionKey(encryptionKeyBase64);
  };

  return encryptionKey;
};

export default EncryptionKey;
