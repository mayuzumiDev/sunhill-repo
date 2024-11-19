import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaFilePdf, FaPrint, FaArrowRight, FaChild, FaBrain, FaBookReader, FaSearch, FaPlus, FaCalendar, FaHistory } from 'react-icons/fa';
import axios from 'axios';
// import html2pdf from 'html2pdf.js';

// Assessment categories and questions
const assessmentCategories = {
  adhd: {
    title: 'ADHD Assessment',
    description: 'Attention Deficit Hyperactivity Disorder evaluation',
    questions: [
      {
        id: 'adhd_attention_1',
        text: 'Does the student have difficulty maintaining attention during tasks or play?',
        category: 'Attention'
      },
      {
        id: 'adhd_attention_2',
        text: 'Is the student easily distracted by external stimuli?',
        category: 'Attention'
      },
      {
        id: 'adhd_attention_3',
        text: 'Does the student avoid tasks that require sustained mental effort?',
        category: 'Attention'
      },
      {
        id: 'adhd_attention_4',
        text: 'Does the student seem to not listen when spoken to directly?',
        category: 'Attention'
      },
      {
        id: 'adhd_organization_1',
        text: 'Does the student often lose things necessary for tasks or activities?',
        category: 'Organization'
      },
      {
        id: 'adhd_organization_2',
        text: 'Is the student\'s work often messy or disorganized?',
        category: 'Organization'
      },
      {
        id: 'adhd_organization_3',
        text: 'Does the student have difficulty following multi-step instructions?',
        category: 'Organization'
      },
      {
        id: 'adhd_hyperactivity_1',
        text: 'Is the student often "on the go" or acts as if "driven by a motor"?',
        category: 'Hyperactivity'
      },
      {
        id: 'adhd_hyperactivity_2',
        text: 'Does the student have difficulty remaining seated when expected to?',
        category: 'Hyperactivity'
      },
      {
        id: 'adhd_hyperactivity_3',
        text: 'Does the student often fidget or squirm when seated?',
        category: 'Hyperactivity'
      },
      {
        id: 'adhd_impulsivity_1',
        text: 'Does the student often blurt out answers before questions are completed?',
        category: 'Impulsivity'
      },
      {
        id: 'adhd_impulsivity_2',
        text: 'Does the student have difficulty waiting their turn?',
        category: 'Impulsivity'
      },
      {
        id: 'adhd_impulsivity_3',
        text: 'Does the student often interrupt or intrude on others?',
        category: 'Impulsivity'
      }
    ]
  },
  asd: {
    title: 'ASD Assessment',
    description: 'Autism Spectrum Disorder evaluation',
    questions: [
      {
        id: 'asd_social_1',
        text: 'Does the student have difficulty with social interaction or communication?',
        category: 'Social Communication'
      },
      {
        id: 'asd_social_2',
        text: 'Does the student struggle to maintain eye contact during conversations?',
        category: 'Social Communication'
      },
      {
        id: 'asd_social_3',
        text: 'Does the student have difficulty understanding facial expressions or body language?',
        category: 'Social Communication'
      },
      {
        id: 'asd_social_4',
        text: 'Does the student struggle to develop or maintain peer relationships?',
        category: 'Social Communication'
      },
      {
        id: 'asd_behavior_1',
        text: 'Does the student show repetitive behaviors or restricted interests?',
        category: 'Behavior Patterns'
      },
      {
        id: 'asd_behavior_2',
        text: 'Does the student insist on following specific routines or rituals?',
        category: 'Behavior Patterns'
      },
      {
        id: 'asd_behavior_3',
        text: 'Does the student show unusual sensory interests or sensitivities?',
        category: 'Behavior Patterns'
      },
      {
        id: 'asd_behavior_4',
        text: 'Does the student have intense, focused interests in specific topics?',
        category: 'Behavior Patterns'
      },
      {
        id: 'asd_communication_1',
        text: 'Does the student have difficulty understanding nonverbal communication?',
        category: 'Social Understanding'
      },
      {
        id: 'asd_communication_2',
        text: 'Does the student take things literally or struggle with idioms?',
        category: 'Social Understanding'
      },
      {
        id: 'asd_communication_3',
        text: 'Does the student have unusual speech patterns or tone of voice?',
        category: 'Social Understanding'
      },
      {
        id: 'asd_emotional_1',
        text: 'Does the student have difficulty expressing or understanding emotions?',
        category: 'Emotional Understanding'
      },
      {
        id: 'asd_emotional_2',
        text: 'Does the student show appropriate emotional responses to situations?',
        category: 'Emotional Understanding'
      }
    ]
  },
  intellectual: {
    title: 'Intellectual Disability Assessment',
    description: 'Evaluation of intellectual functioning and adaptive behavior',
    questions: [
      {
        id: 'id_academic_1',
        text: 'Does the student show significant delays in academic learning?',
        category: 'Academic Performance'
      },
      {
        id: 'id_academic_2',
        text: 'Does the student have difficulty understanding basic concepts?',
        category: 'Academic Performance'
      },
      {
        id: 'id_academic_3',
        text: 'Does the student struggle with reading comprehension?',
        category: 'Academic Performance'
      },
      {
        id: 'id_academic_4',
        text: 'Does the student have difficulty with mathematical concepts?',
        category: 'Academic Performance'
      },
      {
        id: 'id_adaptive_1',
        text: 'Does the student have difficulty with daily living skills?',
        category: 'Adaptive Functioning'
      },
      {
        id: 'id_adaptive_2',
        text: 'Does the student show age-appropriate self-care skills?',
        category: 'Adaptive Functioning'
      },
      {
        id: 'id_adaptive_3',
        text: 'Can the student follow safety rules and understand dangers?',
        category: 'Adaptive Functioning'
      },
      {
        id: 'id_adaptive_4',
        text: 'Does the student show appropriate social judgment?',
        category: 'Adaptive Functioning'
      },
      {
        id: 'id_cognitive_1',
        text: 'Does the student have trouble understanding abstract concepts?',
        category: 'Cognitive Skills'
      },
      {
        id: 'id_cognitive_2',
        text: 'Does the student have difficulty with problem-solving?',
        category: 'Cognitive Skills'
      },
      {
        id: 'id_cognitive_3',
        text: 'Does the student struggle with memory tasks?',
        category: 'Cognitive Skills'
      },
      {
        id: 'id_language_1',
        text: 'Does the student have delayed language development?',
        category: 'Language Development'
      },
      {
        id: 'id_language_2',
        text: 'Does the student have difficulty expressing thoughts clearly?',
        category: 'Language Development'
      }
    ]
  }
};

