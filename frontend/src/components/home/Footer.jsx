  // src/components/Footer.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faHeart,
  faArrowUp,
  faCalendarAlt,
  faClock,
  faUsers,
  faSchool,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Fade, Zoom } from "react-awesome-reveal";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

// Logic to handle visitor count and last visit tracking
// Logic to handle visitor count and last visit tracking
useEffect(() => {
  const updateVisitorCount = () => {
    const today = new Date().toDateString();  // Current date
    const lastVisit = localStorage.getItem("lastVisit");  // Get last visit date
    const storedVisitorCount = parseInt(localStorage.getItem("visitorCount") || "0"); // Get stored visitor count for today
    const storedTotalVisitors = parseInt(localStorage.getItem("totalVisitors") || "0");  // Get total visitors count

    // If the user has visited today
    if (lastVisit !== today) {
      localStorage.setItem("lastVisit", today);  // Update last visit date
      localStorage.setItem("visitorCount", storedVisitorCount + 1); // Increment today's visitor count
      localStorage.setItem("totalVisitors", storedTotalVisitors + 1);  // Increment total visitor count
      setVisitorCount(storedVisitorCount + 1);  // Update state for today's count
      setTotalVisitors(storedTotalVisitors + 1);  // Update state for total count
    } else {
      setVisitorCount(storedVisitorCount);  // Today's visitors are the same if it's not a new day
      setTotalVisitors(storedTotalVisitors);  // Total visitors remain unchanged
    }
  };
// // Clear all data from localStorage
// localStorage.clear();

  updateVisitorCount(); 

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);


    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // };

  const footerLinks = {
    about: [
      { name: "Our Story", path: "/about", icon: faSchool },
      { name: "Mission & Vision", path: "/mission", icon: faUsers },
      { name: "Our Team", path: "/team", icon: faUsers },
    ],
    programs: [
      { name: "Montessori Program", path: "/programs", icon: faSchool },
      { name: "Special Education", path: "/special-education", icon: faUsers },
      { name: "Summer Activities", path: "/summer", icon: faCalendarAlt },
    ],
    resources: [
      { name: "Parent Portal", path: "/login/parent", icon: faUsers },
      { name: "Teacher Portal", path: "/login/teacher", icon: faUsers },
      { name: "Student Portal", path: "/login/student", icon: faUsers },
      { name: "FAQ", path: "/faq", icon: faNewspaper },
    ],
  };

  // const socialLinks = [
  //   { icon: faFacebook, url: "https://facebook.com", name: "Facebook", color: "#1877f2" },
  //   { icon: faTwitter, url: "https://twitter.com", name: "Twitter", color: "#1da1f2" },
  //   { icon: faInstagram, url: "https://instagram.com", name: "Instagram", color: "#e4405f" },
  //   { icon: faLinkedin, url: "https://linkedin.com", name: "LinkedIn", color: "#0077b5" },
  //   { icon: faYoutube, url: "https://youtube.com", name: "YouTube", color: "#ff0000" },
  //   { icon: faWhatsapp, url: "https://wa.me/09602715298", name: "WhatsApp", color: "#25d366" },
  // ];

  return (
    <footer className="bg-gray-800 pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Fade cascade damping={0.2}>
            <div className="space-y-4">
              <motion.h3 
                className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Sunhill Montessori Casa
              </motion.h3>
              <div className="space-y-3 text-gray-300">
                <motion.div 
                  className="flex items-center gap-2 hover:text-orange-500 transition-all duration-300 cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <FontAwesomeIcon icon={faClock} className="text-orange-500" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </motion.div>
                <motion.a
                  href="https://maps.google.com/?q=Pastor+Road+Gulod+Labac+Batangas+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-orange-500 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500" />
                  <span>Pastor Road, Gulod Labac, Batangas City</span>
                </motion.a>
                <motion.a
                  href="tel:0960 271 5298"
                  className="flex items-center gap-2 hover:text-orange-500 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <FontAwesomeIcon icon={faPhone} className="text-orange-500" />
                  <span>0960 271 5298</span>
                </motion.a>
                <motion.a
                  href="mailto:smcbatangascity@sunhilledu.com"
                  className="flex items-center gap-2 hover:text-orange-500 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-orange-500" />
                  <span>smcbatangascity@sunhilledu.com</span>
                </motion.a>
                {/* <Zoom>
                  <div className="flex items-center gap-2 text-sm bg-gray-700 p-3 rounded-lg shadow-lg mt-2">
                    <FontAwesomeIcon icon={faUsers} className="text-orange-500" />
                    <span className="font-semibold">Today's Visitors:</span>
                    <span className="bg-orange-500 px-2 py-1 rounded text-white">
                      {visitorCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-gray-700 p-3 rounded-lg shadow-lg">
                    <FontAwesomeIcon icon={faUsers} className="text-orange-500" />
                    <span className="font-semibold">Total Visitors:</span>
                    <span className="bg-orange-500 px-2 py-1 rounded text-white">
                      {totalVisitors}
                    </span>
                  </div>
                </Zoom> */}
              </div>
            </div>

            {/* Quick Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4 ml-0 sm:ml-10">
                <motion.h4 
                  className="text-lg font-semibold capitalize text-orange-400"
                  whileHover={{ scale: 1.05 }}
                >
                  {category}
                </motion.h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <motion.li 
                      key={link.name}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 text-gray-300 hover:text-orange-500 transition-all duration-300"
                      >
                        <FontAwesomeIcon icon={link.icon} className="text-orange-500" />
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </Fade>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {/* {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  onHoverStart={() => setActiveTooltip(social.name)}
                  onHoverEnd={() => setActiveTooltip(null)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-orange-500 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={social.icon} size="lg" style={{ color: social.color }} />
                  </a>
                  <AnimatePresence>
                    {activeTooltip === social.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                      >
                        {social.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))} */}
            </div>

            <div className="text-center md:text-right text-sm text-gray-400">
              <p className="flex items-center justify-center md:justify-end gap-1">
                Sunhill Montessori Casa &copy; {new Date().getFullYear()}
              </p>
              <div className="mt-2 space-x-4">
                <Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms-of-service" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
