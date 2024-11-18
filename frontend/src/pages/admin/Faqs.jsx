import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from 'react-icons/fa';

const Faqs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          id: 1,
          question: "How do I access the admin dashboard?",
          answer: "To access the admin dashboard, log in with your administrator credentials at the login page. Once authenticated, you'll be automatically directed to the dashboard. If you're having trouble accessing your account, contact the system administrator."
        },
        {
          id: 2,
          question: "What are the main features of the admin dashboard?",
          answer: "The admin dashboard includes several key features:\n• User Management: Add, edit, and manage student and teacher accounts\n• Course Management: Create and manage courses and learning materials\n• Branch Management: Oversee different school branches\n• Analytics: View student performance and system usage statistics\n• Settings: Customize your profile and system preferences"
        },
        {
          id: 3,
          question: "How do I reset my admin password?",
          answer: "To reset your password:\n1. Click on your profile picture in the top-right corner\n2. Select 'Account Settings'\n3. Enter your current password and new password\n4. Click 'Save' to update your credentials"
        }
      ]
    },
    {
      category: "User Management",
      questions: [
        {
          id: 4,
          question: "How do I add a new student or teacher?",
          answer: "To add a new user:\n1. Navigate to the Users section\n2. Click the 'Add New User' button\n3. Fill in the required information\n4. Select the appropriate role (Student/Teacher)\n5. Click 'Save' to create the account"
        },
        {
          id: 5,
          question: "Can I bulk import users?",
          answer: "Yes, you can bulk import users using a CSV file:\n1. Go to the Users section\n2. Click 'Import Users'\n3. Download the template CSV file\n4. Fill in the user information\n5. Upload the completed CSV\n6. Review and confirm the import"
        },
        {
          id: 6,
          question: "How do I manage user permissions?",
          answer: "User permissions are role-based. To modify permissions:\n1. Go to the Users section\n2. Select the user\n3. Click 'Edit Permissions'\n4. Adjust the role or specific permissions\n5. Save the changes"
        }
      ]
    },
    {
      category: "Course Management",
      questions: [
        {
          id: 7,
          question: "How do I create a new course?",
          answer: "To create a new course:\n1. Navigate to the Courses section\n2. Click 'Add New Course'\n3. Fill in course details (title, description, schedule)\n4. Add learning materials and assignments\n5. Assign teachers\n6. Set course visibility\n7. Click 'Create Course'"
        },
        {
          id: 8,
          question: "Can I duplicate an existing course?",
          answer: "Yes, you can duplicate courses:\n1. Find the course you want to duplicate\n2. Click the 'More Options' menu\n3. Select 'Duplicate Course'\n4. Modify any details as needed\n5. Save the new course"
        }
      ]
    },
    {
      category: "Branch Management",
      questions: [
        {
          id: 9,
          question: "How do I add a new branch?",
          answer: "To add a new branch:\n1. Go to the Branches section\n2. Click 'Add New Branch'\n3. Enter branch details (name, location, contact info)\n4. Assign branch administrators\n5. Set up branch-specific settings\n6. Click 'Create Branch'"
        },
        {
          id: 10,
          question: "How do I manage branch-specific settings?",
          answer: "Each branch can have its own settings:\n1. Select the branch from the Branches list\n2. Click 'Branch Settings'\n3. Customize parameters like:\n   • Operating hours\n   • Contact information\n   • Branch administrators\n   • Course offerings"
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          id: 11,
          question: "What should I do if I encounter an error?",
          answer: "If you encounter an error:\n1. Note the error message and what you were doing\n2. Try refreshing the page\n3. Clear your browser cache if needed\n4. Contact technical support with details\n5. For urgent issues, use the emergency contact number"
        },
        {
          id: 12,
          question: "How do I report a bug or request a feature?",
          answer: "To report bugs or request features:\n1. Click the 'Help' button in the dashboard\n2. Select 'Report Issue' or 'Feature Request'\n3. Provide detailed information\n4. Add screenshots if relevant\n5. Submit the report"
        }
      ]
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleItem(id);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const categories = ['all', ...new Set(faqCategories.map(cat => cat.category))];

  const filteredFaqs = faqCategories
    .map(category => ({
      ...category,
      questions: category.questions.filter(item =>
        (selectedCategory === 'all' || category.category === selectedCategory) &&
        (item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }))
    .filter(category => category.questions.length > 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about the admin dashboard and LMS system.</p>
        
        {/* Search and Filter Section */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label="Search FAQs"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={selectedCategory === category}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6" role="region" aria-label="FAQ Categories">
        {filteredFaqs.map((category) => (
          <div 
            key={category.category} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200 bg-gray-50">
              {category.category}
            </h2>
            <div className="divide-y divide-gray-200">
              {category.questions.map((item) => (
                <div key={item.id} className="transition-all duration-200">
                  <button
                    onClick={() => toggleItem(item.id)}
                    onKeyDown={(e) => handleKeyPress(e, item.id)}
                    className="w-full p-4 flex justify-between items-start text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={openItems[item.id]}
                    aria-controls={`answer-${item.id}`}
                  >
                    <span className="text-gray-800 font-medium pr-4">{item.question}</span>
                    <span className="text-gray-500 transition-transform duration-200" style={{
                      transform: openItems[item.id] ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      <FaChevronDown />
                    </span>
                  </button>
                  <div
                    id={`answer-${item.id}`}
                    className={`overflow-hidden transition-all duration-200 ${
                      openItems[item.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-4 pt-0 text-gray-600 whitespace-pre-line bg-gray-50">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredFaqs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No FAQs found matching your search.</p>
          <button
            onClick={clearSearch}
            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            Clear filters and try again
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Need More Help?</h2>
        <p className="text-blue-700 mb-4">
          If you couldn't find what you're looking for, please contact our support team:
        </p>
        <div className="space-y-3">
          <a 
            href="mailto:support@sunhill.edu" 
            className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">📧</span> support@sunhill.edu
          </a>
          <a 
            href="tel:+11234567890" 
            className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">📞</span> (123) 456-7890
          </a>
          <div className="flex items-center text-blue-700">
            <span className="mr-2">🕒</span> Monday - Friday, 8:00 AM - 5:00 PM
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;