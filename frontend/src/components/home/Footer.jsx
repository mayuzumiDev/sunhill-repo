  // src/components/Footer.js
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faHeart 
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const checkAndUpdateVisitor = () => {
      const lastVisit = localStorage.getItem('lastVisit');
      const today = new Date().toDateString();
      
      // Update total visitor count from localStorage
      const totalVisitors = parseInt(localStorage.getItem('totalVisitors') || '0');
      
      if (lastVisit !== today) {
        // New visit for today
        localStorage.setItem('lastVisit', today);
        localStorage.setItem('totalVisitors', (totalVisitors + 1).toString());
        setVisitorCount(totalVisitors + 1);
      } else {
        setVisitorCount(totalVisitors);
      }
    };

    checkAndUpdateVisitor();
  }, []);

  const footerLinks = {
    about: [
      { name: "Our Story", path: "/about" },
      { name: "Mission & Vision", path: "/mission" },
      { name: "Our Team", path: "/team" },
    ],
    programs: [
      { name: "Montessori Program", path: "/programs" },
      { name: "Special Education", path: "/special-education" },
      { name: "Summer Activities", path: "/summer" },
    ],
    resources: [
      { name: "Parent Portal", path: "/login/parent" },
      { name: "Teacher Portal", path: "/login/teacher" },
      { name: "Stundent Portal", path: "/login/student" },
      { name: "FAQ", path: "/faq" },
    ],
  };

  return (
    <footer className="bg-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* School Info */}
          <Fade cascade damping={0.2}>
            <div className="space-y-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">
                Sunhill Montessori Casa
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>Pastor Road, Gulod Labac, Batangas City</span>
                </p>
                <p className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                  <FontAwesomeIcon icon={faPhone} />
                  <a href="tel:0960 271 5298">0960 271 5298</a>
                </p>
                <p className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <a href="mailto:smcbatangascity@sunhilledu.com">smcbatangascity@sunhilledu.com</a>
                </p>
                {/* Add visitor counter display */}
                <p className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Total Visitors:</span>
                  <span className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                    {visitorCount}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4 ml-0 sm:ml-10">
                <h4 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-200">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Fade>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              { [
                { icon: faFacebook, url: "https://facebook.com" },
                { icon: faTwitter, url: "https://twitter.com" },
                { icon: faInstagram, url: "https://instagram.com" },
                { icon: faLinkedin, url: "https://linkedin.com" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transform hover:scale-110 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={social.icon} size="lg" />
                </a>
              )) }
            </div>

            <div className="text-center md:text-right text-sm text-gray-600 dark:text-gray-400">
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
