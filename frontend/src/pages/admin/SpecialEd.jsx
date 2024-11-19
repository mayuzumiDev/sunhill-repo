import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaFilePdf, FaPrint, FaArrowRight, FaChild, FaBrain, FaBookReader, FaSearch, FaPlus, FaCalendar, FaHistory, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const SpecialEd = () => {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    grade_level: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch assessment categories
        const categoriesResponse = await axiosInstance.get('/special-education/categories/');
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Fetch students
        const studentsResponse = await axiosInstance.get('/user-admin/student-list/');
        if (studentsResponse.data?.student_list) {
          setStudents(studentsResponse.data.student_list);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError(error.response?.data?.message || 'Failed to load initial data');
        setLoading(false);
        toast.error('Failed to load initial data. Please try again.');
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchStudentHistory = async () => {
      if (selectedStudent) {
        try {
          const historyResponse = await axiosInstance.get(`/special-education/assessments/list/?student=${selectedStudent.id}`);
          if (historyResponse.data) {
            setAssessmentHistory(historyResponse.data);
          }
        } catch (error) {
          console.error('Error fetching student history:', error);
          toast.error('Failed to load student history');
        }
      }
    };

    fetchStudentHistory();
  }, [selectedStudent]);

  const handleCategorySelect = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      
      // Fetch questions for the selected category
      const response = await axiosInstance.get(`/special-education/questions/random/`, {
        params: {
          category: category.id,
          count: 10
        }
      });
      
      if (response.status === 200 && response.data) {
        setQuestions(response.data);
        setActiveStep(1);
      } else {
        throw new Error('Failed to load questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(error.response?.data?.message || 'Failed to load questions');
      toast.error('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = () => {
    if (questions.length === 0) {
      toast.error('No questions available. Please try again.');
      return;
    }
    setDailyQuestions(questions);
    setAssessmentStarted(true);
    setActiveStep(4);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveStep(3);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handlePrintAssessment = (assessment) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Assessment Report - ${assessment.category_details?.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .question { background: #f5f5f5; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
            .response { display: inline-block; padding: 5px 10px; border-radius: 15px; font-weight: bold; }
            .response-very_often { background: #fee2e2; color: #991b1b; }
            .response-often { background: #ffedd5; color: #9a3412; }
            .response-sometimes { background: #fef9c3; color: #854d0e; }
            .response-never { background: #dcfce7; color: #166534; }
            @media print {
              body { padding: 0; }
              .question { break-inside: avoid; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Assessment Report</h1>
            <p>Category: ${assessment.category_details?.title}</p>
            <p>Student: ${assessment.student_details?.first_name} ${assessment.student_details?.last_name}</p>
            <p>Date: ${new Date(assessment.date).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Questions and Responses</h2>
            ${assessment.responses?.map((response, index) => `
              <div class="question">
                <p><strong>Question ${index + 1}:</strong> ${response.question_text}</p>
                <p><strong>Category:</strong> ${response.question_category}</p>
                <p><strong>Response:</strong> 
                  <span class="response response-${response.response}">
                    ${response.response?.charAt(0).toUpperCase() + response.response?.slice(1).replace('_', ' ')}
                  </span>
                </p>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Summary</h2>
            <p>Total Questions: ${assessment.responses?.length || 0}</p>
            <p>Completion Status: ${assessment.completed ? 'Completed' : 'In Progress'}</p>
          </div>

          <div class="section">
            <p style="font-style: italic; color: #666;">
              Note: This assessment is for screening purposes only and should not be used as a substitute for professional medical evaluation.
            </p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Validate that all questions have answers
      const unansweredQuestions = dailyQuestions.filter(q => !answers[q.id]);
      if (unansweredQuestions.length > 0) {
        toast.error('Please answer all questions before submitting');
        setIsSubmitting(false);
        return;
      }

      // Create a new assessment
      const assessmentResponse = await axiosInstance.post('/special-education/assessments/', {
        student: selectedStudent.id,
        category: selectedCategory.id,
        completed: true
      });

      if (!assessmentResponse.data) {
        throw new Error('Failed to create assessment');
      }

      const assessmentId = assessmentResponse.data.id;

      // Format the responses for submission
      const formattedResponses = dailyQuestions.map(question => ({
        question: question.id,
        response: answers[question.id],
        assessment: assessmentId
      }));

      // Submit the assessment responses
      await axiosInstance.post('/special-education/responses/bulk_create/', {
        responses: formattedResponses
      });

      // Fetch the complete assessment with responses
      const completedAssessment = await axiosInstance.get(`/special-education/assessments/${assessmentId}/`);
      
      if (!completedAssessment.data) {
        throw new Error('Failed to fetch completed assessment');
      }

      // Update assessment history
      const historyResponse = await axiosInstance.get(`/special-education/assessments/list/?student=${selectedStudent.id}`);
      if (historyResponse.data) {
        setAssessmentHistory(historyResponse.data);
      }

      // Set states for results view
      setShowResults(true);
      setActiveStep(5);
      setAssessmentStarted(false);
      
      toast.success('Assessment submitted successfully!');
      
      // Offer to print after a short delay
      setTimeout(() => {
        if (window.confirm('Would you like to print the assessment report?')) {
          handlePrintAssessment(completedAssessment.data);
        }
      }, 500);

    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'username', 'email', 'grade_level', 'password'];
      const missingFields = requiredFields.filter(field => !newStudent[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Create the account
      const accountResponse = await axiosInstance.post('/user-admin/create-account/', {
        accounts: [{
          role: 'student',
          branch_name: 'Main Branch',
          username: newStudent.username,
          password: newStudent.password
        }]
      });

      if (!accountResponse.data?.accounts?.[0]?.user?.id) {
        throw new Error('Failed to create student account');
      }

      // Create student info
      const studentInfoResponse = await axiosInstance.post('/user-admin/student-info/edit/0/', {
        user_id: accountResponse.data.accounts[0].user.id,
        grade_level: newStudent.grade_level,
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        email: newStudent.email
      });

      if (studentInfoResponse.status !== 200 && studentInfoResponse.status !== 201) {
        throw new Error('Failed to create student info');
      }

      // Refresh student list
      const studentsResponse = await axiosInstance.get('/user-admin/student-list/');
      if (studentsResponse.data?.student_list) {
        setStudents(studentsResponse.data.student_list);
      }
      
      toast.success('Student added successfully!');
      
      // Close modal and reset form
      setShowAddStudentModal(false);
      setNewStudent({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        grade_level: '',
        password: ''
      });
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.response?.data?.message || 'Failed to add student');
      toast.error('Failed to add student. Please try again.');
    }
  };

  useEffect(() => {
    if (activeStep === 5) {
      setShowResults(true);
      setAssessmentStarted(false);
    }
  }, [activeStep]);

  useEffect(() => {
    return () => {
      setAnswers({});
      setDailyQuestions([]);
      setAssessmentStarted(false);
      setShowResults(false);
      setActiveStep(0);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (assessmentStarted && Object.keys(answers).length > 0 && activeStep === 4) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [assessmentStarted, answers, activeStep]);

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
          onClick={() => setActiveStep(2)}
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
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-50 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <FaBrain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
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

    if (!Array.isArray(students)) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-red-600">Error loading students. Please try again.</p>
        </div>
      );
    }
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Select Student for {selectedCategory.title}
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
              (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchQuery.toLowerCase())
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
                    <h3 className="text-xl font-semibold text-gray-900">{student.first_name} {student.last_name}</h3>
                    <p className="text-gray-600">Grade: {student.student_info?.grade_level} | ID: {student.id}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <button
          onClick={() => setShowAddStudentModal(true)}
          className="mx-auto flex items-center px-6 py-3 text-lg font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <FaPlus className="mr-2" /> Add New Student
        </button>

        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Add New Student</h3>
              <form onSubmit={handleAddStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={newStudent.first_name}
                      onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={newStudent.last_name}
                      onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={newStudent.username}
                      onChange={(e) => setNewStudent({...newStudent, username: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                    <select
                      value={newStudent.grade_level}
                      onChange={(e) => setNewStudent({...newStudent, grade_level: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
          Daily Assessment for {selectedStudent.first_name} {selectedStudent.last_name}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Today's assessment consists of 10 questions. You can track progress and print results after completion.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
            <p className="text-gray-600">Student: {selectedStudent.first_name} {selectedStudent.last_name}</p>
          </div>
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Student Information</h3>
            <p className="text-gray-600">Name: {selectedStudent.first_name} {selectedStudent.last_name}</p>
            <p className="text-gray-600">Grade: {selectedStudent.student_info?.grade_level}</p>
            <p className="text-gray-600">ID: {selectedStudent.id}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Assessment Details</h3>
            <p className="text-gray-600">Category: {selectedCategory.title}</p>
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
                    <p className="text-sm text-gray-600">{history.category.title}</p>
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

  const renderAssessment = () => {
    if (!assessmentStarted || !dailyQuestions.length) {
      return null;
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCategory.title}</h2>
              <p className="text-gray-600">Student: {selectedStudent.first_name} {selectedStudent.last_name}</p>
            </div>
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          <div className="space-y-8">
            {dailyQuestions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{question.question_text}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {question.category || selectedCategory.title}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {['never', 'sometimes', 'often', 'very_often'].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            answers[question.id] === option
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            answers[question.id] === 'very_often' ? 'bg-red-500 w-full' :
                            answers[question.id] === 'often' ? 'bg-orange-500 w-3/4' :
                            answers[question.id] === 'sometimes' ? 'bg-yellow-500 w-1/2' :
                            answers[question.id] === 'never' ? 'bg-green-500 w-1/4' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg p-4 shadow mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Progress</h3>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(Object.keys(answers).length / dailyQuestions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Object.keys(answers).length} of {dailyQuestions.length} questions answered
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
              
              <button
                onClick={handleSubmitAssessment}
                disabled={isSubmitting || Object.keys(answers).length !== dailyQuestions.length}
                className={`inline-flex items-center px-6 py-3 text-lg font-medium text-white rounded-md ${
                  isSubmitting || Object.keys(answers).length !== dailyQuestions.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Submit Assessment ({Object.keys(answers).length}/{dailyQuestions.length})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
            onClick={() => window.print()}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FaPrint className="mr-2" /> Print Results
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
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Assessment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Student:</strong> {selectedStudent.first_name} {selectedStudent.last_name}</p>
              <p className="text-gray-600"><strong>Grade:</strong> {selectedStudent.student_info?.grade_level}</p>
              <p className="text-gray-600"><strong>Date:</strong> {currentDate}</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>Category:</strong> {selectedCategory.title}</p>
              <p className="text-gray-600"><strong>Questions:</strong> {dailyQuestions.length}</p>
              <p className="text-gray-600"><strong>Completion:</strong> 100%</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Response Summary</h3>
          <div className="space-y-6">
            {dailyQuestions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {question.question_category}
                  </span>
                </div>
                <p className="text-gray-900 mb-2">{question.question_text}</p>
                <div className="flex items-center">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    answers[question.id] === 'very_often' ? 'bg-red-100 text-red-800' :
                    answers[question.id] === 'often' ? 'bg-orange-100 text-orange-800' :
                    answers[question.id] === 'sometimes' ? 'bg-yellow-100 text-yellow-800' :
                    answers[question.id] === 'never' ? 'bg-green-100 text-green-800' : ''
                  }`}>
                    {answers[question.id]?.charAt(0).toUpperCase() + answers[question.id]?.slice(1).replace('_', ' ')}
                  </span>
                  <div className="ml-4 flex-1">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          answers[question.id] === 'very_often' ? 'bg-red-500 w-full' :
                          answers[question.id] === 'often' ? 'bg-orange-500 w-3/4' :
                          answers[question.id] === 'sometimes' ? 'bg-yellow-500 w-1/2' :
                          'bg-green-500 w-1/4'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              Based on the assessment responses, consider the following recommendations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              {Object.values(answers).filter(a => a === 'very_often' || a === 'often').length > 3 && (
                <li>Schedule a detailed evaluation with a special education specialist</li>
              )}
              <li>Continue monitoring progress through regular assessments</li>
              <li>Maintain open communication with teachers and support staff</li>
              <li>Consider implementing suggested accommodations in the classroom</li>
            </ul>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Assessment History</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {assessmentHistory.map((assessment) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{assessment.category_details.title}</h4>
                      <p className="text-gray-600">Date: {new Date(assessment.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      assessment.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  {assessment.responses && (
                    <div className="mt-4 space-y-4">
                      {assessment.responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-900">{response.question_text}</p>
                          <p className="text-sm text-gray-600">
                            Response: <span className="font-medium">{response.response}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Assessment History</h2>
        <button
          onClick={() => setShowHistory(false)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Assessment
        </button>
      </div>

      {assessmentHistory.length === 0 ? (
        <div className="text-center py-8">
          <FaHistory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No assessment history available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assessmentHistory.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {assessment.category_details?.title}
                  </h3>
                  <p className="text-gray-600">
                    Date: {new Date(assessment.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Student: {assessment.student_details?.first_name} {assessment.student_details?.last_name}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePrintAssessment(assessment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Print Assessment"
                  >
                    <FaPrint className="w-5 h-5" />
                  </button>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    assessment.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assessment.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {assessment.responses && (
                <div className="mt-4 space-y-4">
                  {assessment.responses.map((response, index) => (
                    <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {response.question_category}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{response.question_text}</p>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          response.response === 'very_often' ? 'bg-red-100 text-red-800' :
                          response.response === 'often' ? 'bg-orange-100 text-orange-800' :
                          response.response === 'sometimes' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {response.response?.charAt(0).toUpperCase() + response.response?.slice(1).replace('_', ' ')}
                        </span>
                        <div className="ml-4 flex-1">
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                response.response === 'very_often' ? 'bg-red-500 w-full' :
                                response.response === 'often' ? 'bg-orange-500 w-3/4' :
                                response.response === 'sometimes' ? 'bg-yellow-500 w-1/2' :
                                'bg-green-500 w-1/4'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeStep === 0 && renderWelcome()}
          {activeStep === 1 && renderStudentSelection()}
          {activeStep === 2 && renderCategorySelection()}
          {activeStep === 3 && renderAssessmentIntro()}
          {activeStep === 4 && renderAssessment()}
          {activeStep === 5 && renderResults()}
          {activeStep === 6 && renderHistory()}
          {showHistory && renderHistory()}
        </>
      )}
    </div>
  );
};

export default SpecialEd;
