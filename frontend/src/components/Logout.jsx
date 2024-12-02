"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { axiosInstance, setAuthorizationHeader } from "../utils/axiosInstance";
import SecureLS from "secure-ls";
import { ENCRYPTION_KEY } from "../constants";

const Logout = ({ onClose }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userRole, setUserRole] = useState("");

  const secureStorage = new SecureLS({
    encodingType: "aes",
    encryptionSecret: ENCRYPTION_KEY,
  });

  useEffect(() => {
    const refreshToken = secureStorage.get("refresh_token");
    const accessToken = secureStorage.get("access_token");
    const userRole = secureStorage.get("user_role");
    setRefreshToken(refreshToken);
    setAccessToken(accessToken);
    setUserRole(userRole);
  }, [secureStorage]);

  const handleLogout = async () => {
    try {
      setAuthorizationHeader(accessToken);

      // Send logout request to API with the refresh token
      const response = await axiosInstance.post("/api/account-logout/", {
        refresh_token: refreshToken,
      });

      // Clear storage to remove any sensitive data
      secureStorage.clear();
      sessionStorage.clear();

      // Redirect the user to the  login page
      if (userRole === "admin") {
        navigate("/admin/login", { replace: true });
      } else {
        navigate("/login/", { replace: true });
      }
    } catch (error) {
      console.error("An error occured: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold font-montserrat leading-6 text-gray-900"
                  >
                    Logout account
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm font-montserrat text-gray-500">
                      Are you sure you want to logout your account?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold font-montserrat text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Confirm
              </button>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold font-montserrat text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Logout;
