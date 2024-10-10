import React, { useContext, createContext } from "react";
import SecureLS from "secure-ls";

const secureLocalStorageContext = createContext();

const SecureLocalStorageProvider = ({
  children,
  encryptionKey,
  ...otherConfig
}) => {
  const secureLocalStorage = new SecureLS({
    encryptionKey,
    ...otherConfig,
  });

  return (
    <secureLocalStorageContext.Provider value={secureLocalStorage}>
      {children}
    </secureLocalStorageContext.Provider>
  );
};

const useSecureLocalStorage = () => {
  const secureLocalStorage = useContext(secureLocalStorageContext);
  if (!secureLocalStorage) {
    throw new Error(
      "useSecureLocalStorage must be used within a SecureLocalStorageProvider"
    );
  }
  return secureLocalStorage;
};

export { SecureLocalStorageProvider, useSecureLocalStorage };
