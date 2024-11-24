import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaArrowRight, FaBookReader, FaCheck, FaSpinner, FaExclamationTriangle, FaPrint, FaLanguage } from 'react-icons/fa';
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
  const [language, setLanguage] = useState('en');

  const translations = {
    en: {
      welcome: 'Special Education Assessment',
      welcomeDesc: 'Welcome to our assessment platform. Please select a category to begin your assessment.',
      notice: 'Important Notice: This assessment is for screening purposes only and does not provide a diagnosis. Please consult with qualified healthcare professionals for proper evaluation and diagnosis.',
      never: 'Never',
      sometimes: 'Sometimes',
      often: 'Often',
      veryOften: 'Very Often',
      submit: 'Submit Assessment',
      minimal: 'Minimal',
      moderate: 'Moderate',
      significant: 'Significant',
      severe: 'Severe',
      startNew: 'Start New Assessment',
      print: 'Print Results',
      results: 'Assessment Results',
      category: 'Category',
      date: 'Date',
      summary: 'Assessment Summary',
      evaluation: 'Evaluation',
      considerSunhill: 'Consider Sunhill Developmental Education',
      benefits: {
        individual: '✓ Individualized learning programs',
        experienced: '✓ Experienced special education teachers',
        supportive: '✓ Supportive learning environment',
        monitoring: '✓ Regular progress monitoring'
      }
    },
    tl: {
      welcome: 'Pagsusuri sa Espesyal na Edukasyon',
      welcomeDesc: 'Maligayang pagdating sa aming platform ng pagsusuri. Mangyaring pumili ng kategorya upang simulan ang iyong pagsusuri.',
      notice: 'Mahalagang Paalala: Ang pagsusuring ito ay para lamang sa paunang pagsusuri at hindi nagbibigay ng diagnosis. Mangyaring kumonsulta sa mga kwalipikadong propesyonal sa kalusugan para sa wastong pagsusuri at diagnosis.',
      never: 'Hindi Kailanman',
      sometimes: 'Paminsan-minsan',
      often: 'Madalas',
      veryOften: 'Napakadalas',
      submit: 'Isumite ang Pagsusuri',
      minimal: 'Minimal',
      moderate: 'Katamtaman',
      significant: 'Kapansin-pansin',
      severe: 'Malubha',
      startNew: 'Magsimula ng Bagong Pagsusuri',
      print: 'I-print ang mga Resulta',
      results: 'Mga Resulta ng Pagsusuri',
      category: 'Kategorya',
      date: 'Petsa',
      summary: 'Buod ng Pagsusuri',
      evaluation: 'Pagsusuri',
      considerSunhill: 'Isaalang-alang ang Sunhill Developmental Education',
      benefits: {
        individual: '✓ Mga programang pang-indibidwal sa pag-aaral',
        experienced: '✓ Mga guro na may karanasan sa espesyal na edukasyon',
        supportive: '✓ Suportadong kapaligiran sa pag-aaral',
        monitoring: '✓ Regular na pagsubaybay sa pag-unlad'
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value[k];
    }
    return value || key;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch assessment categories
        const categoriesResponse = await axiosInstance.get('/special-education/categories/', {
          params: {
            language: language
          }
        });
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

      // Fetch questions for the selected category using the correct endpoint
      const response = await axiosInstance.get('/special-education/questions/random/', {
        params: {
          category: category.id,
          count: 10,
          language: language
        }
      });

      if (response.data) {
        setQuestions(response.data);
        setActiveStep(1);
        setAssessmentStarted(true);
      } else {
        throw new Error('Failed to load questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load questions';
      setError(errorMessage);
      toast.error(errorMessage);
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

  const handlePrint = () => {
    const scores = calculateScores();
    const printContent = `
      <html>
        <head>
          <title>Assessment Results - ${selectedCategory.title}</title>
          <style>
            @media print {
              @page { margin: 1.5cm; size: A4; }
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.3;
              color: #333;
              max-width: 100%;
              margin: 0;
              padding: 15px;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            h1 { font-size: 16pt; margin: 0 0 5px 0; }
            h2 { font-size: 13pt; margin: 10px 0 5px 0; }
            h3 { font-size: 12pt; margin: 8px 0 4px 0; }
            p { margin: 0 0 5px 0; }
            .notice {
              background: #fff3cd;
              border-left: 3px solid #ffc107;
              padding: 8px;
              margin: 8px 0;
              font-size: 9pt;
            }
            .score-section {
              display: flex;
              align-items: center;
              gap: 10px;
              margin: 10px 0;
            }
            .score-bar {
              flex-grow: 1;
              height: 15px;
              background: #eee;
              border-radius: 8px;
              overflow: hidden;
            }
            .score-fill {
              height: 100%;
              border-radius: 8px;
            }
            .score-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 5px;
              margin: 8px 0;
              font-size: 9pt;
            }
            .score-level {
              padding: 5px;
              border-radius: 4px;
              text-align: center;
            }
            .questions-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 8px;
              margin: 10px 0;
            }
            .question {
              background: #f8f9fa;
              padding: 8px;
              border-radius: 4px;
              font-size: 9pt;
            }
            .answer {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 10px;
              margin-top: 4px;
              font-size: 8pt;
            }
            .recommendations {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin: 10px 0;
            }
            .rec-box {
              padding: 8px;
              border-radius: 4px;
              font-size: 9pt;
            }
            .footer {
              margin-top: 15px;
              padding-top: 8px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 8pt;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Special Education Assessment Results</h1>
            <p>Category: ${selectedCategory.title} | Date: ${currentDate}</p>
          </div>

          <div class="notice">
            <strong>Important Notice:</strong> This assessment is for screening purposes only and does not provide a diagnosis. 
            Please consult with qualified healthcare professionals for proper evaluation and diagnosis.
          </div>

          <div class="score-section">
            <div class="score-bar">
              <div class="score-fill" style="width: ${scores.percentage}%; background: ${
                scores.percentage <= 25 ? '#10b981' :
                scores.percentage <= 50 ? '#fbbf24' :
                scores.percentage <= 75 ? '#f97316' : '#ef4444'
              };"></div>
            </div>
            <strong>${scores.percentage}%</strong>
          </div>

          <div class="score-grid">
            ${['Minimal (0-25%)', 'Moderate (26-50%)', 'Significant (51-75%)', 'Severe (76-100%)'].map((level, index) => {
              const ranges = [25, 50, 75, 100];
              const isActive = scores.percentage <= ranges[index] && (index === 0 || scores.percentage > ranges[index - 1]);
              return `
                <div class="score-level" style="
                  background: ${isActive ? '#f0f9ff' : '#f3f4f6'};
                  color: ${isActive ? '#1e40af' : '#374151'};
                  border: 1px solid ${isActive ? '#93c5fd' : '#e5e7eb'};
                ">
                  ${level}
                </div>
              `;
            }).join('')}
          </div>

          <div class="recommendations">
            <div class="rec-box" style="background: #e8f4f8;">
              <h3>Evaluation</h3>
              <p>Assessment indicates a ${
                scores.percentage <= 25 ? 'minimal' :
                scores.percentage <= 50 ? 'moderate' :
                scores.percentage <= 75 ? 'significant' : 'severe'
              } level of ${selectedCategory.title.toLowerCase()} traits (${scores.percentage}%).</p>
            </div>
            <div class="rec-box" style="background: #f0fdf4;">
              <h3>Sunhill Special Education</h3>
              <p>✓ Individualized learning</p>
              <p>✓ Experienced teachers</p>
              <p>✓ Supportive environment</p>
            </div>
          </div>

          <h2>Assessment Questions & Responses</h2>
          <div class="questions-grid">
            ${questions.map((question, index) => `
              <div class="question">
                <strong>${index + 1}. ${question.question_text}</strong>
                <div class="answer" style="
                  background: ${
                    answers[question.id] === 'never' ? '#dcfce7' :
                    answers[question.id] === 'sometimes' ? '#fef3c7' :
                    answers[question.id] === 'often' ? '#ffedd5' : '#fee2e2'
                  };
                  color: ${
                    answers[question.id] === 'never' ? '#166534' :
                    answers[question.id] === 'sometimes' ? '#92400e' :
                    answers[question.id] === 'often' ? '#9a3412' : '#991b1b'
                  };
                ">
                  ${answers[question.id]?.charAt(0).toUpperCase() + answers[question.id]?.slice(1).replace('_', ' ')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>Reference: ${new Date().getFullYear()}${String(selectedCategory.id).padStart(2, '0')}${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
            <p>Sunhill Special Education Assessment | ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const calculateScores = () => {
    const scoreMap = {
      'never': 0,
      'sometimes': 1,
      'often': 2,
      'very_often': 3
    };

    const totalQuestions = questions.length;
    const maxScore = totalQuestions * 3; // 3 is max score per question

    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, answer) => {
      return sum + scoreMap[answer];
    }, 0);

    // Calculate percentage
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Calculate category levels
    const categoryLevels = {
      minimal: percentage <= 25,
      moderate: percentage > 25 && percentage <= 50,
      significant: percentage > 50 && percentage <= 75,
      severe: percentage > 75
    };

    return {
      percentage,
      categoryLevels,
      totalScore,
      maxScore
    };
  };

  const handleStartNew = async () => {
    setLoading(true);
    setActiveStep(0);
    setSelectedCategory(null);
    setAnswers({});
    setQuestions([]);
    setAssessmentStarted(false);
    setError(null);
    setIsSubmitting(false);
    setShowResults(false);
    
    try {
      // Refetch assessment categories
      const categoriesResponse = await axiosInstance.get('/special-education/categories/', {
        params: {
          language: language
        }
      });
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError(error.response?.data?.message || 'Failed to load initial data');
      toast.error('Failed to load initial data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderWelcome = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setLanguage(language === 'en' ? 'tl' : 'en')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FaLanguage className="w-5 h-5 mr-2" />
          {language === 'en' ? 'Tagalog' : 'English'}
        </button>
      </div>

      <div className="mb-12">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaGraduationCap className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('welcome')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('welcomeDesc')}
        </p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 text-left">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {t('notice')}
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
                <h3 className="text-xl font-semibold text-gray-900">{category.title_translated || category.title}</h3>
                <p className="text-gray-600">{category.description_translated || category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedCategory.title}</h2>
          <button
            onClick={() => setLanguage(language === 'en' ? 'tl' : 'en')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FaLanguage className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Tagalog' : 'English'}
          </button>
        </div>

        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full text-sm sm:text-base">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                    {language === 'tl' ? question.question_text_tl || question.question_text : question.question_text}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
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
                        {t(option.replace('_', ''))}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Assessment Progress</h3>
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
            className={`w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {t('submitting')}
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                {t('submit')} ({Object.keys(answers).length}/{questions.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const scores = calculateScores();
    
    return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('results')}</h2>
          <p className="text-gray-600">{t('category')}: {selectedCategory.title}</p>
          <p className="text-gray-600">{t('date')}: {currentDate}</p>
        </div>

        {/* Assessment Score Summary */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{t('summary')}</h3>
          <div className="flex items-center mb-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${
                  scores.percentage <= 25 ? 'bg-green-500' :
                  scores.percentage <= 50 ? 'bg-yellow-500' :
                  scores.percentage <= 75 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${scores.percentage}%` }}
              />
            </div>
            <span className="ml-4 font-semibold">{scores.percentage}%</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${scores.categoryLevels.minimal ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              <div className="text-lg font-semibold">{t('minimal')}</div>
              <div className="text-sm">0-25%</div>
            </div>
            <div className={`p-4 rounded-lg ${scores.categoryLevels.moderate ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
              <div className="text-lg font-semibold">{t('moderate')}</div>
              <div className="text-sm">26-50%</div>
            </div>
            <div className={`p-4 rounded-lg ${scores.categoryLevels.significant ? 'bg-orange-100 text-orange-800' : 'bg-gray-100'}`}>
              <div className="text-lg font-semibold">{t('significant')}</div>
              <div className="text-sm">51-75%</div>
            </div>
            <div className={`p-4 rounded-lg ${scores.categoryLevels.severe ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
              <div className="text-lg font-semibold">{t('severe')}</div>
              <div className="text-sm">76-100%</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
              <p className="text-gray-900 mb-2">{question.question_text}</p>
              <div className="flex items-center">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  answers[question.id] === 'very_often' ? 'bg-red-100 text-red-800' :
                  answers[question.id] === 'often' ? 'bg-orange-100 text-orange-800' :
                  answers[question.id] === 'sometimes' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {answers[question.id]?.charAt(0).toUpperCase() + answers[question.id]?.slice(1).replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Assessment responses cannot be saved in our system. Please make sure to print or save your results before leaving this page.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-4">{t('evaluation')}</h3>
            <p className="text-blue-800 mb-4">
              Based on your responses, the assessment indicates a {
                scores.percentage <= 25 ? 'minimal' :
                scores.percentage <= 50 ? 'moderate' :
                scores.percentage <= 75 ? 'significant' : 'severe'
              } level of {selectedCategory.title.toLowerCase()} traits ({scores.percentage}%). We recommend consulting with healthcare providers or education specialists for a comprehensive evaluation and proper diagnosis.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-4">{t('considerSunhill')}</h3>
            <p className="text-green-800 mb-4">
              Sunhill offers specialized education programs designed to support children with diverse learning needs. Our experienced educators and comprehensive support system can help your child reach their full potential.
            </p>
            <div className="space-y-3 text-green-800">
              <p>{t('benefits.individual')}</p>
              <p>{t('benefits.experienced')}</p>
              <p>{t('benefits.supportive')}</p>
              <p>{t('benefits.monitoring')}</p>
            </div>
            <button
              onClick={() => window.location.href = '/enrollment'}
              className="mt-4 inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <FaArrowRight className="mr-2" />
              {t('Learn more')}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleStartNew}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {t('startNew')}
            </button>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FaPrint className="mr-2" />
              {t('print')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  };

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
