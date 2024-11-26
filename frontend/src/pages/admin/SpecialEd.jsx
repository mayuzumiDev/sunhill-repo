import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaFilePdf, FaPrint, FaArrowRight, FaChild, FaBrain, FaBookReader, FaSearch, FaPlus, FaCalendar, FaHistory, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import { axiosInstance } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import HideScrollbar from "../../components/misc/HideScrollBar";

const SpecialEd = () => {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [dailyQuestions, setDailyQuestions] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
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
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [categoryScores, setCategoryScores] = useState(null);
  const [assessmentNumber, setAssessmentNumber] = useState(1);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [responses, setResponses] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [showCompletionAnalysis, setShowCompletionAnalysis] = useState(false);
  const [completionAnalysis, setCompletionAnalysis] = useState(null);

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get('/user-admin/user-info/');
        setUserRole(response.data.role);
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleStartAssessment = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check existing assessments for this student by this user
      const checkResponse = await axiosInstance.get('/special-education/assessments/', {
        params: {
          student: selectedStudent.id,
          assessor: userId
        }
      });

      // If there are existing assessments, check if they're all completed
      if (Array.isArray(checkResponse.data) && checkResponse.data.length > 0) {
        const incompleteAssessment = checkResponse.data.find(a => !a.completed);
        if (incompleteAssessment) {
          toast.error('Please complete your existing assessment for this student first');
          setLoading(false);
          return;
        }
        
        // Check if all 30 assessments are completed
        const completedAssessments = checkResponse.data.filter(a => a.completed);
        if (completedAssessments.length >= 30) {
          toast.info('You have completed all 30 assessments for this student. Starting a new set.');
          // Optional: Add API call here to reset assessment count for this student
          await axiosInstance.post('/special-education/assessments/reset/', {
            student: selectedStudent.id,
            assessor: userId
          });
        }
      }

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
      const responseResult = await axiosInstance.post('/special-education/responses/bulk-create/', {
        responses: formattedResponses
      });

      console.log('Response submission result:', responseResult.data);

      if (responseResult.data) {
        // Update assessment as completed
        const updateResult = await axiosInstance.patch(`/special-education/assessments/${currentAssessment.id}/update/`, {
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
          
          // Check if this was the 30th assessment
          if (updateResult.data.assessment_number === 30) {
            await checkAssessmentCompletion(selectedStudent.id);
          }
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
        className={`p-1 rounded-md border-2 transition-all ${
          responses[questionId] === value
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:border-blue-200'
        }`}
      >
        {label}
      </button>
    ));
  };

  // const renderQuestions = () => {
  //   if (!dailyQuestions.length) return null;

  //   return (
  //     <div className="space-y-4">
  //       {dailyQuestions.map((question, index) => (
  //         <div key={question.id} className="bg-gray-50 rounded-md p-2">
  //           <div className="flex items-start space-x-2">
  //             <span className="flex items-center justify-center w-4 h-4 bg-blue-100 text-blue-600 rounded-full">
  //               {index + 1}
  //             </span>
  //             <div className="flex-1">
  //               <div className="flex justify-between items-start mb-1">
  //                 <h3 className="text-sm font-medium text-gray-900">{question.question_text}</h3>
  //                 <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-sm">
  //                   {question.question_category}
  //                 </span>
  //               </div>
  //               <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
  //                 {renderResponseButtons(question.id)}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const renderAssessment = () => {
    if (!currentAssessment || !selectedCategory || !dailyQuestions.length) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto ">
        <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              {/* <h2 className="text-base sm:text-lg font-bold text-gray-900">{selectedCategory.title}</h2> */}
              <p className="text-sm text-gray-600">
                Student: {selectedStudent.first_name} {selectedStudent.last_name}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Assessment {currentAssessment.assessment_number}/30
              </p>
            </div>
            <button
              onClick={() => {
                setActiveStep(2);
                resetAssessmentState();
              }}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 w-full sm:w-auto justify-center sm:justify-start"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          <div className="space-y-4">
            {dailyQuestions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-md p-3 sm:p-4">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 bg-blue-100 text-blue-600 rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 break-words">{question.question_text}</h3>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-sm whitespace-nowrap">
                        {question.question_category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-base">
                      {renderResponseButtons(question.id)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              {Object.keys(responses).length !== dailyQuestions.length && (
                <p className="text-amber-600 text-sm">
                  Please answer all {dailyQuestions.length} questions before submitting. 
                  You have {dailyQuestions.length - Object.keys(responses).length} question(s) remaining.
                </p>
              )}
              <button
                onClick={handleSubmitResponses}
                disabled={isSubmitting || Object.keys(responses).length !== dailyQuestions.length}
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full sm:w-auto ${
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


  const fetchAssessmentHistory = async (studentId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/special-education/assessments/';
      const params = new URLSearchParams();
      
      if (studentId && studentId !== 'all' && studentId !== 'null') {
        params.append('student', studentId);
      }

      // Always filter by teacher if user is a teacher
      if (userRole === 'teacher' && userId) {
        params.append('teacher', userId);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching assessment history from:', url);
      const response = await axiosInstance.get(url);
      
      if (Array.isArray(response.data)) {
        setAssessmentHistory(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        toast.error('Received unexpected data format from server');
        setAssessmentHistory([]);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to load assessment history';
      setError(errorMessage);
      toast.error(errorMessage);
      setAssessmentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showHistory) {
      console.log('History view opened, current filter:', historyFilter);
      const studentId = historyFilter === 'all' ? null : historyFilter;
      console.log('Fetching history for student ID:', studentId);
      fetchAssessmentHistory(studentId);
    }
  }, [showHistory, historyFilter]);

  const handleHistoryClick = () => {
    console.log('History button clicked');
    setShowHistory(true);
    setHistoryFilter('all');
    fetchAssessmentHistory(null);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    try {
      await axiosInstance.delete(`/special-education/assessments/${assessmentId}/delete/`);
      toast.success('Assessment deleted successfully');
      fetchAssessmentHistory(historyFilter === 'all' ? null : historyFilter);
      setShowDeleteConfirm(false);
      setAssessmentToDelete(null);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assessment');
    }
  };

  const filteredAssessmentHistory = assessmentHistory.filter(assessment => {
    const searchLower = historySearchQuery.toLowerCase();
    const studentName = assessment.student_name || 
      (assessment.student_details && 
       `${assessment.student_details.first_name} ${assessment.student_details.last_name}`) ||
      'Unknown Student';

    const assessorName = assessment.teacher_name ||
      (assessment.teacher_details && 
       `${assessment.teacher_details.first_name} ${assessment.teacher_details.last_name}`) ||
      'Unknown Teacher';

    return (
      studentName.toLowerCase().includes(searchLower) ||
      assessorName.toLowerCase().includes(searchLower) ||
      (assessment.date && new Date(assessment.date).toLocaleDateString().toLowerCase().includes(searchLower)) ||
      (assessment.completed ? 'completed' : 'in progress').includes(searchLower)
    );
  });

  const getSeverityLevel = (score) => {
    if (score <= 25) return { level: 'Minimal', color: 'green' };
    if (score <= 50) return { level: 'Moderate', color: 'yellow' };
    if (score <= 75) return { level: 'Significant', color: 'orange' };
    return { level: 'Severe', color: 'red' };
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
                {Object.entries(categoryScores).map(([category, score], idx) => {
                  const severity = getSeverityLevel(score);
                  return (
                    <div key={category} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-4`}>
                      <dt className="text-sm font-medium text-gray-500">{category}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-between">
                        <span>{score}% concern level</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full
                          ${severity.color === 'green' ? 'bg-green-100 text-green-800' : ''}
                          ${severity.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${severity.color === 'orange' ? 'bg-orange-100 text-orange-800' : ''}
                          ${severity.color === 'red' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {severity.level}
                        </span>
                      </dd>
                    </div>
                  );
                })}
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
                setLoading(true);
                setActiveStep(0);
                setCompletionMessage('');
                setCategoryScores(null);
                setTimeout(() => setLoading(false), 3000);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Start New Assessment
            </button>

          </div>
        </div>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 text-center">
      <div className="mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <FaGraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Special Education Assessment Tool</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-2">
          Welcome to our comprehensive assessment platform. Select a student to begin today's assessment.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-left rounded-md">
          <p className="text-yellow-700 text-sm sm:text-base">
            <strong>Important Notice:</strong> Assessment results will be available after 30 days to ensure accurate progress tracking.
          </p>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-left rounded-md">
          <p className="text-yellow-700 text-sm sm:text-base">
            <strong>Important Notice:</strong> This tool is designed for initial screening purposes only and does not provide a diagnosis. 
            Always consult with qualified healthcare professionals for proper evaluation and diagnosis.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaBrain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">Conduct Assessments</h3>
            <p className="text-sm text-gray-600">Evaluate students across multiple categories including ADHD, ASD, and more.</p>
          </div>
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCalendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor student development with daily assessments and detailed history.</p>
          </div>
          <div className="p-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaHistory className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold mb-2">View History</h3>
            <p className="text-sm text-gray-600">Access comprehensive assessment history and generate detailed reports.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setActiveStep(1)}
          className="inline-flex items-center px-4 sm:px-6 py-2 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group w-full sm:w-auto"
        >
          Start Assessment
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );

  const renderStudentSelection = () => {
    const filteredStudents = students
      .filter(student => 
        `${student.first_name} ${student.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

    const displayedStudents = searchQuery 
      ? filteredStudents 
      : filteredStudents.slice(0, 10);

    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-3 py-3 sm:px-4">
            <h3 className="text-sm font-medium text-gray-900">Select Student</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Choose a student to begin the assessment
            </p>
          </div>
          <div className="border-t border-gray-200 px-3 py-3 sm:p-0">
            <div className="py-3 px-4">
              <div className="flex items-center border-b mb-5 border-gray-300">
                <FaSearch className="mr-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full py-2 px-3 text-sm leading-5 bg-white focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedStudents.map((student) => (
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
              {!searchQuery && filteredStudents.length > 0 && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  Showing {Math.min(10, filteredStudents.length)} of {students.length} students. Use the search to find more.
                </div>
              )}
              {searchQuery && filteredStudents.length === 0 && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  No students found matching your search.
                </div>
              )}
            </div>
          </div>
          <div className="px-3 py-3 bg-gray-50 text-right sm:px-4">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
  };

  const renderConfirmation = () => (
    <div className="max-w-7xl mx-auto">
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
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setActiveStep(1)}
          >
            <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" />
            Back
          </button>
          <button
            type="button"
            className="inline-flex items-center px-1 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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

  const renderHistory = () => {
    if (error) {
      return (
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setShowHistory(false);
            }}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaArrowLeft className="-ml-0.5 mr-2 h-4 w-4" /> Back to Assessments
          </button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <FaSpinner className="animate-spin text-2xl text-blue-500" />
        </div>
      );
    }

    if (!assessmentHistory || assessmentHistory.length === 0) {
      return (
        <div className="text-center p-4">
          <div className="text-gray-500 mb-2">No assessment history found</div>
          <button
            onClick={() => setShowHistory(false)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaArrowLeft className="-ml-0.5 mr-2 h-4 w-4" /> Back to Assessments
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(false)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assessment History</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search assessments..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {/* <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value)}
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select> */}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Assessment Records
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Total Records: {filteredAssessmentHistory.length}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-full divide-y divide-gray-200">
              <div className="bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="sm:col-span-1">Student</div>
                  <div className="sm:col-span-1">Assessment</div>
                  <div className="sm:col-span-1">Date</div>
                  <div className="sm:col-span-1">Status</div>
                  <div className="sm:col-span-1">Assessor</div>
                  <div className="sm:col-span-1">Actions</div>
                </div>
              </div>
              <div className="bg-white divide-y divide-gray-200">
                {filteredAssessmentHistory.map((assessment) => {
                  const studentName = assessment.student_name || 
                    (assessment.student_details && 
                     `${assessment.student_details.first_name} ${assessment.student_details.last_name}`) ||
                    'Unknown Student';

                  const assessorName = assessment.assessor_name || 'Unknown Assessor';

                  return (
                    <div key={assessment.id} className="hover:bg-gray-50">
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 px-4 py-3">
                        <div className="sm:col-span-1">
                          <div className="text-sm font-medium text-gray-900">
                            {studentName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {assessment.student}
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <div className="text-sm text-gray-900">
                            Assessment #{assessment.assessment_number || 'N/A'}/30
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <div className="text-sm text-gray-900">
                            {assessment.date ? new Date(assessment.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {assessment.date ? new Date(assessment.date).toLocaleTimeString() : ''}
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assessment.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assessment.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <div className="sm:col-span-1">
                          <div className="text-sm text-gray-900">
                            {assessorName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {assessment.assessor || 'N/A'}
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <div className="flex flex-col sm:flex-row gap-2">
                            {assessment.completed && (
                              <button
                                onClick={() => handlePrintAssessment(assessment)}
                                className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 w-full sm:w-auto"
                              >
                                <FaPrint className="mr-1" /> Print
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setAssessmentToDelete(assessment);
                                setShowDeleteConfirm(true);
                              }}
                              className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-900 w-full sm:w-auto"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePrintAssessment = async (assessment) => {
    try {
      setLoading(true);
      
      // Fetch the complete assessment details
      const response = await axiosInstance.get(`/special-education/assessments/${assessment.id}/`);
      const fullAssessment = response.data;
      
      // Update all necessary state for printing
      setCurrentAssessment(fullAssessment);
      setAssessmentNumber(fullAssessment.assessment_number || 1);
      setSelectedStudent(fullAssessment.student_details);
      setSelectedCategory(fullAssessment.category_details);
      setDailyQuestions(fullAssessment.responses.map(r => ({
        id: r.question,
        question_text: r.question_text,
        question_category: r.question_category
      })));
      
      // Create responses object
      const responseObj = {};
      fullAssessment.responses.forEach(r => {
        responseObj[r.question] = r.response;
      });
      setResponses(responseObj);
      
      // Set category scores
      setCategoryScores(fullAssessment.category_scores || {});
      
      // Wait for state updates to propagate
      setTimeout(() => {
        window.print();
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error preparing assessment for print:', error);
      toast.error('Failed to prepare assessment for printing');
      setLoading(false);
    }
  };

  const PrintableAssessment = () => (
    <div id="printable-assessment" className="hidden print:block print:w-[215.9mm] print:h-[200.2mm] print:pt-[10mm] print:pb-[10mm] print:px-[30mm] print:text-black print:bg-white relative print:text-[6em]">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none rotate-[-35deg]">
        <div className="text-[90px] font-bold text-gray-900 whitespace-nowrap">CONFIDENTIAL</div>
      </div>

      {/* Logo and Header Section */}
      <header className="mb-4">
        <div className="text-center mb-3 relative pb-2">
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
          <div className="px-8">
            <h1 className="text-xl font-bold text-blue-900 mb-1">Special Education Assessment Report</h1>
            <p className="text-[8px] text-gray-600 mb-1">Confidential Student Assessment Document</p>
            <div className="flex items-center justify-center   text-[9px] text-gray-500">
            </div>
          </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* Student Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-2 py-1.5">
              <h3 className="text-[8px] font-semibold uppercase tracking-wider">Student Information</h3>
            </div>
            <div className="p-2">
              <table className="w-full text-[8px]">
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
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-900 text-white px-2 py-1.5">
              <h3 className="text-[8px] font-semibold uppercase tracking-wider">Assessment Details</h3>
            </div>
            <div className="p-1">
              <table className="w-full text-[8px]">
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
                    {/* <td className="pr-2 py-1 text-gray-600">Category:</td>
                    <td className="font-medium">{selectedCategory?.title || 'General Assessment'}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </header>
 
      {/* Assessment Responses */}
      <section className="space-y-0.5 relative print:text-[0.25em]">
        <div className="flex justify-between items-center mb-1 pb-1 border-b border-blue-900">
          <div>
            <h2 className="text-base font-bold text-blue-900">Assessment Responses</h2>
            <p className="text-[7px] text-gray-600 mb-1">Evaluation Questions and Student Responses</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-900">{dailyQuestions.length}</div>
            <div className="text-[8px] text-gray-500">Total Questions</div>
          </div>
        </div>

        <div className="space-y-1">
          {dailyQuestions.map((question, index) => (
            <div key={question.id} className="relative bg-gradient-to-r from-white to-gray-50 rounded-sm border border-gray-200 p-1 print:break-inside-avoid shadow-sm">
              <div className="absolute top-0 left-0 bg-blue-900 rounded-l-sm"></div>
              <div className="flex gap-1">
                <div className="flex-none">
                  <span className="inline-flex items-center justify-center w-3 h-3 bg-blue-100 text-blue-600 rounded-full">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-1 mb-0.5">
                    <p className="text-[10px] font-medium leading-tight text-gray-900">{question.question_text}</p>
                    <span className="shrink-0 px-1 py-0.5 bg-blue-100 text-blue-900 text-[7px] rounded-sm font-medium border border-blue-200 uppercase tracking-wider">
                      {question.question_category}
                    </span>
                  </div>
                  <div className="bg-white rounded-sm p-1 border border-gray-200">
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
      <footer className="relative top-2">
        <div className="border-t border-gray-200 pt-2">
          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-sm  mb-2">
            <p className="text-[8px] text-blue-900 text-center">
              This assessment is for screening purposes only and should be interpreted by qualified professionals.
              All information contained within is confidential and protected under FERPA guidelines.
              For more information about FERPA, visit: https://studentprivacy.ed.gov/faq/what-ferpa
            </p>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-3 gap-2 text-[7px] text-gray-600 mb-2">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1 uppercase tracking-wider">Document Information</h4>
              <p className="mb-0.5">Generated: {new Date().toLocaleString()}</p>
              <p className="mb-0.5">Report ID: {currentAssessment?.id || 'N/A'}</p>
              <p>Assessment #{assessmentNumber} of 30</p>
            </div>

          </div>
          
          {/* Copyright */}
          <div className="flex justify-between items-center pt-1 border-t border-gray-200 text-[6px] text-gray-500">
            <span>Special Education Assessment Tool • Confidential Report</span>
            <span>&#169; {new Date().getFullYear()} All Rights Reserved</span>
            <div className="flex items-center space-x-1">
              <span>Page 1 of 1</span>
              <div className="w-2.5 h-2.5">
                <svg className="w-full h-full text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>

  );

  const checkAssessmentCompletion = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/special-education/assessments/analysis/${studentId}/`);
      const analysis = response.data;
      
      // Only show completion analysis if exactly 30 assessments are completed
      if (analysis.total_assessments === 30) {
        setCompletionAnalysis(analysis);
        setShowCompletionAnalysis(true);
      } else {
        setCompletionAnalysis(null);
        setShowCompletionAnalysis(false);
      }
    } catch (error) {
      console.error('Error checking assessment completion:', error);
    }
  };

  useEffect(() => {
    // Only check completion when assessment is completed
    if (selectedStudent?.id && activeStep === 5) {
      checkAssessmentCompletion(selectedStudent.id);
    }
  }, [selectedStudent, activeStep]);

  const renderCompletionAnalysis = () => {
    if (!completionAnalysis) return null;

    const sortedCategories = Object.entries(completionAnalysis.category_percentages)
      .sort(([, a], [, b]) => b - a);

    const highestCategory = sortedCategories[0];
    const recommendedActions = {
      'Academic': 'Consider advanced placement or enrichment programs',
      'Behavioral': 'Implement positive behavior support strategies',
      'Social': 'Encourage participation in social skill development activities',
      'Emotional': 'Provide emotional support and counseling services',
      'Physical': 'Consider occupational or physical therapy assessment'
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={() => setShowCompletionAnalysis(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <FaCheck className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-sm text-gray-500">
              {selectedStudent?.first_name} has completed 30 days of assessments. Here's a comprehensive analysis:
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Analysis</h3>
            <div className="space-y-4">
              {sortedCategories.map(([category, percentage]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaBrain className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Primary Focus Area</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Based on the assessments, the highest attention is needed in the {highestCategory[0]} category 
                  ({highestCategory[1].toFixed(1)}%).
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Recommended Action: {recommendedActions[highestCategory[0]] || 'Consult with special education specialists'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCompletionAnalysis(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowCompletionAnalysis(false);
                handlePrintAssessment(completionAnalysis.latest_assessment);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* PrintableAssessment should always be present but hidden until print */}
      <PrintableAssessment />
      
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
              onClick={handleHistoryClick}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Assessment</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this assessment? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteAssessment(assessmentToDelete.id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setAssessmentToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCompletionAnalysis && renderCompletionAnalysis()}
      <HideScrollbar/>
    </div>

  );
};

export default SpecialEd;
