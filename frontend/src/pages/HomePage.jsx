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
import { Fade, Slide, Zoom, AttentionSeeker } from "react-awesome-reveal";
import Sunvid from '../assets/img/home/sunvid.mp4';
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Programs from "../components/home/Programs";
import LoginModal from "../components/home/LoginModal";
import StepperComponent from "../components/home/Stepper";
import Btn from "../components/home/Button";

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
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollToTopVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add parallax effect on scroll
  useEffect(() => {
    const handleParallax = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    setButtonPosition(newDarkMode ? 25 : 0);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLoginModal = () => setIsModalVisible(true);
  const hideLoginModal = () => setIsModalVisible(false);

  const handleBranchChange = (index) => {
    setCurrentBranchIndex(index);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-white"}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        buttonPosition={buttonPosition}
      />

      {/* Hero Section */}
      <Element name="home" className="relative h-screen" id="home">
        <div className="relative h-full w-full top-19 overflow-hidden">
          {/* Video Background with Parallax */}
          <div className="absolute inset-0 z-0 parallax" data-speed="0.3">
            <video
              src={Sunvid}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover scale-110 filter brightness-90"
            />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-black/60 via-black/50 to-black/30">
            <div className="text-center text-white px-4 transform translate-y-[-10%]">
              <AttentionSeeker effect="pulse" delay={300}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Welcome to
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 text-transparent bg-clip-text animate-gradient">
                    {" "}Sunhill
                  </span>
                  <span className="text-white"> Montessori Casa</span>
                </h1>
              </AttentionSeeker>
              <Fade triggerOnce={false} delay={300}>
                <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto font-light">
                  We are an institution driven by our ultimate goal of bringing each child closer to God.
                </p>
              </Fade>

              <Fade direction="up" triggerOnce={true}>
                <Link to="about" smooth={true} duration={500}>
                  <Btn />
                </Link>
              </Fade>
            </div>
          </div>

          {/* Animated Wave Effect */}
          <div className="absolute bottom-0 left-0 right-0 wave-container">
            <svg className="w-full waves-svg" viewBox="0 24 150 28" preserveAspectRatio="none">
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                />
              </defs>
              <g className="waves">
                <use href="#gentle-wave" x="78" y="0" className="wave wave1" />
                <use href="#gentle-wave" x="78" y="3" className="wave wave2" />
                <use href="#gentle-wave" x="78" y="5" className="wave wave3" />
                <use href="#gentle-wave" x="78" y="7" className="wave wave4" />
              </g>
            </svg>
          </div>
        </div>
      </Element>

      {/* Stepper Section */}
      <section className="py-16">
        <StepperComponent />
      </section>

      {/* About Section with Interactive Cards */}
      <Element name="about" className="section-transition border-t border-gray-200 py-40 relative overflow-hidden" id="about">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none"></div>
        <div className="container mx-auto px-7 relative z-10">
          <AttentionSeeker effect="bounce">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text animate-gradient">
                Sunhill LMS
              </span>
            </h2>
          </AttentionSeeker>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Enhanced Feature Cards */}
            {[
              {
                img: "/src/assets/img/home/resources.gif",
                title: "Easy access to learning modules",
                description: "Students can study ahead, review past lessons, and watch instructional videos with a click or a tap.",
                delay: 50,
                color: "blue"
              },
              {
                img: "/src/assets/img/home/interactive.gif",
                title: "Interactive activities and assessments",
                description: "Students can test their knowledge and skills through interactive polls, quizzes, and debates.",
                delay: 100,
                color: "green"
              },
              {
                img: "/src/assets/img/home/progress.gif",
                title: "Progress monitoring",
                description: "Track student progress with comprehensive reports and analytics, helping educators personalize learning.",
                delay: 150,
                color: "orange"
              },
              {
                img: "/src/assets/img/home/collab.gif",
                title: "Collaborate with classmates",
                description: "Chat with classmates, join forum discussions, write blogs, and facilitate group work activities.",
                delay: 200,
                color: "purple"
              },
            ].map((card, index) => (
              <Slide direction="up" triggerOnce={true} delay={card.delay} key={index}>
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transform transition-all duration-500
                    hover:-translate-y-2 hover:shadow-xl hover:scale-105 cursor-pointer
                    ${hoveredCard === index ? `ring-2 ring-${card.color}-400 ring-opacity-50` : ''}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full max-w-[160px] mx-auto transform transition-transform duration-500
                        hover:scale-110"
                    />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {card.description}
                  </p>
                </div>
              </Slide>
            ))}
          </div>
        </div>
      </Element>

      {/* Special Identification Section */}
      <Element name="special-identification" className="section-transition py-20 border-t border-gray-200" id="tool">
        <div className="container mx-auto px-4 relative z-10">
          <Fade>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
              Special Education Identification Tool
            </h2>
          </Fade>

          <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto">
            <div className="w-full md:w-1/2">
              <Slide direction="left" triggerOnce={true}>
                <p className="text-xl text-primary mb-6 font-light italic leading-relaxed">
                  "Empowering Educators and Parents to Identify and Support Students with Special Needs"
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-base text-primary transform hover:translate-x-2 transition-all duration-300 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faSchool} className="text-blue-500  text-lg" />
                    </div>
                    <span className="font-medium">Comprehensive assessment toolkit</span>
                  </li>
                  <li className="flex items-center text-base text-primary transform hover:translate-x-2 transition-all duration-300 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50">
                    <div className="w-10 h-10 rounded-full bg-blue-100  flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faBook} className="text-green-500  text-lg" />
                    </div>
                    <span className="font-medium">Individualized education plans</span>
                  </li>
                  <li className="flex items-center text-base text-primary transform hover:translate-x-2 transition-all duration-300 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700/50">
                    <div className="w-10 h-10 rounded-full bg-blue-100  flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faChild} className="text-orange-500  text-lg" />
                    </div>
                    <span className="font-medium">Professional development resources</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={showLoginModal}
                    className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-yellow-500 dark:to-orange-600 text-white rounded-lg
                      hover:from-blue-600 hover:to-blue-700 dark:hover:from-orange-600 dark:hover:to-red-600 transition-all duration-300 
                      flex items-center justify-center transform hover:scale-105 shadow-md w-full sm:w-auto"
                  >
                    <span className="font-medium text-base">Get Started</span>
                    <FontAwesomeIcon 
                      icon={faArrowRight} 
                      className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                    />
                  </button>
                </div>
              </Slide>
            </div>
            
            <div className="w-full md:w-1/2">
              <Zoom triggerOnce={true}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 dark:from-blue-500/30 dark:to-purple-600/30 rounded-2xl transform rotate-2"></div>
                  <img
                    src="/src/assets/img/home/stu.png"
                    alt="Special Education"
                    className="w-full max-w-md mx-auto relative rounded-xl shadow-xl transform hover:scale-102 transition-transform duration-300"
                  />
                </div>
              </Zoom>
            </div>
          </div>
        </div>
      </Element>

      {/* Programs Section */}
      <Programs />

      {/* Contact Section */}
      <Element name="contact" className="section-transition py-12" id="contact">
        <div className="container mx-auto px-4 relative z-10">
          <Fade triggerOnce={false} direction="up">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
              Contact Us
            </h2>
          </Fade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Slide direction="left" triggerOnce={true}>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <p className="flex items-center text-xs text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-red-500" />
                    {branches[currentBranchIndex].address}
                  </p>
                  <p className="flex items-center text-xs text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                    <FontAwesomeIcon icon={faPhone} className="mr-3 text-green-500" />
                    {branches[currentBranchIndex].phone}
                  </p>
                  <p className="flex items-center text-xs text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-500" />
                    {branches[currentBranchIndex].email}
                  </p>
                  <a
                    href={branches[currentBranchIndex].fbPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faFacebook} className="mr-3 text-[#4267B2]" />
                    <span className="text-blue-600 font-medium hover:text-blue-700">{branches[currentBranchIndex].fbPageName}</span>
                  </a>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {["Batangas", "Rosario", "Bauan", "Metro Tagaytay"].map((branchName, index) => (
                    <button
                      key={index}
                      onClick={() => handleBranchChange(index)}
                      className={`py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium
                        ${currentBranchIndex === index 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {branchName}
                    </button>
                  ))}
                </div>
              </div>
            </Slide>

            <Slide direction="right" triggerOnce={true}>
              <div className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-[400px]">
                <iframe
                  title="map"
                  src={branches[currentBranchIndex].mapSrc}
                  className="w-full h-full border-0"
                  allowFullScreen
                ></iframe>
              </div>
            </Slide>
          </div>
        </div>
      </Element>

      {/* Scroll to Top Button */}
      {isScrollToTopVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top fixed bottom-8 right-8 w-14 h-14 z-50 rounded-full
            flex items-center justify-center shadow-lg transition-all duration-300
            hover:scale-110 backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon 
            icon={faArrowUp} 
            className="scroll-to-top-icon text-white text-xl" 
          />
        </button>
      )}

      <Footer />
      <LoginModal isVisible={isModalVisible} onClose={hideLoginModal} />
    </div>
  );
};

export default Home;
