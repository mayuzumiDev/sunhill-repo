import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/home/Navbar"; // MUI AppBar version
import Footer from "../components/home/Footer"; // MUI styled Footer

const LoginPageContent = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  const [buttonPosition, setButtonPosition] = useState(0);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    setButtonPosition(newDarkMode ? 25 : 0);
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      setButtonPosition(25);
    }
  }, []);

  return (
    <div className="login-page-content">
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <Box
          sx={{
            minHeight: "100vh",
            minWidth: "100%",
            display: "flex",
            height: "150vh",
            flexDirection: "column",
          }}
        >
          <Box
            className="login-main"
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              p: 2,
              // background: "linear-gradient(135deg, rgba(90, 255, 20, 0.4) 0%, rgba(0, 255, 255, 0.4) 33%, rgba(128, 0, 128, 0.4) 66%, rgba(255, 165, 0, 0.4) 100%)",

              // "&::before": {
              //   content: '""',
              //   position: "absolute",
              //   top: 0,
              //   left: 0,
              //   width: "100%",
              //   height: "100%",
              //   // backgroundImage: "url(/src/assets/img/home/supplies.png)",
              //   backgroundSize: "cover",
              //   backgroundPosition: "center",
              //   opacity: 0.4,
              //   zIndex: -1,
              // },
            }}
          >
            <Navbar
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              buttonPosition={buttonPosition}
            />
            <Box sx={{ position: "relative", textAlign: "center", mb: 3, mt: { xs: 30, sm: 40 } }}>
              {/* <img
                src="/src/assets/img/home/sunhilllogo.png"
                alt="LMS Logo"
                style={{ maxWidth: "100%" }}
              /> */}
            <Typography
                variant="h1"
                sx={{
                  position: "relative",
                  bottom: { xs: "100px", sm: "160px" },
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  fontSize: { xs: "35px", sm: "60px" },
                  display: "flex",
                  justifyContent: "center",
                  gap: "5px",
                }}
              >
                {["S", "u", "n", "h", "i", "l", "l"].map((letter, index) => (
                  <span
                    key={index}
                    style={{
                      background: [
                        "#f26025", // Orange
                        "#f68920", // Orange gradient transition
                        "#81c244", // Green
                        "#47b5e4", // Blue
                        "#1875ba", // Dark Blue
                        "#653093", // Purple
                        "#d91c5e", // Red-Purple
                      ][index % 7], // Cycle through colors for each letter
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {letter}
                  </span>
                ))}
                <span
                  style={{
                    background: "linear-gradient(135deg, #f68920 0%, #47b5e4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "2px 2px 2px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  LMS
                </span>
              </Typography>

              <Typography
                variant="body2"
                className="branch-p"
                sx={{
                  position: "absolute",
                  bottom: { xs: "100px", sm: "135px" },
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: { xs: "none", sm: "flex" },
                  justifyContent: "center",
                  gap: 1,
                  color: "#555",
                  padding: "0 9px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  fontSize: { xs: "10", sm: "15px" },
                  textOverflow: "ellipsis",
                }}
              >
                <span>Batangas</span>
                <span>•</span>
                <span>Rosario</span>
                <span>•</span>
                <span>Bauan</span>
                <span>•</span>
                <span>Metro Tagaytay</span>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                maxWidth: { xs: 400, md: 600 },
                position: "relative",
                bottom: { xs: "100px", md: "130px" },
              }}
            >
              <Button
                component={RouterLink}
                to="/login/teacher/"
                fullWidth
                variant="contained"
                color="success"
                sx={{
                  py: 2,
                  display: "flex",
                  flexDirection: "column", // Stacks the title and subtext
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                >
                  Teacher Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, opacity: 0.8, textTransform: "none" }}
                >
                  Access your Teacher Account.
                </Typography>
              </Button>

              <Button
                component={RouterLink}
                to="/login/student/"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                >
                  Student Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, opacity: 0.8, textTransform: "none" }}
                >
                  Sign in to your Student account
                </Typography>
              </Button>

              <Button
                component={RouterLink}
                to="/login/parent/"
                fullWidth
                variant="contained"
                color="warning"
                sx={{
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", textTransform: "none" }}
                >
                  Parent/Guardian Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 0.5, opacity: 0.8, textTransform: "none" }}
                >
                  Access your Parent or Guardian account.
                </Typography>
              </Button>
            </Box>
          </Box>
          <Footer />
        </Box>
      </div>
    </div>
  );
};

export default LoginPageContent;
