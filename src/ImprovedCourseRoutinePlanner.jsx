import React, { useState } from 'react';
import PdfUploadAndParse from './PdfUploadAndParse_New';
import ImprovedCourseSelection from './ImprovedCourseSelection';
import FacultySelection from './FacultySelection';
import TimeAndDayPreferences from './TimeAndDayPreferences';
import EnhancedRoutineGenerator from './EnhancedRoutineGenerator';
import ThemeSwitcher from './ThemeSwitcher';

function ImprovedCourseRoutinePlanner({ darkMode, toggleDarkMode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [parsedCourses, setParsedCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [facultyPreferences, setFacultyPreferences] = useState({});
  const [timePreferences, setTimePreferences] = useState({});
  const [routineResults, setRoutineResults] = useState(null);

  const handleBackToLanding = () => {
    // Refresh the page to go back to landing
    window.location.reload();
  };

  const handlePdfParsed = (courses) => {
    console.log('handlePdfParsed called with courses:', courses.length);
    setParsedCourses(courses);
    setCurrentStep(2);
    console.log('Current step set to 2');
  };

  const handleCourseSelectionComplete = (courses) => {
    setSelectedCourses(courses);
    // Clear routine results when course selection changes
    setRoutineResults(null);
    setCurrentStep(3);
  };

  const handleFacultySelectionComplete = (preferences) => {
    // Only clear results if preferences actually changed
    const preferencesChanged = JSON.stringify(preferences) !== JSON.stringify(facultyPreferences);
    if (preferencesChanged) {
      setRoutineResults(null);
    }
    setFacultyPreferences(preferences);
    setCurrentStep(4);
  };

  const handleTimePreferencesComplete = (preferences) => {
    // Only clear results if preferences actually changed
    const preferencesChanged = JSON.stringify(preferences) !== JSON.stringify(timePreferences);
    if (preferencesChanged) {
      setRoutineResults(null);
    }
    setTimePreferences(preferences);
    setCurrentStep(5);
  };

  const handleRoutineGenerated = (results) => {
    setRoutineResults(results);
  };

  const resetToStep = (step) => {
    setCurrentStep(step);
    // Don't clear routine results when just navigating back to preferences
    // Only clear when actual changes are made
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <ThemeSwitcher darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Back to Landing Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleBackToLanding}
          className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Home</span>
        </button>
      </div>
      
      {/* Hero Section */}
      <div className="glass border-0 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent mb-3">
              Course Routine Planner
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create your perfect semester schedule with smart routine suggestions powered by AI
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 md:space-x-4">
            {[
              { step: 1, label: 'Upload PDF', icon: '📄' },
              { step: 2, label: 'Select Courses', icon: '📚' },
              { step: 3, label: 'Choose Faculty', icon: '👨‍🏫' },
              { step: 4, label: 'Set Preferences', icon: '⚙️' },
              { step: 5, label: 'Generate Routines', icon: '🎯' }
            ].map(({ step, label, icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 shadow-sm'
                  }`}
                >
                  {currentStep >= step ? (
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm md:text-base">{icon}</span>
                  )}
                </div>
                <div className="ml-2 hidden md:block">
                  <div className={`text-xs font-medium transition-colors duration-300 ${
                    currentStep >= step ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {label}
                  </div>
                </div>
                {step < 5 && (
                  <div className={`w-6 md:w-8 h-0.5 ml-2 md:ml-3 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card-elevated animate-scale-in">
          {currentStep === 1 && (
            <PdfUploadAndParse onParsed={handlePdfParsed} />
          )}

          {currentStep === 2 && (
            <ImprovedCourseSelection
              courses={parsedCourses}
              selectedCourses={selectedCourses}
              onContinue={handleCourseSelectionComplete}
              onBack={() => resetToStep(1)}
            />
          )}

          {currentStep === 3 && (
            <FacultySelection
              selectedCourses={selectedCourses}
              courses={parsedCourses}
              facultyPreferences={facultyPreferences}
              onContinue={handleFacultySelectionComplete}
              onBack={() => resetToStep(2)}
            />
          )}

          {currentStep === 4 && (
            <TimeAndDayPreferences
              timePreferences={timePreferences}
              onContinue={handleTimePreferencesComplete}
              onBack={() => resetToStep(3)}
            />
          )}

          {currentStep === 5 && (
            <EnhancedRoutineGenerator
              key={`${JSON.stringify(selectedCourses)}-${JSON.stringify(facultyPreferences)}-${JSON.stringify(timePreferences)}`}
              selectedCourses={selectedCourses}
              facultyPreferences={facultyPreferences}
              timePreferences={timePreferences}
              courses={parsedCourses}
              routineResults={routineResults}
              onRoutineGenerated={handleRoutineGenerated}
              onBack={() => resetToStep(4)}
            />
          )}
        </div>

        {/* Navigation for final step */}
        {currentStep === 5 && (
          <div className="mt-8 flex justify-center space-x-4 animate-fade-in">
            <button
              onClick={() => resetToStep(1)}
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImprovedCourseRoutinePlanner;
