import React, { useState, useEffect } from 'react';

function FacultySelection({ selectedCourses, courses, onContinue, onBack, facultyPreferences: initialFacultyPreferences }) {
  const [facultyPreferences, setFacultyPreferences] = useState(initialFacultyPreferences || {});
  const [currentCourse, setCurrentCourse] = useState('');
  const [facultySearchTerm, setFacultySearchTerm] = useState('');
  const [filteredFaculty, setFilteredFaculty] = useState([]);

  // Group courses by course code
  const coursesByCode = courses.reduce((acc, course) => {
    if (!acc[course.courseCode]) {
      acc[course.courseCode] = [];
    }
    acc[course.courseCode].push(course);
    return acc;
  }, {});

  // Get unique faculty for selected courses
  const getAllFaculty = () => {
    const facultySet = new Set();
    selectedCourses.forEach(courseCode => {
      const courseSections = coursesByCode[courseCode] || [];
      courseSections.forEach(section => {
        if (section.facultyName && section.facultyInitial) {
          facultySet.add(JSON.stringify({
            name: section.facultyName,
            initial: section.facultyInitial,
            courses: []
          }));
        }
      });
    });
    
    const facultyList = Array.from(facultySet).map(f => JSON.parse(f));
    
    // Add courses taught by each faculty
    facultyList.forEach(faculty => {
      selectedCourses.forEach(courseCode => {
        const courseSections = coursesByCode[courseCode] || [];
        const teachesThisCourse = courseSections.some(section => 
          section.facultyInitial === faculty.initial
        );
        if (teachesThisCourse) {
          faculty.courses.push(courseCode);
        }
      });
    });
    
    return facultyList;
  };

  const allFaculty = getAllFaculty();

  // Smart search for faculty
  const performFacultySearch = (term) => {
    if (!term.trim()) {
      setFilteredFaculty(allFaculty);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = allFaculty.filter(faculty => {
      const name = faculty.name.toLowerCase();
      const initial = faculty.initial.toLowerCase();
      
      // Exact match
      if (name.includes(searchLower) || initial.includes(searchLower)) {
        return true;
      }
      
      // First letters of name words
      const nameWords = name.split(' ');
      const firstLetters = nameWords.map(word => word.charAt(0)).join('').toLowerCase();
      if (firstLetters.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredFaculty(filtered);
  };

  useEffect(() => {
    performFacultySearch(facultySearchTerm);
  }, [facultySearchTerm]);

  useEffect(() => {
    setFilteredFaculty(allFaculty);
  }, [selectedCourses]);

  const handleFacultySelect = (faculty) => {
    if (!currentCourse) {
      alert('Please select a course first to assign this faculty.');
      return;
    }
    
    setFacultyPreferences(prev => ({
      ...prev,
      [currentCourse]: faculty
    }));
    
    setCurrentCourse('');
    setFacultySearchTerm('');
  };

  const removeFacultyPreference = (courseCode) => {
    setFacultyPreferences(prev => {
      const newPrefs = { ...prev };
      delete newPrefs[courseCode];
      return newPrefs;
    });
  };

  const handleContinue = () => {
    onContinue(facultyPreferences);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Preferred Faculty</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Choose your preferred faculty for each course (optional). This will help us prioritize routines.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue to Time & Day Preferences
        </button>
      </div>

      {/* Course Selection for Faculty Assignment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select a course to assign preferred faculty:
        </label>
        <select
          value={currentCourse}
          onChange={(e) => setCurrentCourse(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a course...</option>
          {selectedCourses.map(courseCode => {
            const course = coursesByCode[courseCode][0];
            return (
              <option key={courseCode} value={courseCode}>
                {courseCode} - {course.title}
              </option>
            );
          })}
        </select>
      </div>

      {/* Faculty Search */}
      {currentCourse && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search for faculty to assign to {currentCourse}:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search faculty by name or initials..."
              value={facultySearchTerm}
              onChange={(e) => setFacultySearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Faculty List */}
      {currentCourse && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Available Faculty for {currentCourse}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredFaculty
              .filter(faculty => faculty.courses.includes(currentCourse))
              .map(faculty => (
                <div
                  key={faculty.initial}
                  className="p-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  onClick={() => handleFacultySelect(faculty)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{faculty.name}</div>
                      <div className="text-sm text-gray-600">({faculty.initial})</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Teaches {faculty.courses.length} of your selected courses
                    </div>
                  </div>
                </div>
              ))}
          </div>
          
          {filteredFaculty.filter(faculty => faculty.courses.includes(currentCourse)).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {facultySearchTerm 
                ? `No faculty found matching "${facultySearchTerm}" for ${currentCourse}`
                : `No faculty available for ${currentCourse}`
              }
            </div>
          )}
        </div>
      )}

      {/* Selected Faculty Preferences */}
      {Object.keys(facultyPreferences).length > 0 && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Your Faculty Preferences
          </h3>
          <div className="space-y-2">
            {Object.entries(facultyPreferences).map(([courseCode, faculty]) => (
              <div key={courseCode} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{courseCode}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Preferred: {faculty.name} ({faculty.initial})
                  </div>
                </div>
                <button
                  onClick={() => removeFacultyPreference(courseCode)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Preferences Note */}
      {Object.keys(facultyPreferences).length === 0 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No faculty preferences set. You can continue without selecting any preferred faculty, 
            or select courses above to assign preferred faculty.
          </p>
        </div>
      )}
    </div>
  );
}

export default FacultySelection;
