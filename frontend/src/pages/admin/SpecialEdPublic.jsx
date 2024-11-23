import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaArrowRight, FaBookReader, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { axiosInstance } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const SpecialEdPublic = () => {
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [error, setError] = useState(null);
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

  const handleCategorySelect = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      setAnswers({}); // Reset answers when selecting new category
      
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
        setAssessmentStarted(true);
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

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitAssessment = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Validate that all questions have answers
      const unansweredQuestions = questions.filter(q => !answers[q.id]);
      if (unansweredQuestions.length > 0) {
        toast.error('Please answer all questions before submitting');
        setIsSubmitting(false);
        return;
      }

      setShowResults(true);
      setAssessmentStarted(false);
      setActiveStep(2);
      toast.success('Assessment completed successfully!');
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="mb-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaGraduationCap className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Special Education Assessment</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to our assessment platform. Please select a category to begin your assessment.
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Important Notice:</strong> This assessment is for screening purposes only and does not provide a diagnosis. 
              Please consult with qualified healthcare professionals for proper evaluation and diagnosis.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaBookReader className="w-6 h-6 text-blue-600" />
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

  const renderAssessment = () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedCategory.title} Assessment</h2>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</h3>
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
                style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {Object.keys(answers).length} of {questions.length} questions answered
            </p>
          </div>
          
          <button
            onClick={handleSubmitAssessment}
            disabled={isSubmitting || Object.keys(answers).length !== questions.length}
            className={`w-full inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white rounded-md ${
              isSubmitting || Object.keys(answers).length !== questions.length
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
                Submit Assessment ({Object.keys(answers).length}/{questions.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Results</h2>
          <p className="text-gray-600">Category: {selectedCategory.title}</p>
          <p className="text-gray-600">Date: {currentDate}</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> These results are for screening purposes only. Please consult with a qualified healthcare professional for proper evaluation and diagnosis.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 mb-2">{question.question_text}</p>
              <div className="flex items-center">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  answers[question.id] === 'very_often' ? 'bg-red-100 text-red-800' :
                  answers[question.id] === 'often' ? 'bg-orange-100 text-orange-800' :
                  answers[question.id] === 'sometimes' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {answers[question.id]?.charAt(0).toUpperCase() + answers[question.id]?.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h3>
          <p className="text-blue-800 mb-4">
            Please share these results with your healthcare provider or education specialist for proper evaluation and guidance.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveStep(0)}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Start New Assessment
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
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
          {activeStep === 1 && renderAssessment()}
          {activeStep === 2 && renderResults()}
        </>
      )}
    </div>
  );
};

export default SpecialEdPublic;
