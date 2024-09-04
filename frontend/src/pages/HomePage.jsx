import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faArrowRight,
  faSun,
  faMoon,
  faChild,
  faBook,
  faSchool,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link, Element } from "react-scroll";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import "../styles/HomePage.css";
import { stack as Menu } from "react-burger-menu";

const branches = [
  {
    address: "Pastor Road, Gulod Labac, Batangas City",
    phone: "0960 271 5298",
    email: "smcbatangascity@sunhilledu.com",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1867.0134492727382!2d121.072805!3d13.759904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd054e7cd0e3c9%3A0xc70c4d1504ab5814!2sSunhill%20Montessori%20Casa%20-%20Batangas!5e1!3m2!1sen!2sus!4v1722871137741!5m2!1sen!2sus",
  },
  {
    address: "Branch 2 Address",
    phone: "1234 567 890",
    email: "branch2@example.com",
    mapSrc:
      "https://maps.google.com/maps?q=Branch%202%20Address&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    address: "Branch 3 Address",
    phone: "0987 654 321",
    email: "branch3@example.com",
    mapSrc:
      "https://maps.google.com/maps?q=Branch%203%20Address&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    address: "Branch 4 Address",
    phone: "5555 666 777",
    email: "branch4@example.com",
    mapSrc:
      "https://maps.google.com/maps?q=Branch%204%20Address&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
];

const HomePage = () => {
  const [navbarSolid, setNavbarSolid] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });
  const [buttonPosition, setButtonPosition] = useState(0);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavbarSolid(true);
    } else {
      setNavbarSolid(false);
    }
    setIsScrollToTopVisible(window.scrollY > 300);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    setButtonPosition(newDarkMode ? 25 : 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBranchChange = (index) => {
    setCurrentBranchIndex(index);
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
      setButtonPosition(25);
    }

    window.addEventListener("scroll", handleScroll);

    // Check initial window width for determining the visibility of the menu button
    if (window.innerWidth <= 768) {
      setIsMenuButtonVisible(true);
    } else {
      setIsMenuButtonVisible(false);
    }

    // Update visibility of the menu button on window resize
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMenuButtonVisible(true);
      } else {
        setIsMenuButtonVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className={`navbar ${navbarSolid ? "solid" : ""}`}>
        <Fade triggerOnce={true} direction="up">
          <div className="logo">
            <img src="/src/assets/images/sunhill-logo.png" alt="Logo" />
          </div>
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
              <Link
                to="home"
                smooth={true}
                duration={500}
                activeClass="active"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="about"
                smooth={true}
                duration={500}
                activeClass="active"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="special-identification"
                smooth={true}
                activeClass="active"
                duration={500}
                onClick={toggleMenu}
              >
                Tool
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                activeClass="active"
                onClick={toggleMenu}
              >
                Contact
              </Link>
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
              <a href="#login" className="login-btn" onClick={toggleMenu}>
                Login
              </a>
            </div>
          </Fade>
        )}
      </div>

      {/* Hamburger Menu Icon - Only show on smaller screens */}
      {isMenuButtonVisible && (
        <Menu
          right
          isOpen={isMenuOpen}
          onStateChange={({ isOpen }) => setIsMenuOpen(isOpen)}
        >
          <Link
            to="home"
            smooth={true}
            duration={500}
            activeClass="active"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="about"
            smooth={true}
            duration={500}
            activeClass="active"
            onClick={toggleMenu}
          >
            About
          </Link>
          <Link
            to="special-identification"
            smooth={true}
            activeClass="active"
            duration={500}
            onClick={toggleMenu}
          >
            Tool
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            activeClass="active"
            onClick={toggleMenu}
          >
            Contact
          </Link>
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
          <a href="#login" className="login-btn" onClick={toggleMenu}>
            Login
          </a>
        </Menu>
      )}

      {/* Main Content Sections */}
      <Element name="home" className="home">
        <div className="home-banner-content">
          <Fade direction="down" triggerOnce={true}>
            <h1>Welcome to Sunhill Montessori Casa</h1>
          </Fade>
          <Fade triggerOnce={true} delay={300}>
            <p>
              We are an institution driven by our ultimate goal of bringing each
              child closer to God.
            </p>
          </Fade>
          <Fade direction="up" triggerOnce={true}>
            <Link
              to="about"
              className="cta-button"
              smooth={true}
              duration={500}
            >
              Learn More{" "}
              <FontAwesomeIcon icon={faArrowRight} className="arrowRight" />
            </Link>
          </Fade>
        </div>
      </Element>

      <Element name="about" className="about">
        <Fade triggerOnce={true}>
          <div className="section-content">
            <div className="about-items">
              <Slide direction="up" triggerOnce={true} delay={50}>
                <div className="about-item">
                  <img
                    src="/src/assets/images/resources.gif"
                    alt="Easy access to learning modules"
                  />
                  <h3>Easy access to learning modules</h3>
                  <p>
                    Students can study ahead, review past lessons, and watch
                    instructional videos with a click or a tap of a button on
                    any gadget.
                  </p>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={true} delay={100}>
                <div className="about-item">
                  <img
                    src="/src/assets/images/interactive.gif"
                    alt="interactive activities and assessments"
                  />
                  <h3>Activities and assessments</h3>
                  <p>
                    Students can test their knowledge and skills through
                    interactive polls, quizzes, and debates, among others.
                  </p>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={true} delay={200}>
                <div className="about-item">
                  <img
                    src="/src/assets/images/progress.gif"
                    alt="Progress monitoring"
                  />
                  <h3>Progress monitoring</h3>
                  <p>
                    Track student progress with comprehensive reports and
                    analytics, helping educators to personalize learning and
                    improve outcomes.
                  </p>
                </div>
              </Slide>
              <Slide direction="up" triggerOnce={true} delay={300}>
                <div className="about-item">
                  <img src="/src/assets/images/collab.gif" alt="collab" />
                  <h3>Collaborate with classmates</h3>
                  <p>
                    The eLMS allows the students to chat with classmates, join
                    forum discussions, write a blog, and facilitate group work
                    activities — all within the site.
                  </p>
                </div>
              </Slide>
            </div>
          </div>
        </Fade>
      </Element>

      <Element name="special-identification" className="special-identification">
        <div className="section-content">
          <Fade>
            <h2>Special Education Identification Tool</h2>
          </Fade>
          <div className="special-identification-content">
            <div className="special-identification-text">
              <Slide direction="left" triggerOnce={true} delay={200}>
                <p>"Empowering Educators and Parents to Identify and Support</p>
                <p className="para">Students with Special Needs"</p>
              </Slide>
              <Slide direction="left" triggerOnce={true} delay={400}>
                <ul>
                  <li>
                    <FontAwesomeIcon icon={faSchool} className="icon" />{" "}
                    Comprehensive assessment toolkit
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faBook} className="icon" />{" "}
                    Individualized education plans
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faChild} className="icon" />{" "}
                    Professional development resources
                  </li>
                </ul>
              </Slide>
              <Slide direction="left" triggerOnce={true} delay={600}>
                <a href="#login" className="cta-button-special">
                  Get Started{" "}
                  <FontAwesomeIcon icon={faArrowRight} className="arrowRight" />
                </a>
              </Slide>
            </div>
            <div className="special-identification-image">
              <Zoom triggerOnce={true}>
                <img
                  src="/src/assets/images/female-student.png"
                  alt="Special Education"
                />
              </Zoom>
            </div>
          </div>
        </div>
      </Element>

      <Element name="contact" className="contact">
        <div className="container">
          <Fade triggerOnce={true} direction="up">
            <h2 className="heading">Contact Us</h2>
          </Fade>
          <div className="content">
            <Slide direction="left" triggerOnce={true}>
              <div className="contact-details">
                <div className="contact-info">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
                  <span>{branches[currentBranchIndex].address}</span>
                </div>
                <div className="contact-info">
                  <FontAwesomeIcon icon={faPhone} className="icon" />
                  <span>{branches[currentBranchIndex].phone}</span>
                </div>
                <div className="contact-info">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <span>{branches[currentBranchIndex].email}</span>
                </div>
                <div className="branch-buttons">
                  {branches.map((branch, index) => (
                    <button
                      key={index}
                      onClick={() => handleBranchChange(index)}
                      className={`branch-button ${
                        currentBranchIndex === index ? "active" : ""
                      }`}
                    >
                      Branch {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </Slide>
            <Slide direction="right" triggerOnce={true}>
              <div className="map">
                <iframe
                  title="frame"
                  src={branches[currentBranchIndex].mapSrc}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                ></iframe>
              </div>
            </Slide>
          </div>
        </div>
      </Element>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/privacy-policy">Privacy Policy</a>
          </div>
          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Sunhill Montessori Casa. All
            rights reserved.
          </p>
        </div>
      </footer>
      {/* Scroll to Top Button */}
      {isScrollToTopVisible && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
    </div>
  );
};

export default HomePage;
