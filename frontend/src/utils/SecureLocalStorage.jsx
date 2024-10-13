import React, { useContext, createContext } from "react";
import SecureLS from "secure-ls";

const secureLocalStorageContext = createContext(); // Create a context for secure local storage

// Provider component that wraps the app and provides secure local storage
const SecureLocalStorageProvider = ({
  children,
  encryptionKey,
  ...otherConfig
}) => {
  // Create a new instance of SecureLS with the provided encryption key and config
  const secureLocalStorage = new SecureLS({
    encryptionKey,
    ...otherConfig,
  });

  // Return a context provider that wraps the children with the secure local storage instance
  return (
    <secureLocalStorageContext.Provider value={secureLocalStorage}>
      {children}
    </secureLocalStorageContext.Provider>
  );
};

// Hook to access the secure local storage instance
const useSecureLocalStorage = () => {
  const secureLocalStorage = useContext(secureLocalStorageContext);

  // If no instance is found, throw an error
  if (!secureLocalStorage) {
    throw new Error(
      "useSecureLocalStorage must be used within a SecureLocalStorageProvider"
    );
  }
  return secureLocalStorage; // Return the secure local storage instance
};

export { SecureLocalStorageProvider, useSecureLocalStorage };
