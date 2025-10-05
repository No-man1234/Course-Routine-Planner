import React, { useState, useEffect } from 'react';

function ImprovedCourseSelection({ courses, onContinue, onBack, selectedCourses: initialSelectedCourses }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState(initialSelectedCourses || []);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Group courses by course code to avoid duplicates
  const coursesByCode = courses.reduce((acc, course) => {
    if (!acc[course.courseCode]) {
      acc[course.courseCode] = {
        ...course,
        sections: []
      };
    }
    acc[course.courseCode].sections.push(course);
    return acc;
  }, {});

  const uniqueCourses = Object.values(coursesByCode);

  // Smart search function
  const performSmartSearch = (term) => {
    if (!term.trim()) {
      setFilteredCourses(uniqueCourses);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = uniqueCourses.filter(course => {
      const code = course.courseCode.toLowerCase();
      const title = course.title.toLowerCase();
      
      // Exact match gets priority
      if (code.includes(searchLower) || title.includes(searchLower)) {
        return true;
      }
      
      // Smart abbreviation matching (e.g., "cn" for "Computer Networks")
      const words = title.split(' ');
      const abbreviation = words.map(word => word.charAt(0)).join('').toLowerCase();
      if (abbreviation.includes(searchLower)) {
        return true;
      }
      
      // Check if search term matches first letters of consecutive words
      const firstLetters = words.map(word => word.charAt(0).toLowerCase()).join('');
      if (firstLetters.includes(searchLower)) {
        return true;
      }
      
      return false;
    });
    
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    performSmartSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setFilteredCourses(uniqueCourses);
  }, [courses]);

  const handleCourseSelect = (courseCode) => {
    if (selectedCourses.includes(courseCode)) {
      setSelectedCourses(selectedCourses.filter(code => code !== courseCode));
    } else {
      setSelectedCourses([...selectedCourses, courseCode]);
    }
  };

  const handleContinue = () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course before continuing.');
      return;
    }
    onContinue(selectedCourses);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Your Courses</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Search and select the courses you want to include in your routine.
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
          disabled={selectedCourses.length === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedCourses.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Continue to Faculty Selection
        </button>
      </div>

      {/* Smart Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses (e.g., 'CSE 101', 'Computer Networks', or 'cn')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {filteredCourses.length === 0 
              ? `No courses found for "${searchTerm}"`
              : `Found ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} matching "${searchTerm}"`
            }
          </div>
        )}
      </div>

      {/* Selected Courses Summary */}
      {selectedCourses.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Selected Courses ({selectedCourses.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCourses.map(courseCode => {
              const course = coursesByCode[courseCode];
              return (
                <span
                  key={courseCode}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {courseCode}
                  <button
                    onClick={() => handleCourseSelect(courseCode)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="space-y-3 mb-6">
        {filteredCourses.map(course => (
          <div
            key={course.courseCode}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedCourses.includes(course.courseCode)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
            onClick={() => handleCourseSelect(course.courseCode)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedCourses.includes(course.courseCode)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {selectedCourses.includes(course.courseCode) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{course.courseCode}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{course.title}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {course.sections.length} section{course.sections.length !== 1 ? 's' : ''}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {course.credit} credit{course.credit !== '1' ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            No courses found matching "{searchTerm}"
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

export default ImprovedCourseSelection;
