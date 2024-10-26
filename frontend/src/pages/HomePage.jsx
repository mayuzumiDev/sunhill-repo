import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faArrowRight,
  faArrowUp,
  faBook,
  faSchool,
  faChild,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link, Element } from "react-scroll";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { Button, Typography, Container, Box, Paper } from "@mui/material";
import Sunvid from '../assets/img/home/sunvid.mp4'
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Programs from "../components/home/Programs";
import LoginModal from "../components/home/LoginModal";
import StepperComponent from "../components/home/Stepper";


//import LoginModal from "./components/LoginModal";

const branches = [
  {
    address: "Pastor Road, Gulod Labac, Batangas City",
    phone: "0960 271 5298",
    email: "smcbatangascity@sunhilledu.com",
    fbPage: "https://www.facebook.com/smcbatangas",
    fbPageName: "Sunhill Montessori Casa-Batangas",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1867.0134492727382!2d121.072805!3d13.759904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd054e7cd0e3c9%3A0xc70c4d1504ab5814!2sSunhill%20Montessori%20Casa%20-%20Batangas!5e1!3m2!1sen!2sus!4v1722871137741!5m2!1sen!2sus",
  },
  {
    address: "Brgy. Namunga, Rosario, Batangas",
    phone: "0915 781 2878",
    email: "sunhill_rosario@yahoo.com",
    fbPage: "https://www.facebook.com/sunhillrosario2018",
    fbPageName: "Sunhill Montessori Casa Rosario",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.315059160028!2d121.18737745157719!3d13.84157674168431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd141eed830085%3A0xc58017160e758c9b!2sSunhill%20Montessori%20Casa%20Rosario!5e1!3m2!1sen!2sph!4v1724854331770!5m2!1sen!2sph",
  },
  {
    address: "Villa Florentina Subd., Manghinao Proper, Bauan, Batangas",
    phone: "0917 857 1588 or 0939 923 3988",
    email: "smcbauan@sunhilledu.com",
    fbPage: "https://www.facebook.com/sunhillbauan",
    fbPageName: "Sunhill Montessori Casa Bauan",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2604.2492389354993!2d121.00056845655783!3d13.798120499618033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd0f46808c3069%3A0xa16926d47eedadbf!2sSunhill%20Motessori%20Casa!5e1!3m2!1sen!2sph!4v1724856404467!5m2!1sen!2sph",
  },
  {
    address:
      "M. Dimapilis St., Anuling Lejos 2, Metro Tagaytay, Mendez, Cavite",
    phone: "0917 146 8790",
    email: "branch4@example.com",
    fbPage: "https://www.facebook.com/profile.php?id=100054311690176",
    fbPageName: "Sunhill Montessori Casa-Metro Tagaytay",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4086.0275085843036!2d120.89258292056984!3d14.11359481714555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd77e845da079f%3A0x810d615af8ad78d7!2sSunhill%20Montessori%20Casa%20Metro%20Tagaytay!5e1!3m2!1sen!2sph!4v1724856784592!5m2!1sen!2sph",
  },
];

