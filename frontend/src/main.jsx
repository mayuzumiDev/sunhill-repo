import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./styles.css";
/* import { SecureLocalStorageProvider } from "./utils/SecureLocalStorage.jsx";
import EncryptionKey from "./utils/EncryptionKeyGenerator"; */

// const keyLength = 256;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="21363748727-nmlbctqonc29vvnjg3fvi00vama5nkrm.apps.googleusercontent.com">
      {/*       <SecureLocalStorageProvider
        encryptionKey={<EncryptionKey keyLength={keyLength} />}
      > */}
      <App />
      {/* </SecureLocalStorageProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>
);