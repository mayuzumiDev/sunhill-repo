import React, { useState, useEffect } from 'react';

const SpecialEducationTool = () => {
  const [step, setStep] = useState(1); // To track the current step of the interface
  const [teacherName, setTeacherName] = useState('Teacher'); // Teacher's name for personalization
  const [studentName, setStudentName] = useState(''); // To store the selected student's name
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [isTagalog, setIsTagalog] = useState(false); // To track if the question is in Tagalog

  const categories = [
    { id: 1, name: 'Autism' },
    { id: 2, name: 'ADHD' },
    { id: 3, name: 'Dyslexia' },
    { id: 4, name: 'Dyscalculia' },
    { id: 5, name: 'Dysgraphia' },
  ];

  const questionsByCategory = {
    Autism: [
      'Does the student have difficulty initiating or maintaining conversations?',
      'Does the student have difficulty understanding sarcasm or idioms?',
      'Does the student have difficulty with changes in routine?',
      'Does the student have trouble understanding social cues?',
      'Does the student have difficulty making friends?',
    ],
    ADHD: [
      'Does the student struggle to pay attention to details?',
      'Does the student often interrupt or intrude on others?',
      'Does the student frequently lose things necessary for tasks?',
      'Does the student have trouble staying seated or remaining in one place?',
      'Does the student have difficulty waiting for their turn?',
    ],
    Dyslexia: [
      'Does the student have trouble recognizing letters or sounds?',
      'Does the student avoid reading aloud?',
      'Does the student reverse letters while writing?',
      'Does the student have difficulty with phonemic awareness?',
      'Does the student struggle with spelling?',
    ],
    Dyscalculia: [
      'Does the student have difficulty with basic math operations?',
      'Does the student struggle with number sequences?',
      'Does the student find it hard to understand math symbols?',
      'Does the student have trouble with mental math?',
      'Does the student struggle with time and money concepts?',
    ],
    Dysgraphia: [
      'Does the student struggle with handwriting?',
      'Does the student find it hard to organize thoughts on paper?',
      'Does the student avoid writing activities?',
      'Does the student have difficulty with sentence structure?',
      'Does the student struggle with writing legibly?',
    ],
  };

  // Tagalog questions (make sure to fill these out correctly)
  const tagalogQuestionsByCategory = {
    Autism: [
      'May problema ba ang estudyante sa pagsisimula o pagpapanatili ng usapan?',
      'May problema ba ang estudyante sa pag-unawa ng sarcasm o idyoma?',
      'May problema ba ang estudyante sa pagbabago ng rutin?',
      'May problema ba ang estudyante sa pag-unawa ng mga senyales sa lipunan?',
      'May problema ba ang estudyante sa paggawa ng kaibigan?',
    ],
    ADHD: [
      'Nahihirapan ba ang estudyante na tumutok sa mga detalye?',
      'Madalas bang nakikialam o sumusulong ang estudyante sa iba?',
      'Madalas bang nawawala ng estudyante ang mga bagay na kinakailangan para sa mga gawain?',
      'May problema ba ang estudyante sa pag-upo o manatiling nasa isang lugar?',
      'Nahihirapan ba ang estudyante sa paghihintay sa kanilang turn?',
    ],
    // Add similar translations for Dyslexia, Dyscalculia, and Dysgraphia
  };

  const handleGetStarted = () => {
    setStep(2); // Move to the student selection step
  };

  const handleStudentSelection = () => {
    if (studentName) {
      setStep(3); // Move to the category selection step
    } else {
      alert('Please enter a student name before proceeding.');
    }
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setStep(4); // Move to the question assessment step
  };

  const handleRatingClick = (rating) => {
    const updatedRatings = [...ratings];
    updatedRatings[currentQuestionIndex] = rating;
    setRatings(updatedRatings);

    // Automatically move to the next question after selecting a rating
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsByCategory[selectedCategory.name].length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else if (currentQuestionIndex === questionsByCategory[selectedCategory.name].length - 1) {
      // Move to the completion step
      setStep(5);
    }
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleRestart = () => {
    // Restart the assessment
    setStep(1);
    setStudentName('');
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setRatings([]);
    setIsTagalog(false); // Reset the language selection
  };

  useEffect(() => {
    if (step === 5) {
      alert(`Assessment for ${studentName} completed!`);
    }
  }, [step, studentName]);

  const progressPercentage = () => {
    const totalQuestions = questionsByCategory[selectedCategory.name].length;
    const answeredQuestions = ratings.filter((rating) => rating !== undefined).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const readQuestionAloud = (question) => {
    const speech = new SpeechSynthesisUtterance(question);
    window.speechSynthesis.speak(speech);
  };

  const toggleLanguage = () => {
    setIsTagalog((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-green-200 p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-10">
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-700 mb-4">
              Good Day, {teacherName}!
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to the Special Education Assessment Tool. Let's get started with your assessment.
            </p>
            <button
              className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 transition"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Tag the Student
            </h2>
            <input
              type="text"
              placeholder="Enter student's name"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button
              className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 transition"
              onClick={handleStudentSelection}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Select a Category for {studentName}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 transition"
                  onClick={() => handleCategorySelection(category)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && selectedCategory && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-purple-700">Assessing {studentName}</h1>
                <p className="text-sm text-gray-600">Category: {selectedCategory.name}</p>
              </div>
              <button
                className="bg-purple-700 text-white py-1 px-2 rounded-lg"
                onClick={toggleLanguage}
              >
                {isTagalog ? 'English' : 'Filipino'}
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-lg text-purple-600">
                {isTagalog ? tagalogQuestionsByCategory[selectedCategory.name][currentQuestionIndex] : 
                  questionsByCategory[selectedCategory.name][currentQuestionIndex]}
              </h2>
            </div>
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded-lg mr-2"
                onClick={() => readQuestionAloud(isTagalog ? 
                  tagalogQuestionsByCategory[selectedCategory.name][currentQuestionIndex] : 
                  questionsByCategory[selectedCategory.name][currentQuestionIndex])}
              >
                Read Aloud
              </button>
              <button className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg mr-2" onClick={handlePrevQuestion}>
                Previous
              </button>
              <button className="bg-gray-300 text-gray-700 py-1 px-3 rounded-lg" onClick={handleNextQuestion}>
                Next
              </button>
            </div>
            <div className="mb-4">
              <h2 className="text-lg text-purple-600">Rate the response:</h2>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`bg-${ratings[currentQuestionIndex] === rating ? 'purple-800' : 'purple-600'} text-white py-1 px-3 rounded-lg mr-2`}
                    onClick={() => handleRatingClick(rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questionsByCategory[selectedCategory.name].length}
              </p>
            </div>
          </>
        )}

        {step === 5 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              Assessment Completed!
            </h2>
            <p className="text-gray-600 mb-6">Thank you for completing the assessment for {studentName}.</p>
            <p className="text-gray-600 mb-2">Your Progress: {progressPercentage()}%</p>
            <button
              className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 transition"
              onClick={handleRestart}
            >
              Restart Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialEducationTool;
