import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaPuzzlePiece, FaChalkboardTeacher, FaUserMd, FaArrowRight, FaPhone, FaEnvelope } from 'react-icons/fa';
import Footer from '../components/home/Footer';
import Navbar from '../components/home/Navbar';

const Enrollment = () => {
  const [hoveredBranch, setHoveredBranch] = useState(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const branches = [
    { name: 'Batangas', address: 'Pastor Road, Gulod Labac, Batangas City', phone: '0960 271 5298' },
    { name: 'Rosario', address: 'Brgy. Namunga, Rosario, Batangas', phone: '0915 781 2878' },
    { name: 'Bauan', address: 'Villa Florentina Subd., Manghinao Proper, Bauan, Batangas', phone: '+0917 857 1588 or 0939 923 3988' },
    { name: 'Metro Tagaytay', address: '321 Highland Ave, Tagaytay', phone: 'n/a' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Enroll Now at Sunhill
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
              Discover a world of possibilities through our innovative educational programs designed to nurture every child's unique potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="inline-flex items-center px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
                <FaPhone className="mr-2" />
                Contact Us
              </Link>  
            </div>
          </motion.div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Campuses</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect Sunhill campus for your child's educational journey
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {branches.map((branch) => (
            <motion.div
              key={branch.name}
              onMouseEnter={() => setHoveredBranch(branch.name)}
              onMouseLeave={() => setHoveredBranch(null)}
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mx-auto">
                  <FaMapMarkerAlt className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sunhill {branch.name}</h3>
                <div className={`transition-all duration-300 ${hoveredBranch === branch.name ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-gray-600 mb-2">{branch.address}</p>
                  <p className="text-indigo-600 font-medium">{branch.phone}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Programs Section */}
      <div className="bg-gradient-to-b from-white to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">Our Educational Programs</h2>
          </motion.div>

          {/* Montessori Programs */}
          <div className="mb-24">
            <motion.h3 {...fadeIn} className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Sunhill Montessori
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Early Intervention",
                  age: "2-3 years old",
                  icon: <FaPuzzlePiece className="w-8 h-8 text-indigo-600" />,
                  features: ["Developmental activities", "Social interaction", "Basic skills development"]
                },
                {
                  title: "Pre-School",
                  age: "3-5 years old",
                  icon: <FaGraduationCap className="w-8 h-8 text-indigo-600" />,
                  features: ["Nursery", "Casa 1", "Casa 2"]
                },
                {
                  title: "Grade School",
                  age: "Levels 1-6",
                  icon: <FaChalkboardTeacher className="w-8 h-8 text-indigo-600" />,
                  features: ["Comprehensive curriculum", "Holistic development", "Progressive learning"]
                }
              ].map((program) => (
                <motion.div
                  key={program.title}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 mx-auto">
                    {program.icon}
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">{program.title}</h4>
                  <p className="text-indigo-600 font-medium mb-4">{program.age}</p>
                  <ul className="space-y-3">
                    {program.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <FaArrowRight className="w-4 h-4 text-indigo-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Add-on Programs */}
          <motion.div {...fadeIn} className="text-center mb-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Add-on Programs</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["LEGO Education | Robotics", "Faithbook", "Mental Math Academy", "Reading Comprehension Program","English Computerized Learning Program"].map((program) => (
                <span key={program} className="px-6 py-3 bg-white text-indigo-700 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                  {program}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Developmental Education */}
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Sunhill Developmental Education
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <FaPuzzlePiece className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Specialized Programs</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "ADHD", "ASD", "Global Development", "Cerebral Palsy",
                    "Learning Disabilities", "Down Syndrome", "Intellectual Disabilities"
                  ].map((program) => (
                    <div key={program} className="flex items-center text-gray-600">
                      <FaArrowRight className="w-4 h-4 text-indigo-500 mr-2" />
                      {program}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <FaUserMd className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Therapy Services</h3>
                </div>
                <div className="space-y-4">
                  {["Physical Therapy", "Speech Therapy", "Occupational Therapy", "SPED Tutorial"].map((service) => (
                    <div key={service} className="flex items-center text-gray-600">
                      <FaArrowRight className="w-4 h-4 text-indigo-500 mr-2" />
                      {service}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-indigo-600 font-medium">
                  Available at our Batangas and Tanauan branches
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-24">
        <motion.div {...fadeIn} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Enroll Now</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Take the first step towards unlocking your child's full potential with Sunhill's comprehensive educational programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
              <FaEnvelope className="mr-2" />
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Enrollment;