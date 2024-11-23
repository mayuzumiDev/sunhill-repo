import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaFilePdf, FaPrint, FaArrowRight, FaChild, FaBrain, FaBookReader, FaSearch, FaPlus, FaCalendar, FaHistory, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import ReactDOM from 'react-dom';

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
  const [completionMessage, setCompletionMessage] = useState('');
  const [categoryScores, setCategoryScores] = useState(null);
  const [assessmentNumber, setAssessmentNumber] = useState(1);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [responses, setResponses] = useState({});

  const RESPONSE_CHOICES = {
    never: 'Never',
    sometimes: 'Sometimes',
    often: 'Often',
    very_often: 'Very Often'
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

  const handleStartAssessment = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Starting assessment for student:', selectedStudent);

      // Get a random assessment
      console.log('Fetching random assessment...');
      const assessmentResponse = await axiosInstance.get('/special-education/auto-assessment/');
      console.log('Assessment response:', assessmentResponse.data);

      if (!assessmentResponse.data) {
        throw new Error('No assessment data received');
      }

      // Create the assessment record
      console.log('Creating assessment record...');
      const createResponse = await axiosInstance.post('/special-education/assessments/create/', {
        student: selectedStudent.id,
        category: assessmentResponse.data.category.id,
        completed: false
      });
      console.log('Assessment creation response:', createResponse.data);

      if (!createResponse.data) {
        throw new Error('Failed to create assessment record');
      }

      // Handle both new and existing assessment cases
      const assessmentData = createResponse.data?.assessment || createResponse.data;
      if (!assessmentData?.id) {
        throw new Error('Invalid assessment data received');
      }

      // Set the current assessment and questions
      setCurrentAssessment(assessmentData);
      setSelectedCategory(assessmentResponse.data.category);
      setDailyQuestions(assessmentResponse.data.questions);
      setAssessmentStarted(true);
      
      console.log('Assessment setup complete:', {
        currentAssessment: assessmentData,
        category: assessmentResponse.data.category,
        questions: assessmentResponse.data.questions
      });
      
      // Show success message
      toast.success('Assessment started successfully');
      setActiveStep(3); // Move to questions step

    } catch (error) {
      console.error('Error starting assessment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to start assessment';
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      // Reset state on error
      setCurrentAssessment(null);
      setSelectedCategory(null);
      setDailyQuestions([]);
      setAssessmentStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponses = async () => {
    if (Object.keys(responses).length !== dailyQuestions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }

    if (!currentAssessment?.id) {
      toast.error('No active assessment found');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Current responses:', responses);
      console.log('Daily questions:', dailyQuestions);
      console.log('Current assessment:', currentAssessment);

      // Validate response values
      const validChoices = ['never', 'sometimes', 'often', 'very_often'];
      const hasInvalidResponse = Object.values(responses).some(
        response => !validChoices.includes(response.toLowerCase())
      );

      if (hasInvalidResponse) {
        toast.error('Invalid response values detected');
        setIsSubmitting(false);
        return;
      }

      // Convert responses to the format expected by the backend
      const formattedResponses = dailyQuestions.map(question => ({
        question: question.id,
        assessment: currentAssessment.id,
        response: responses[question.id].toLowerCase()
      }));
      
      console.log('Submitting responses:', formattedResponses);

      // Submit responses
      const responseResult = await axiosInstance.post('/special-education/responses/bulk_create/', {
        responses: formattedResponses
      });

      console.log('Response submission result:', responseResult.data);

      if (responseResult.data) {
        // Update assessment as completed
        const updateResult = await axiosInstance.patch(`/special-education/assessments/${currentAssessment.id}/`, {
          completed: true
        });

        console.log('Assessment update result:', updateResult.data);

        toast.success('Assessment submitted successfully');
        
        // If we have category scores, show them
        if (updateResult.data?.category_scores) {
          setCategoryScores(updateResult.data.category_scores);
          setAssessmentNumber(updateResult.data.assessment_number);
          setCompletionMessage(updateResult.data.message || 'Assessment completed successfully');
          setActiveStep(5);
        } else {
          // Otherwise, go back to student selection
          setActiveStep(1);
          resetAssessmentState();
        }
        
        // Optionally fetch updated history
        if (typeof fetchAssessmentHistory === 'function') {
          await fetchAssessmentHistory();
        }
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to submit assessment';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    console.log('Setting response for question', questionId, 'to value:', value);
    // Ensure value is lowercase and valid
    const normalizedValue = value.toLowerCase();
    const validChoices = ['never', 'sometimes', 'often', 'very_often'];
    
    if (!validChoices.includes(normalizedValue)) {
      console.error('Invalid response value:', value);
      return;
    }

    setResponses(prev => {
      const newResponses = {
        ...prev,
        [questionId]: normalizedValue
      };
      console.log('Updated responses:', newResponses);
      return newResponses;
    });
  };

  const renderResponseButtons = (questionId) => {
    return Object.entries(RESPONSE_CHOICES).map(([value, label]) => (
      <button
        key={value}
        onClick={() => handleAnswerChange(questionId, value)}
        className={`p-2 rounded-md border-2 transition-all ${
          responses[questionId] === value
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-blue-200'
        }`}
      >
        {label}
      </button>
    ));
  };

  const renderQuestions = () => {
    if (!dailyQuestions.length) return null;

    return (
      <div className="space-y-6">
        {dailyQuestions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">{question.question_text}</h3>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-sm">
                    {question.question_category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {renderResponseButtons(question.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAssessment = () => {
    if (!currentAssessment || !selectedCategory || !dailyQuestions.length) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-md shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedCategory.title}</h2>
              <p className="text-gray-600">
                Student: {selectedStudent.first_name} {selectedStudent.last_name}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Assessment {currentAssessment.assessment_number}/30
              </p>
            </div>
            <button
              onClick={() => {
                setActiveStep(2);
                resetAssessmentState();
              }}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          {renderQuestions()}

          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              {Object.keys(responses).length !== dailyQuestions.length && (
                <p className="text-amber-600 text-sm">
                  Please answer all {dailyQuestions.length} questions before submitting. You have {dailyQuestions.length - Object.keys(responses).length} question(s) remaining.
                </p>
              )}
              <button
                onClick={handleSubmitResponses}
                disabled={isSubmitting || Object.keys(responses).length !== dailyQuestions.length}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 ${
                  isSubmitting || Object.keys(responses).length !== dailyQuestions.length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <FaCheck className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const resetAssessmentState = () => {
    setCurrentAssessment(null);
    setSelectedCategory(null);
    setDailyQuestions([]);
    setResponses({});
    setSelectedStudent(null);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setActiveStep(2);  // Move to confirmation step
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
          branch_name: '',
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

  const fetchAssessmentHistory = async () => {
    try {
      const response = await axiosInstance.get(
        `/special-education/assessments/?student_id=${selectedStudent.id}`
      );
      setAssessmentHistory(response.data);
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      toast.error('Failed to fetch assessment history');
    }
  };

  useEffect(() => {
    fetchAssessmentHistory();
  }, []);

  const PrintableAssessment = () => (
    <div id="printable-assessment" className="hidden print:block print:mx-auto print:w-[210mm] print:h-[297mm] print:pt-[8mm] print:pb-[12mm] print:px-[12mm] print:text-black print:bg-white relative print:text-[0.92em]">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none rotate-[-35deg]">
        <div className="text-[90px] font-bold text-gray-900 whitespace-nowrap">CONFIDENTIAL</div>
      </div>

      {/* Logo and Header Section */}
      <header className="mb-6">
        <div className="text-center mb-4 relative pb-3">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-14 h-14">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-800"></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-800"></div>
          </div>
          <div className="absolute top-0 right-0 w-14 h-14">
            <div className="absolute top-0 right-0 w-full h-1 bg-blue-800"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-800"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-14 h-14">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-800"></div>
            <div className="absolute bottom-0 left-0 w-1 h-full bg-blue-800"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-14 h-14">
            <div className="absolute bottom-0 right-0 w-full h-1 bg-blue-800"></div>
            <div className="absolute bottom-0 right-0 w-1 h-full bg-blue-800"></div>
          </div>
          
          {/* Header Content */}
          <div className="px-14">
            <h1 className="text-2xl font-bold tracking-tight text-blue-900 mb-1.5">Special Education Assessment Report</h1>
            <p className="text-[10px] text-gray-600 mb-2">Confidential Student Assessment Document</p>
            <div className="flex items-center justify-center space-x-2 text-[9px] text-gray-500">
              <span>Report ID: {currentAssessment?.id || 'N/A'}</span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Student Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-3 py-1.5">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider">Student Information</h3>
            </div>
            <div className="p-3">
              <table className="w-full text-[10px]">
                <tbody className="space-y-1.5">
                  <tr>
                    <td className="pr-2 py-1 text-gray-600 w-1/3">Full Name:</td>
                    <td className="font-medium">{selectedStudent?.first_name} {selectedStudent?.last_name}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 py-1 text-gray-600">Grade Level:</td>
                    <td className="font-medium">{selectedStudent?.grade_level || selectedStudent?.student_info?.grade_level || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 py-1 text-gray-600">Student ID:</td>
                    <td className="font-medium">{selectedStudent?.id || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Assessment Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-3 py-1.5">
              <h3 className="text-[10px] font-semibold uppercase tracking-wider">Assessment Details</h3>
            </div>
            <div className="p-3">
              <table className="w-full text-[10px]">
                <tbody className="space-y-1.5">
                  <tr>
                    <td className="pr-2 py-1 text-gray-600 w-1/3">Assessment #:</td>
                    <td className="font-medium">{assessmentNumber}/30</td>
                  </tr>
                  <tr>
                    <td className="pr-2 py-1 text-gray-600">Date:</td>
                    <td className="font-medium">{new Date().toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 py-1 text-gray-600">Category:</td>
                    <td className="font-medium">{selectedCategory?.title || 'General Assessment'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </header>
      
      {/* Assessment Responses */}
      <section className="space-y-3 relative">
        <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-blue-900">
          <div>
            <h2 className="text-lg font-bold text-blue-900">Assessment Responses</h2>
            <p className="text-[10px] text-gray-600">Evaluation Questions and Student Responses</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-900">{dailyQuestions.length}</div>
            <div className="text-[10px] text-gray-600">Total Questions</div>
          </div>
        </div>

        <div className="space-y-3">
          {dailyQuestions.map((question, index) => (
            <div key={question.id} className="relative bg-gradient-to-r from-white to-gray-50 rounded-md border border-gray-200 p-3 print:break-inside-avoid shadow-sm">
              <div className="absolute top-0 left-0 w-0.5 h-full bg-blue-900 rounded-l-sm"></div>
              <div className="flex gap-3">
                <div className="flex-none">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="text-xs font-medium leading-snug text-gray-900">{question.question_text}</p>
                    <span className="shrink-0 px-1.5 py-0.5 bg-blue-100 text-blue-900 text-[9px] rounded-sm font-medium border border-blue-200 uppercase tracking-wider">
                      {question.question_category}
                    </span>
                  </div>
                  <div className="bg-white rounded-sm p-2 border border-gray-200">
                    <p className="text-[10px] text-gray-800">
                      <span className="font-semibold text-blue-900">Response:</span>{' '}
                      <span>{responses[question.id]?.charAt(0).toUpperCase() + responses[question.id]?.slice(1)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-[12mm] left-[12mm] right-[12mm]">
        <div className="border-t-2 border-gray-200 pt-3">
          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
            <p className="text-[10px] text-blue-900 text-center">
              This assessment is for screening purposes only and should be interpreted by qualified professionals.
              All information contained within is confidential and protected under FERPA guidelines.
              For more information about FERPA, visit: https://studentprivacy.ed.gov/faq/what-ferpa
            </p>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-3 gap-3 text-[9px] text-gray-600 mb-3">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1 uppercase tracking-wider">Document Information</h4>
              <p className="mb-0.5">Generated: {new Date().toLocaleString()}</p>
              <p className="mb-0.5">Report ID: {currentAssessment?.id || 'N/A'}</p>
              <p>Assessment #{assessmentNumber} of 30</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-blue-900 mb-1 uppercase tracking-wider">FERPA Notice</h4>
              <p className="mb-0.5">CONFIDENTIAL DOCUMENT</p>
              <p className="mb-0.5">Protected by Family Educational</p>
              <p className="mb-0.5">Rights and Privacy Act (FERPA)</p>
              <p>20 U.S.C. § 1232g; 34 CFR Part 99</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-blue-900 mb-1 uppercase tracking-wider">Department Contact</h4>
              <p className="mb-0.5">Special Education Division</p>
              <p className="mb-0.5">Assessment Department</p>
              <p>Educational Services</p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[8px] text-gray-500">
            <span>Special Education Assessment Tool • Confidential Report</span>
            <span>&#169; {new Date().getFullYear()} All Rights Reserved</span>
            <div className="flex items-center space-x-1">
              <span>Page 1 of 1</span>
              <div className="w-2.5 h-2.5">
                <svg className="w-full h-full text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const handlePrint = () => {
    window.print();
  };

  const renderResults = () => {
    if (!categoryScores) return null;

    return (
      <div className="space-y-4">
        {/* Print-only content */}
        <PrintableAssessment />
        
        {/* Screen-only content */}
        <div className="print:hidden">
          {/* Completion Message */}
          <div className="bg-green-50 border-l-4 border-green-400 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-4 w-4 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-2">
                <p className="text-sm text-green-700">{completionMessage}</p>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mt-4">
            <div className="px-3 py-3 sm:px-4">
              <h3 className="text-sm font-medium text-gray-900">Assessment Results</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Category scores for assessment #{assessmentNumber}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {Object.entries(categoryScores).map(([category, score], idx) => (
                  <div key={category} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-4`}>
                    <dt className="text-sm font-medium text-gray-500">{category}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {score}% concern level
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Responses Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md mt-4">
            <div className="px-3 py-3 sm:px-4">
              <h3 className="text-sm font-medium text-gray-900">Assessment Responses</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                {dailyQuestions.map((question, index) => (
                  <div key={question.id} className="px-3 py-3">
                    <div className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900">{question.question_text}</h4>
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-sm">
                            {question.question_category}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Response: <span className="font-medium">{responses[question.id]?.charAt(0).toUpperCase() + responses[question.id]?.slice(1)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-sm text-gray-500 mt-4">
            <p className="font-medium mb-2">Important Notice:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>This assessment is for screening purposes only and does not provide a diagnosis.</li>
              <li>Results should be interpreted by qualified healthcare professionals.</li>
              <li>Assessment results are valid for 30 days from the date of completion.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => {
                setActiveStep(0);
                setCompletionMessage('');
                setCategoryScores(null);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Start New Assessment
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaPrint className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaGraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Special Education Assessment Tool</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Welcome to our comprehensive assessment platform. Select a student to begin today's assessment.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-2 text-left rounded-md">
        <p className="text-yellow-700">
          <strong>Important Notice:</strong> Assessment results will be available after 30 days to ensure accurate progress tracking.
        </p>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6  text-left rounded-md">
        <p className="text-yellow-700">
          <strong>Important Notice:</strong> This tool is designed for initial screening purposes only and does not provide a diagnosis. 
          Always consult with qualified healthcare professionals for proper evaluation and diagnosis.
        </p>
      </div>

      <div className="bg-white rounded-md shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900">What You Can Do</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaBrain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">Conduct Assessments</h3>
            <p className="text-gray-600">Evaluate students across multiple categories including ADHD, ASD, and more.</p>
          </div>
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCalendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor student development with daily assessments and detailed history.</p>
          </div>
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHistory className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">View History</h3>
            <p className="text-gray-600">Access comprehensive assessment history and generate detailed reports.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setActiveStep(1)}
          className="inline-flex items-center px-6 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group"
        >
          Start Assessment
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );

  const renderStudentSelection = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-3 py-3 sm:px-4">
          <h3 className="text-sm font-medium text-gray-900">Select Student</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Choose a student to begin the assessment
          </p>
        </div>
        <div className="border-t border-gray-200 px-3 py-3 sm:p-0">
          <div className="py-3 px-4">
            <div className="flex items-center mb-3">
              <input
                type="text"
                placeholder="Search students..."
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {students
                .filter(student => 
                  `${student.first_name} ${student.last_name}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((student) => (
                  <div
                    key={student.id}
                    className={`relative rounded-md border p-3 cursor-pointer hover:border-indigo-500 ${
                      selectedStudent?.id === student.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FaChild className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Grade Level: {student.student_info?.grade_level || student.grade_level || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {student.id}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="px-3 py-3 bg-gray-50 text-right sm:px-4">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {
              if (selectedStudent) {
                setActiveStep(2);
              } else {
                toast.warning('Please select a student first');
              }
            }}
          >
            Continue
            <FaArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-3 py-3 sm:px-4">
          <h3 className="text-sm font-medium text-gray-900">Confirm Assessment</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review the details before starting the assessment
          </p>
        </div>
        <div className="border-t border-gray-200 px-3 py-3">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="font-medium">Selected Student:</h4>
              <p>{selectedStudent?.first_name} {selectedStudent?.last_name}</p>
            </div>
            <div>
              <h4 className="font-medium">Assessment Date:</h4>
              <p>{currentDate}</p>
            </div>
          </div>
        </div>
        <div className="px-3 py-3 bg-gray-50 sm:px-4 flex justify-between">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setActiveStep(1)}
          >
            <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Back
          </button>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={handleStartAssessment}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2 -ml-1 h-5 w-5" />
                Starting...
              </>
            ) : (
              <>
                Start Assessment
                <FaArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-3 py-3 sm:px-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Assessment History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Showing all assessments for {selectedStudent?.first_name} {selectedStudent?.last_name}
            </p>
          </div>
          <button
            onClick={() => setShowHistory(false)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Close History
          </button>
        </div>
        <div className="border-t border-gray-200">
          {assessmentHistory.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No assessments completed yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results Available Until
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessmentHistory.map((assessment) => {
                    const resultsAvailable = new Date(assessment.results_available_date) > new Date();
                    return (
                      <tr key={assessment.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assessment.assessment_number}/30
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assessment.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {assessment.category.title}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assessment.completed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assessment.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {resultsAvailable 
                            ? new Date(assessment.results_available_date).toLocaleDateString()
                            : 'Expired'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                          {resultsAvailable && (
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() => {
                                  setCategoryScores(assessment.category_scores);
                                  setAssessmentNumber(assessment.assessment_number);
                                  setActiveStep(5);
                                  setShowHistory(false);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Results
                              </button>
                              <button
                                onClick={() => window.print()}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <FaPrint className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : showHistory ? (
        renderHistory()
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Special Education Assessment</h1>
            <button
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FaHistory className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              View History
            </button>
          </div>
          {activeStep === 0 && renderWelcome()}
          {activeStep === 1 && renderStudentSelection()}
          {activeStep === 2 && renderConfirmation()}
          {activeStep === 3 && renderAssessment()}
          {activeStep === 5 && renderResults()}
        </div>
      )}
    </div>
  );
};

export default SpecialEd;
