import React, { useState } from "react";
import { axiosInstanceNoAuthHeader } from "../../utils/axiosInstance";
import useLogin from "./../../hooks/useLogin";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
  Box,
  Checkbox,
  Modal,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isVisible, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasAccount, setHasAccount] = useState(true);
  const theme = useTheme();
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();
  const { handleLogin, errorMessage, showAlert } = useLogin();

  const loginPageName = "public";
  sessionStorage.setItem("loginPageName", loginPageName);

  const handleSignIn = (e) => {
    e.preventDefault();
    handleLogin({ username, password, loginPageName });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (!consentChecked) {
      alert("You must agree to the terms and conditions to proceed.");
      return;
    }
  
    try {
      const response = await axiosInstanceNoAuthHeader.post(
        "/api/public/sign-up/",
        {
          username: username,
          password: password,
          email: email,
          first_name: firstName,
          last_name: lastName,
        }
      );
  
      if (response.status === 201) {
        setUsername("");
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
  
        setSuccessMessage("Account created successfully! Please sign in.");
        setHasAccount(true);
      }
    } catch (error) {
      console.error("An error occurred while creating the account.", error);
    }
  };
  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
          backdropFilter: "blur(1px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0.6)",
        }}
      >
        <Box
          sx={{
            width: "100%", // Adjust the width for different screen sizes
            maxWidth: { xs: 300, sm: 375 },
            padding: 4,
            borderRadius: 3,
            background: theme.palette.mode === "dark" ? "#333" : "#fff",
            boxShadow:
              "0 12px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            position: "relative",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: theme.palette.text.primary,
            }}
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            {successMessage && (
              <Typography
                color={
                  successMessage.includes("successfully")
                    ? "success.main"
                    : "error.main"
                }
                textAlign="center"
                sx={{ mb: 2 }}
              >
                {successMessage}
              </Typography>
            )}
            {hasAccount ? "Login" : "Sign Up"}
          </Typography>

          {errorMessage && (
            <Typography
              color="error.main"
              textAlign="center"
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: "error.light",
                border: 1,
                borderColor: "error.main",
                borderRadius: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
                width: "100%",
                opacity: 0.9,
                color: "#fff",
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={hasAccount ? handleSignIn : handleSignUp}>
            {!hasAccount && (
              <>
                <Box sx={{ mb: { xs: 1, sm: 3 },
                   display: "flex", gap: 2 }}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={50}
                    sx={{
                      width: "50%",
                      borderRadius: 12,
                      bgcolor: theme.palette.background.paper,
                      "& fieldset": {
                        border: `1px solid ${theme.palette.text.disabled}`,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={50}
                    sx={{
                      width: "50%",
                      borderRadius: 12,
                      bgcolor: theme.palette.background.paper,
                      "& fieldset": {
                        border: `1px solid ${theme.palette.text.disabled}`,
                      },
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
              </>
            )}
            <Box sx={{ mb: { xs: 1, sm: 3 }}}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                helperText="Username must be between 3-30 characters"
                sx={{
                  borderRadius: 12,
                  bgcolor: theme.palette.background.paper,
                  "& fieldset": {
                    border: `1px solid ${theme.palette.text.disabled}`,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            {!hasAccount && (
              <Box sx={{ mb: { xs: 1, sm: 3 }}}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  helperText="Enter a valid email address"
                  sx={{
                    borderRadius: 12,
                    bgcolor: theme.palette.background.paper,
                    "& fieldset": {
                      border: `1px solid ${theme.palette.text.disabled}`,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                />
              </Box>
            )}
            <Box sx={{ mb: { xs: 1, sm: 3 }}}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={64}
                helperText="Password must be between 8-64 characters"
                sx={{
                  borderRadius: 12,
                  bgcolor: theme.palette.background.paper,
                  "& fieldset": {
                    border: `1px solid ${theme.palette.text.disabled}`,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            </Box>
            {!hasAccount && (

            <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 3 }, mb: { xs: 1, sm: 3 } }}>
            <Checkbox
              id="consent-checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              sx={{ marginRight: "8px", transform: "scale(1.2)" }}
            />
            <label htmlFor="consent-checkbox" style={{ fontSize: '0.75rem' }}> {/* Adjusted font size here */}
              I agree to the{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.palette.primary.main, textDecoration: "underline" }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.palette.primary.main, textDecoration: "underline" }}
              >
                Terms of Service
              </a>
            </label>
            </Box>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
                disabled={!hasAccount && !consentChecked} 
              fullWidth
              sx={{
                borderRadius: 20,
                mb: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #6D28D9 30%, #8B5CF6 90%)",
                color: "white",
                "&:hover": {
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  transform: "scale(1.05)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : hasAccount ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              o
              sx={{ color: theme.palette.text.secondary }}
            >
              {hasAccount
                ? "Don't have an account?"
                : "Already have an account?"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                cursor: "pointer",
                fontWeight: "bold",
                ml: 1,
              }} // Highlighted link
              onClick={() => setHasAccount(!hasAccount)}
            >
              {hasAccount ? "Sign up" : "Login"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
