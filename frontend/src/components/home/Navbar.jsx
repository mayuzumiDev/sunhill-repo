import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { stack as Menu } from "react-burger-menu";
import '../../styles/HomePage.css';  // if the CSS file is in the same folder



const Navbar = ({ darkMode, toggleDarkMode, buttonPosition }) => {
  const [navbarSolid, setNavbarSolid] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setNavbarSolid(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      setIsMenuButtonVisible(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    setIsMenuButtonVisible(window.innerWidth <= 768);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to determine the correct navigation behavior based on the current page
  const getLink = (section) => {
    if (location.pathname === "/") {
      return (
        <a
          href={`#${section}`}
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(section);
          }}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </a>
      );
    } else {
      return (
        <RouterLink to={`/#${section}`} className="nav-link">
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </RouterLink>
      );
    }
  };

  return (
    <div className={`navbar ${navbarSolid ? "solid" : ""}`}>
      <Fade triggerOnce={true} direction="up">
        <RouterLink to="/" className="logo">
          {/* <img src="/src/assets/img/home/sunhilllogo.png" alt="Logo" /> */}
        </RouterLink>
      </Fade>
      <Fade triggerOnce={true} delay={200} direction="up">
        <div className="banner">
          <h2>Sunhill Montessori Casa Education Services</h2>
        </div>
      </Fade>
      {/* Regular navigation links - Hide on smaller screens */}
      {!isMenuButtonVisible && (
        <Fade triggerOnce={true} delay={400} direction="up">
          <div className="nav-links">
            {getLink("home")}
            {getLink("about")}
            {getLink("tool")}
            {getLink("contact")}
            <div className="dark-container">
              <button
                className={`dark-mode-toggle ${darkMode ? "clicked" : ""}`}
                onClick={toggleDarkMode}
                style={{ transform: `translateX(${buttonPosition}px)` }}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <FontAwesomeIcon icon={faSun} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} />
                )}
              </button>
            </div>
            <RouterLink to="/login/" className="login-btn">
             <p>Login</p>
            </RouterLink>
          </div>
        </Fade>
      )}
      {/* Hamburger Menu Icon - Only show on smaller screens */}
      {isMenuButtonVisible && (
        <Menu
          right
          isOpen={isMenuOpen}
          onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
        >
          {getLink("home")}
          {getLink("about")}
          {getLink("tool")}
          {getLink("contact")}
          <div className="dark-container">
            <button
              className={`dark-mode-toggle ${darkMode ? "clicked" : ""}`}
              onClick={toggleDarkMode}
              style={{ transform: `translateX(${buttonPosition}px)` }}
            >
              {darkMode ? (
                <FontAwesomeIcon icon={faSun} />
              ) : (
                <FontAwesomeIcon icon={faMoon} />
              )}
            </button>
          </div>
          <RouterLink to="/login" className="login-btn">
            Login
          </RouterLink>
        </Menu>
      )}
    </div>
  );
};

export default Navbar;