const SpecialEd = () => {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [answers, setAnswers] = useState({});
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    age: '',
    grade: '',
    school: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [showHistory, setShowHistory] = useState(false);

  // Mock student data (replace with API call)
  const [students] = useState([
    { id: 1, name: 'John Doe', grade: '3rd', age: 8 },
    { id: 2, name: 'Jane Smith', grade: '4th', age: 9 },
    // Add more mock students...
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveStep(2); // Move to student selection
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveStep(3); // Go to assessment intro
  };

  const handleStartAssessment = () => {
    // Select 10 random questions from the category for today
    const allQuestions = assessmentCategories[selectedCategory].questions;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setDailyQuestions(shuffled.slice(0, 10));
    setAssessmentStarted(true);
    setActiveStep(4); // Go to daily assessment
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Mock API call to save assessment results
      const result = {
        student: selectedStudent,
        category: selectedCategory,
        date: currentDate,
        answers,
        questions: dailyQuestions
      };
      setAssessmentHistory(prev => [...prev, result]);
      setActiveStep(5); // Go to results
    } catch (error) {
      setError('Error submitting assessment');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = () => {
    const content = document.getElementById('assessment-content');
    html2pdf()
      .from(content)
      .save('assessment-report.pdf');
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaGraduationCap className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Special Education Assessment Tool</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to our comprehensive assessment platform designed to support educators in evaluating and tracking students with diverse learning needs.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-lg">
        <p className="text-yellow-700">
          <strong>Important Notice:</strong> This tool is designed for initial screening purposes only and does not provide a diagnosis. 
          Always consult with qualified healthcare professionals for proper evaluation and diagnosis.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBrain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Conduct Assessments</h3>
            <p className="text-gray-600">Evaluate students across multiple categories including ADHD, ASD, and more.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor student development with daily assessments and detailed history.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHistory className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">View History</h3>
            <p className="text-gray-600">Access comprehensive assessment history and generate detailed reports.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setActiveStep(1)}
          className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group"
        >
          Start Assessment
          <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-700 bg-blue-100 rounded-xl hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View History
          <FaHistory className="ml-3" />
        </button>
      </div>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        Select Assessment Category
      </h2>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Choose an assessment category to begin
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.keys(assessmentCategories).map(category => (
          <div
            key={category}
            onClick={() => handleCategorySelect(category)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <FaBrain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">{assessmentCategories[category].title}</h3>
                <p className="text-gray-600">{assessmentCategories[category].description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentSelection = () => {
    if (!selectedCategory) {
      setActiveStep(0);
      return null;
    }
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Select Student for {assessmentCategories[selectedCategory].title}
        </h2>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Choose a student or add a new one to begin the assessment process
        </p>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {students
            .filter(student => 
              student.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(student => (
              <div
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaChild className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600">Grade: {student.grade} | Age: {student.age}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          className="mx-auto flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <FaPlus className="mr-2" /> Add New Student
        </button>
      </div>
    );
  };

  const renderAssessmentIntro = () => (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCalendar className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Daily Assessment for {selectedStudent.name}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Today's assessment consists of 10 questions. You can track progress and print results after completion.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-2 gap-8 text-left mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Student Information</h3>
            <p className="text-gray-600">Name: {selectedStudent.name}</p>
            <p className="text-gray-600">Grade: {selectedStudent.grade}</p>
            <p className="text-gray-600">Age: {selectedStudent.age}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Assessment Details</h3>
            <p className="text-gray-600">Category: {assessmentCategories[selectedCategory].title}</p>
            <p className="text-gray-600">Date: {currentDate}</p>
            <p className="text-gray-600">Questions: 10</p>
          </div>
        </div>

        <button
          onClick={handleStartAssessment}
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200"
        >
          Start Today's Assessment
          <FaArrowRight className="ml-3" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-left">Assessment History</h3>
        <div className="space-y-4">
          {assessmentHistory
            .filter(history => history.student.id === selectedStudent.id)
            .map((history, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <FaHistory className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{history.date}</p>
                    <p className="text-sm text-gray-600">{assessmentCategories[history.category].title}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <FaFilePdf className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <FaPrint className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderDailyAssessment = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        Daily Assessment - {currentDate}
      </h2>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Complete today's 10 questions for {selectedStudent.name}
      </p>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-8">
          {dailyQuestions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-8 rounded-2xl transform transition-all duration-200 hover:shadow-md">
              <div className="flex items-start mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-900 font-medium">{question.text}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Never', 'Sometimes', 'Often', 'Very Often'].map((option) => (
                  <label key={option} className="relative">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.toLowerCase()}
                      checked={answers[question.id] === option.toLowerCase()}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="absolute opacity-0"
                    />
                    <div className={`w-full p-4 text-center rounded-xl cursor-pointer transition-all duration-200
                      ${answers[question.id] === option.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-blue-50'}`}>
                      {option}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-12">
          <button
            onClick={() => setActiveStep(3)}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Assessment Results</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaHistory className="mr-2" /> View History
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FaPrint className="mr-2" /> Print
          </button>
        </div>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="ml-3 text-lg font-medium text-green-800">Assessment completed successfully!</p>
        </div>
      </div>

      <div id="assessment-content" className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-yellow-700">
            <strong>Important Notice:</strong> This assessment is for initial screening purposes only. 
            It does not provide a diagnosis and should not be used as a substitute for professional medical evaluation.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Assessment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Category</p>
              <p className="text-lg font-medium text-gray-900">{assessmentCategories[selectedCategory].title}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-medium text-gray-900">{currentDate}</p>
            </div>
            {selectedStudent && (
              <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="text-lg font-medium text-gray-900">{selectedStudent.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="text-lg font-medium text-gray-900">{selectedStudent.grade}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {dailyQuestions.map((question, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 mb-2">Question {index + 1}: {question.text}</p>
              <p className="text-blue-600">Response: {answers[question.id]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => {
              setActiveStep(0);
              setSelectedCategory('');
              setSelectedStudent(null);
              setAnswers({});
              setDailyQuestions([]);
            }}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Start New Assessment
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save & View History
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Assessment History</h2>
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FaPrint className="mr-2" /> Print
          </button>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <FaFilePdf className="mr-2" /> Download PDF
          </button>
        </div>
      </div>

      <div id="assessment-content" className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <p className="text-yellow-700">
            <strong>Important Notice:</strong> This assessment tool is designed for initial screening purposes only. 
            It does not provide a diagnosis and should not be used as a substitute for professional medical evaluation. 
            Please consult with qualified healthcare professionals for proper diagnosis and treatment planning.
          </p>
        </div>

        {assessmentHistory.map((assessment, index) => (
          <div key={index} className="mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Assessment on {assessment.date}
              </h3>
              <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                {assessmentCategories[selectedCategory].title}
              </span>
            </div>
            <div className="space-y-4">
              {assessment.questions.map((question, qIndex) => (
                <div key={qIndex} className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{question.text}</p>
                    <p className="text-gray-600 mt-1">Response: {assessment.answers[question.id]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowHistory(false)}
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          Back to Assessment
        </button>
      </div>
    </div>
  );

  const steps = [
    {
      label: 'Welcome',
      content: renderWelcome
    },
    {
      label: 'Select Assessment Category',
      content: renderCategorySelection
    },
    {
      label: 'Select Student',
      content: renderStudentSelection
    },
    {
      label: 'Assessment Introduction',
      content: renderAssessmentIntro
    },
    {
      label: 'Daily Assessment',
      content: renderDailyAssessment
    },
    {
      label: 'Results',
      content: renderResults
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Preparing your assessment tool...</p>
        </div>
      </div>
    );
  }

  if (showHistory) {
    return renderHistory();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeStep > 0 && (
          <div className="mb-12">
            <div className="flex justify-center">
              <nav className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                      ${index <= activeStep 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                        : 'border-gray-300 text-gray-300'}`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-24 h-1 mx-2 rounded-full transition-all duration-300
                        ${index < activeStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-medium text-gray-600">
                {steps[activeStep].label}
              </p>
            </div>
          </div>
        )}
        {steps[activeStep].content()}
      </div>
    </div>
  );
};

export default SpecialEd;