const Home = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [buttonPosition, setButtonPosition] = useState(0);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

  //  const history = useHistory();

  // const [viewCount, setViewCount] = useState(() => {
  //   const storedCount = localStorage.getItem("viewCount");
  //   return storedCount ? parseInt(storedCount, 10) : 0;
  // });
  // Remove this useEffect if useScrollToHash is handling the scroll

  // useEffect(() => {
  //   const storedCount = localStorage.getItem("viewCount");
  //   const initialCount = storedCount ? parseInt(storedCount, 10) : 0;
  //   const newCount = initialCount + 1;
  //   setViewCount(newCount);
  //   localStorage.setItem("viewCount", newCount.toString());
  // }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollToTopVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    setButtonPosition(newDarkMode ? 25 : 0);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLoginModal = () => setIsModalVisible(true);
  const hideLoginModal = () => setIsModalVisible(false);

  const handleBranchChange = (index) => {
    setCurrentBranchIndex(index);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        buttonPosition={buttonPosition}
      />

      <Element name="home" className="home" id="home">
        <Container maxWidth="false" disableGutters>
          <Box
            sx={{
              position: "relative",
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: { xs: "30%", sm: "50%", lg: "100%" },
                overflow: "hidden",
                zIndex: 0,
              }}
              className="video-wrapper"
            >
              <video
                src={Sunvid}
                autoPlay
                loop
                muted
                playsInline
                className="background-video"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </Box>
            <Box
              className="home-banner-content"
              sx={{
                position: "relative",
                zIndex: 2,
                color: "text.primary",
                textAlign: "center",
                padding: "2rem",
                top: { xs: "60%", sm: "70%", md: "70%", lg: "50%" },
                transform: "translateY(-50%)",
                maxWidth: "90%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Fade direction="down" triggerOnce={false}>
                <Typography
                  variant="h1"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    fontSize: { xs: "1.5rem", sm: "2.5rem" },
                  }}
                >
                  Welcome to
                  <span className="gradient-text">
                    <span className="letter1">S</span>
                    <span className="letter2">u</span>
                    <span className="letter3">n</span>
                    <span className="letter4">h</span>
                    <span className="letter5">i</span>
                    <span className="letter6">l</span>
                    <span className="letter7">l</span>
                  </span>
                  <span className="monte">Montessori Casa</span>
                </Typography>
              </Fade>
              <Fade triggerOnce={false} delay={300}>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  We are an institution driven by our ultimate goal of bringing
                  each child closer to God.
                </Typography>
              </Fade>
              <Fade direction="up" triggerOnce={true}>
                <Link to="about" smooth={true} duration={500}>
                  <Button
                    variant="contained"
                    endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                    sx={{
                      mt: 2,
                      padding: "0.75rem 2rem",
                      borderRadius: "20px",
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Learn More
                  </Button>
                </Link>
              </Fade>
            </Box>
            <Box
              className="wave-background"
              sx={{
                position: "absolute",
                top: { xs: "9.5rem", sm: "13.5rem",  lg: "30.9rem" },
                left: 0,
                width: "100%",
                zIndex: "2",
                height: "auto",
                display: { xs: "flex", sm: "flex", md: "none", lg: "flex"},
              }}
            >
              <svg
                className="waves"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                style={{ width: '100%', height: 'auto' }}
              >
                <defs>
                  <path
                    id="gentle-wave"
                    d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                  />
                </defs>
                <use
                  href="#gentle-wave"
                  x="48"
                  y="0"
                  fill="rgba(255,255,255,0.6)"
                />
                <use
                  href="#gentle-wave"
                  x="48"
                  y="3"
                  fill="rgba(255,255,255,0.4)"
                />
                <use
                  href="#gentle-wave"
                  x="48"
                  y="5"
                  fill="rgba(255,255,255,0.2)"
                />
                <use href="#gentle-wave" x="48" y="7" fill="#fff" />
              </svg>
            </Box>
          </Box>
        </Container>
      </Element>

      <Box className="stepper-section" sx={{ mt: 4 }}>
        <StepperComponent />
      </Box>

      <Element name="about" className="about" id="about">
        <Container>
          <Fade triggerOnce={true}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ textAlign: "center", paddingBottom: "50px" }}
            >
              Sunhill LMS
            </Typography>
          </Fade>
          <Box
            sx={{
              display: "flex",
              flexWrap: { xs: "wrap", sm: "wrap", lg: "nowrap" },
              justifyContent: "space-between",
              gap: 2, // Adjusted gap
              marginBottom: "20px",
            }}
          >
            <Slide direction="up" triggerOnce={true} delay={50}>
              <Paper
                elevation={3}
                sx={{
                  flex: "1 0 200px",
                  padding: "20px 32px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  textAlign: "left",
                }}
              >
                <img
                  src="/src/assets/img/home/resources.gif"
                  alt="Easy access to learning modules"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    margin: "0 auto 20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}
                >
                  Easy access to learning modules
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "16px", color: "#666" }}
                >
                  Students can study ahead, review past lessons, and watch
                  instructional videos with a click or a tap of a button on any
                  gadget.
                </Typography>
              </Paper>
            </Slide>

            <Slide direction="up" triggerOnce={true} delay={100}>
              <Paper
                elevation={3}
                sx={{
                  flex: "1 0 200px",
                  padding: "20px 32px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  textAlign: "left",
                }}
              >
                <img
                  src="/src/assets/img/home/interactive.gif"
                  alt="Interactive activities and assessments"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    margin: "0 auto 20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}
                >
                  Activities and assessments
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "16px", color: "#666" }}
                >
                  Students can test their knowledge and skills through
                  interactive polls, quizzes, and debates, among others.
                </Typography>
              </Paper>
            </Slide>

            <Slide direction="up" triggerOnce={true} delay={200}>
              <Paper
                elevation={3}
                sx={{
                  flex: "1 0 200px",
                  padding: "20px 32px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  textAlign: "left",
                }}
              >
                <img
                  src="/src/assets/img/home/progress.gif"
                  alt="Progress monitoring"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    margin: "0 auto 20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}
                >
                  Progress monitoring
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "16px", color: "#666" }}
                >
                  Track student progress with comprehensive reports and
                  analytics, helping educators to personalize learning and
                  improve outcomes.
                </Typography>
              </Paper>
            </Slide>

            <Slide direction="up" triggerOnce={true} delay={300}>
              <Paper
                elevation={3}
                sx={{
                  flex: "1 0 200px",
                  padding: "20px 32px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                  textAlign: "left",
                }}
              >
                <img
                  src="/src/assets/img/home/collab.gif"
                  alt="Collaborate with classmates"
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    margin: "0 auto 20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}
                >
                  Collaborate with classmates
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "16px", color: "#666" }}
                >
                  The eLMS allows the students to chat with classmates, join
                  forum discussions, write a blog, and facilitate group work
                  activities — all within the site.
                </Typography>
              </Paper>
            </Slide>
          </Box>
        </Container>
      </Element>

      <Element
        name="special-identification"
        className="special-identification"
        id="tool"
      >
        <Container>
          <Box
            sx={{
              padding: "70px 0",
            }}
          >
            <Fade>
              <Typography
                variant="h2"
                sx={{
                  fontSize: "40px",
                  color: "#08aae0",
                  textAlign: "center",
                  marginBottom: "40px",
                  fontWeight: "bold",
                }}
              >
                Special Education Identification Tool
              </Typography>
            </Fade>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                padding: "0 40px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  paddingRight: { md: "20px" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Slide direction="left" triggerOnce={true} delay={200}>
                  <Typography
                    variant="body1"
                    className="special-h"
                    sx={{
                      fontSize: "22px",
                      color: "#666",
                      marginBottom: "30px",
                    }}
                  >
                    "Empowering Educators and Parents to Identify and Support
                    Students with Special Needs"
                  </Typography>
                </Slide>
                <Slide direction="left" triggerOnce={true} delay={400}>
                  <Box
                    component="ul"
                    sx={{
                      listStyleType: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <Box
                      component="li"
                      className="special-ed"
                      sx={{
                        fontSize: "20px",
                        color: "#333",
                        fontStyle: "oblique",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faSchool}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Comprehensive assessment toolkit
                    </Box>
                    <Box
                      component="li"
                      className="special-ed"
                      sx={{
                        fontSize: "20px",
                        color: "#333",
                        fontStyle: "oblique",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBook}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Individualized education plans
                    </Box>
                    <Box
                      component="li"
                      className="special-ed"
                      sx={{
                        fontSize: "20px",
                        color: "#333",
                        fontStyle: "oblique",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChild}
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Professional development resources
                    </Box>
                  </Box>
                </Slide>
                <Slide direction="left" triggerOnce={true} delay={500}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      background: "linear-gradient(to right, #e0ce0e, #f7a600)",
                      color: "#555", // ensure the text is visible on the gradient
                      "&:hover": {
                        background:
                          "linear-gradient(to right, #f5b700, #d35400)",
                        color: "#fff",
                      },
                    }}
                    onClick={showLoginModal}
                  >
                    Get Started{" "}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      style={{ marginLeft: "10px" }}
                    />
                  </Button>
                </Slide>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: { md: "40px" },
                }}
              >
                <Zoom triggerOnce={true}>
                  <img
                    src="/src/assets/img/home/stu.png"
                    alt="Special Education"
                    style={{ width: "100%", maxWidth: "500px" }}
                  />
                </Zoom>
              </Box>
            </Box>
          </Box>
        </Container>
        <LoginModal isVisible={isModalVisible} onClose={hideLoginModal} />
      </Element>

      <Box className="programs-section">
        <Programs />
      </Box>

      <Element name="contact" id="contact">
        <Container sx={{ py: 9 }}>
          <Fade triggerOnce={false} direction="up">
            <Typography
              variant="h2"
              gutterBottom
              className="contact-h2"
              align="center"
              sx={{
                fontWeight: "bold",
                color: "#333",
                mb: 4,
                fontSize: { xs: "2.5rem", md: "3rem" },
              }}
            >
              Contact Us
            </Typography>
          </Fade>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: { xs: 2, md: 3 }, // Reduced gap
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2, // Reduced gap
              }}
            >
              <Slide direction="left" triggerOnce={true}>
                <Paper
                  elevation={8}
                  sx={{
                    padding: { xs: 1, md: 4 },
                    borderRadius: 12,
                    backgroundColor: "#f5f5f5",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#555", mb: 2, fontSize: { xs: "1rem", md: "1.5rem" }, textAlign: { xs: "center", md: "left" } }}
                  >
                    Contact Details
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#333",
                        fontSize: { xs: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{ marginRight: 8, color: "#ff5722" }}
                      />
                      {branches[currentBranchIndex].address}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#333",
                        fontSize: { xs: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ marginRight: 8, color: "#4caf50" }}
                      />
                      {branches[currentBranchIndex].phone}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#333",
                        fontSize: { xs: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ marginRight: 8, color: "#3f51b5" }}
                      />
                      {branches[currentBranchIndex].email}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#333",
                        fontSize: { xs: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faFacebook}
                        style={{ marginRight: 8, color: "#4267B2" }}
                      />
                      <a
                        href={branches[currentBranchIndex].fbPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#3f51b5",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                        }}
                      >
                        {branches[currentBranchIndex].fbPageName}
                      </a>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 3,
                      alignItems: { xs: "center", sm: "center", lg:"flex-start" }, // Center buttons on smaller screens
                    }}
                  >
                    {["Batangas", "Rosario", "Bauan", "Metro Tagaytay"].map(
                      (branchName, index) => (
                        <Button
                          variant="contained"
                          key={index}
                          sx={{
                            backgroundColor:
                              currentBranchIndex === index ? "#ff5722" : "#ddd",
                            color:
                              currentBranchIndex === index ? "#fff" : "#333",
                            "&:hover": {
                              backgroundColor:
                                currentBranchIndex === index
                                  ? "#e64a19"
                                  : "#bbb",
                            },
                            borderRadius: 20,
                            
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                            width: { xs: "15rem", sm: "20rem", lg: "33rem" },
                            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // Adjusted font size for smaller screens
                          }}
                          onClick={() => handleBranchChange(index)}
                        >
                          {branchName}
                        </Button>
                      )
                    )}
                  </Box>
                </Paper>
              </Slide>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flow",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Slide direction="right" triggerOnce={true}>
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    width: "100%",
                  }}
                >
                  <iframe
                    title="map"
                    src={branches[currentBranchIndex].mapSrc}
                    width="100%"
                    height="450" // Adjusted height to be closer
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </Paper>
              </Slide>
            </Box>
          </Box>
        </Container>
      </Element>

      {isScrollToTopVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}

      <Footer />

      {/* {isModalVisible && <LoginModal onClose={hideLoginModal} />} */}
    </div>
  );
};

export default Home;
