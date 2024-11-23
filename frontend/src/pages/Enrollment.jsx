import React from 'react';
import { Link } from 'react-router-dom';

const Enrollment = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-indigo-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Enroll Now at Sunhill</h1>
          <p className="text-xl mb-8">We are committed to nurturing young minds and building bright futures.</p>
          <Link to="/" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Contact us
          </Link>
        </div>
      </div>

      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Branches</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {['Batangas', 'Rosario', 'Bauan', 'Metro Tagaytay'].map((branch) => (
            <div key={branch} className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sunhill {branch}</h3>
              <p className="text-gray-600">Contact us for branch-specific inquiries</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programs Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Sunhill Montessori</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Early Intervention</h3>
                <p className="text-gray-600 mb-4">Toddler Class (2-3 years old)</p>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Developmental activities</li>
                  <li>Social interaction</li>
                  <li>Basic skills development</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-School</h3>
                <p className="text-gray-600 mb-4">Ages 3-5 years old</p>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Nursery</li>
                  <li>Casa 1</li>
                  <li>Casa 2</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Grade School</h3>
                <p className="text-gray-600 mb-4">Levels 1-6</p>
                <ul className="text-gray-600 list-disc list-inside">
                  <li>Comprehensive curriculum</li>
                  <li>Holistic development</li>
                  <li>Progressive learning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Add-on Programs */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add-on Programs</h3>
            <div className="inline-flex flex-wrap justify-center gap-4">
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">LEGO Education</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">Music Classes</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">Art Workshop</span>
              <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">Sports Activities</span>
            </div>
          </div>

          {/* Developmental Education */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sunhill Developmental Education</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialized Programs</h3>
                <ul className="text-gray-600 grid grid-cols-2 gap-4">
                  <li>• ADHD</li>
                  <li>• ASD</li>
                  <li>• Global Development</li>
                  <li>• Cerebral Palsy</li>
                  <li>• Learning Disabilities</li>
                  <li>• Down Syndrome</li>
                  <li>• Intellectual Disabilities</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Therapy Services</h3>
                <ul className="text-gray-600 list-disc list-inside space-y-2">
                  <li>Physical Therapy</li>
                  <li>Speech Therapy</li>
                  <li>Occupational Therapy</li>
                  <li>SPED Tutorial</li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">Available at our Batangas and Tanauan branches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">Ready to Begin?</h2>
          <p className="text-lg text-indigo-700 mb-8">Take the first step in your child's educational journey</p>
          <div className="space-x-4">
            <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
              Learn More
            </Link>
            <Link to="/assessment" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;