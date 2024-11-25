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
  faStar,
  faGraduationCap,
  faChalkboardTeacher,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link, Element } from "react-scroll";
import { Fade, Slide, Zoom, AttentionSeeker } from "react-awesome-reveal";
import Sunvid from '../assets/img/home/sunvid.mp4';
import Sunhill from '../assets/img/home/sunhill.jpg';
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Programs from "../components/home/Programs";
import LoginModal from "../components/home/LoginModal";
import StepperComponent from "../components/home/Stepper";
import Btn from "../components/home/Button";
import { motion, AnimatePresence } from 'framer-motion';

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
      "El Sitio Filipino Camping and Teambuilding Center, Dumuclay East, Batangas City, Philippines",
    phone: "0917 146 8790",
    email: "sdebatangascity@sunhilledu.com",
    fbPage: "https://www.facebook.com/SDEBatangasCity",
    fbPageName: "Sunhill Montessori Casa-Metro Tagaytay",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d838.1638972888367!2d121.11830807386876!3d13.742318369192658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd05aeeeee250f%3A0x4bc4bfb66572ae61!2sSunhill%20Developmental%20Education%20Batangas!5e1!3m2!1sen!2sph!4v1732509328373!5m2!1sen!2sph",
}];

const Home = () => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [buttonPosition, setButtonPosition] = useState(0);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);

    const handleScroll = () => {
      setIsScrollToTopVisible(window.scrollY > 300);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'special-identification', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    const handleParallax = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleParallax);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleParallax);
    };
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
      {isLoading ? (
        <div className="fixed inset-0 bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 z-50 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Main spinner */}
            <div className="w-40 h-40">
              <div className="absolute inset-0 border-8 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-6 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-8 border-4 border-t-yellow-500 border-r-yellow-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            {/* Centered smaller logo with pulse animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={Sunhill} 
                alt="Sunhill Logo" 
                className="w-16 h-16 rounded-full object-cover animate-pulse"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            buttonPosition={buttonPosition}
            activeSection={activeSection}
          />

          {/* Hero Section */}
          <Element name="home" className="relative h-screen" id="home">
            <div className="relative h-full w-full top-19 overflow-hidden">
              {/* Video Background with Enhanced Parallax */}
              <div 
                className="absolute inset-0 z-0 parallax transform scale-110" 
                data-speed="0.3"
                style={{
                  filter: darkMode ? 'brightness(70%)' : 'brightness(90%)'
                }}
              >
                <video
                  src={Sunvid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Enhanced Content Overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-black/70 via-black/50 to-transparent">
                <div className="text-center text-white px-4 transform translate-y-[-10%] max-w-4xl">
                  <AttentionSeeker effect="pulse" delay={300}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
                      Welcome to
                      <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 text-transparent bg-clip-text animate-gradient">
                        {" "}Sunhill
                      </span>
                      <span className="text-white"> Montessori Casa</span>
                    </h1>
                  </AttentionSeeker>
                  <Fade triggerOnce={false} delay={300}>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light leading-relaxed">
                      We are an institution driven by our ultimate goal of bringing each child closer to God.
                    </p>
                  </Fade>

                  <Fade direction="up" triggerOnce={true}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Link to="about" smooth={true} duration={500}>
                        <Btn />
                      </Link>
                    </div>
                  </Fade>
                </div>
              </div>

              {/* Enhanced Wave Effect */}
              <div className="absolute bottom-0 left-0 right-0 wave-container opacity-70">
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

          {/* Testimonials Section */}
              
          {/* Statistics Section */}
          <Element name="stats" className="section-transition py-16 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {[
                  { number: "500+", label: "Students", icon: faGraduationCap },
                  { number: "50+", label: "Teachers", icon: faChalkboardTeacher },
                  { number: "18+", label: "Years Experience", icon: faClock },
                  { number: "4", label: "Branches", icon: faSchool }
                ].map((stat, index) => (
                  <Fade delay={index * 100} key={index}>
                    <div className="text-center text-white">
                      <FontAwesomeIcon 
                        icon={stat.icon} 
                        className="text-4xl mb-4 opacity-90"
                      />
                      <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</h3>
                      <p className="text-lg opacity-90">{stat.label}</p>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </Element>

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
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      <p className="flex items-center text-xs sm:text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-red-500" />
                        {branches[currentBranchIndex].address}
                      </p>
                      <p className="flex items-center text-xs sm:text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                        <FontAwesomeIcon icon={faPhone} className="mr-3 text-green-500" />
                        {branches[currentBranchIndex].phone}
                      </p>
                      <p className="flex items-center text-xs sm:text-sm text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-3 text-blue-500" />
                        {branches[currentBranchIndex].email}
                      </p>
                      <a
                        href={branches[currentBranchIndex].fbPage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs sm:text-sm text-gray-600 hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faFacebook} className="mr-3 text-[#4267B2]" />
                        <span className="text-blue-600 font-medium hover:text-blue-700">{branches[currentBranchIndex].fbPageName}</span>
                      </a>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2">
                      {["Batangas", "Rosario", "Bauan", "Sunhill Developmental Education"].map((branchName, index) => (
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

          {/* Enhanced Scroll to Top Button with Bounce */}
          <AnimatePresence>
            {isScrollToTopVisible && (
              <motion.button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-50 p-4 rounded-full
                  bg-gradient-to-r from-orange-500 to-yellow-500 text-white
                  shadow-lg hover:shadow-xl transition-all duration-300
                  backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -15, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 1,
                      ease: "easeInOut"
                    }
                  }
                }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FontAwesomeIcon 
                  icon={faArrowUp} 
                  className="text-xl" 
                />
              </motion.button>
            )}
          </AnimatePresence>

          <Footer />
          <LoginModal isVisible={isModalVisible} onClose={hideLoginModal} />
        </>
      )}
    </div>
  );
};

export default Home;
