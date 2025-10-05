import React, { useState, useEffect } from 'react';

function EnhancedRoutineGenerator({ selectedCourses, facultyPreferences, timePreferences, courses, routineResults, onRoutineGenerated, onBack }) {
  const [preferredRoutines, setPreferredRoutines] = useState([]);
  const [alternativeRoutines, setAlternativeRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState(null);
  const [alternativesDisplayCount, setAlternativesDisplayCount] = useState(20);
  const [preferredDisplayCount, setPreferredDisplayCount] = useState(5);

  console.log('🔄 EnhancedRoutineGenerator mounted/remounted');

  // Initialize state from passed routineResults if available - only on first mount
  useEffect(() => {
    if (routineResults) {
      setPreferredRoutines(routineResults.preferred || []);
      setAlternativeRoutines(routineResults.alternative || []);
      setRejectionReasons(routineResults.rejectionReasons || null);
      setLoading(false);
    }
  }, []); // Empty dependency array - only run once on mount

  // Group courses by course code
  const coursesByCode = courses.reduce((acc, course) => {
    if (!acc[course.courseCode]) {
      acc[course.courseCode] = [];
    }
    acc[course.courseCode].push(course);
    return acc;
  }, {});

  // Parse time string to minutes for comparison
  const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    
    // Remove any extra spaces and normalize
    const cleanTime = timeStr.trim().toLowerCase();
    
    // Handle AM/PM format (e.g., "08:30 am", "1:51 pm", "04:30:PM", "08:30:AM")
    if (cleanTime.includes('am') || cleanTime.includes('pm')) {
      let timePart, ampm;
      
      // Handle both "04:30 PM" and "04:30:PM" formats
      if (cleanTime.includes(':pm') || cleanTime.includes(':am')) {
        // Format like "04:30:PM" or "08:30:AM" - split on the colon before am/pm
        const colonIndex = cleanTime.lastIndexOf(':');
        timePart = cleanTime.substring(0, colonIndex);
        ampm = cleanTime.substring(colonIndex + 1);
      } else {
        // Format like "04:30 PM" - split on space
        const parts = cleanTime.split(' ');
        timePart = parts[0];
        ampm = parts[1];
      }
      
      const timeParts = timePart.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      let adjustedHours = hours;
      
      if (ampm === 'pm' && hours !== 12) {
        adjustedHours += 12;
      } else if (ampm === 'am' && hours === 12) {
        adjustedHours = 0;
      }
      
      return adjustedHours * 60 + minutes;
    }
    
    // Handle 24-hour format (e.g., "08:30", "13:51")
    const time = cleanTime.split(' ')[0]; // Take only the start time
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    return hours * 60 + minutes;
  };

  // Check if time is before preferred start time
  const isBeforePreferredTime = (timeStr) => {
    if (!timeStr) return false;
    
    // Extract start time from time range (e.g., "08:30:AM - 11:00:AM" → "08:30:AM")
    let startTime = timeStr;
    if (timeStr.includes(' - ')) {
      startTime = timeStr.split(' - ')[0].trim();
    }
    
    const preferredTime = parseTime(timePreferences.preferredStartTime);
    const classTime = parseTime(startTime);
    
    return classTime < preferredTime;
  };

  // Check if section is on Monday and if Monday is allowed
  const isValidDayPreference = (section) => {
    // If Monday is allowed, all days are valid
    if (timePreferences.allowMonday) return true;
    
    // If Monday is not allowed, check if any class is on Monday
    const isValid = section.day1 !== 'Mon' && section.day2 !== 'Mon';
    
    return isValid;
  };

  // Check if two time slots conflict
  const hasTimeConflict = (time1, time2) => {
    if (!time1 || !time2) return false;
    
    const parseTimeRange = (timeStr) => {
      const parts = timeStr.split(' - ');
      if (parts.length !== 2) return null;
      return {
        start: parseTime(parts[0]),
        end: parseTime(parts[1])
      };
    };

    const range1 = parseTimeRange(time1);
    const range2 = parseTimeRange(time2);
    
    if (!range1 || !range2) return false;
    
    // Two time slots conflict if they overlap
    // They DON'T conflict if one ends exactly when the other starts or before
    return !(range1.end <= range2.start || range2.end <= range1.start);
  };

  // Check if a routine has time conflicts
  const hasConflicts = (routine) => {
    for (let i = 0; i < routine.length; i++) {
      for (let j = i + 1; j < routine.length; j++) {
        const section1 = routine[i];
        const section2 = routine[j];
        
        // Check all possible time conflicts
        if (section1.day1 === section2.day1 && hasTimeConflict(section1.time1, section2.time1)) return true;
        if (section1.day1 === section2.day2 && hasTimeConflict(section1.time1, section2.time2)) return true;
        if (section1.day2 === section2.day1 && hasTimeConflict(section1.time2, section2.time1)) return true;
        if (section1.day2 === section2.day2 && hasTimeConflict(section1.time2, section2.time2)) return true;
      }
    }
    return false;
  };

  // Generate all possible routines
  const generateRoutines = async () => {
    console.log('🔄 Starting routine generation...');
    
    // Clear previous results
    setPreferredRoutines([]);
    setAlternativeRoutines([]);
    setRejectionReasons(null);
    setLoading(true);
    
    try {
      // Check if we have the required data
      if (!selectedCourses || selectedCourses.length === 0) {
        console.warn('⚠️ No courses selected');
        setLoading(false);
        return;
      }
      
      if (!courses || courses.length === 0) {
        console.warn('⚠️ No courses data available');
        setLoading(false);
        return;
      }
      
      if (!timePreferences || !timePreferences.preferredStartTime) {
        console.warn('⚠️ No time preferences set');
        setLoading(false);
        return;
      }
      
      // Add a small delay to prevent blocking the UI
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Build sections for each selected course
      const courseSections = selectedCourses.map(courseCode => {
        const sectionsForCourse = courses.filter(course => course.courseCode === courseCode);
        return sectionsForCourse;
      });
      
      console.log('📊 Course sections array:', courseSections);
      
      // Check if any course has no sections
      const emptyCourses = courseSections.filter(sections => sections.length === 0);
      if (emptyCourses.length > 0) {
        console.error('❌ Some courses have no sections available');
        setPreferredRoutines([]);
        setAlternativeRoutines([]);
        setLoading(false);
        return;
      }
      
      const generateCombinations = (arrays, currentIndex = 0, currentCombo = []) => {
        if (currentIndex === arrays.length) {
          return [currentCombo];
        }
        
        const results = [];
        const currentArray = arrays[currentIndex];
        
        for (const item of currentArray) {
          const newCombo = [...currentCombo, item];
          results.push(...generateCombinations(arrays, currentIndex + 1, newCombo));
        }
        
        return results;
      };
      
      console.log('⚙️ Generating combinations...');
      const allCombinations = generateCombinations(courseSections);
      console.log('📈 Total combinations:', allCombinations.length);
      
      // Add another small delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Filter routines with progress tracking and early termination
      const validRoutines = [];
      const rejectionReasons = {
        timeConflicts: 0,
        beforePreferredTime: 0,
        mondayRestriction: 0,
        total: allCombinations.length
      };
      
      // Early termination: stop when we find enough preferred routines
      const maxPreferredRoutines = 10; // Increased to 10
      const maxAlternativeRoutines = 20;
      let preferredCount = 0;
      let alternativeCount = 0;
      
      for (let i = 0; i < allCombinations.length; i++) {
        const routine = allCombinations[i];
        
        // Check for time conflicts
        if (hasConflicts(routine)) {
          rejectionReasons.timeConflicts++;
          continue;
        }
        
        // Check time preferences (strict enforcement)
        let timeValid = true;
        for (const section of routine) {
          if (isBeforePreferredTime(section.time1) || isBeforePreferredTime(section.time2)) {
            timeValid = false;
            break;
          }
        }
        if (!timeValid) {
          rejectionReasons.beforePreferredTime++;
          continue;
        }
        
        // Check day preferences
        let dayValid = true;
        for (const section of routine) {
          if (!isValidDayPreference(section)) {
            dayValid = false;
            break;
          }
        }
        if (!dayValid) {
          rejectionReasons.mondayRestriction++;
          continue;
        }
        
        // Check if this routine has all preferred faculty
        let hasAllPreferredFaculty = true;
        for (const section of routine) {
          const preferredFaculty = facultyPreferences[section.courseCode];
          if (preferredFaculty?.name) {
            const isFacultyMatch = section.facultyName && 
                                 section.facultyName.toLowerCase().trim() === preferredFaculty.name.toLowerCase().trim();
            if (!isFacultyMatch) {
              hasAllPreferredFaculty = false;
              break;
            }
          }
        }
        
        validRoutines.push(routine);
        
        // Count preferred vs alternative routines
        if (hasAllPreferredFaculty) {
          preferredCount++;
        } else {
          alternativeCount++;
        }
        
        // Early termination: stop if we have enough preferred routines OR enough of both types
        if (preferredCount >= maxPreferredRoutines || 
            (preferredCount >= 5 && alternativeCount >= maxAlternativeRoutines)) {
          console.log(`🚀 Early termination: Found ${preferredCount} preferred and ${alternativeCount} alternative routines after checking ${i + 1}/${allCombinations.length} combinations`);
          break;
        }
        
        // Progress indicator for large datasets
        if (i > 0 && i % 1000 === 0) {
          console.log(`🔍 Processed ${i}/${allCombinations.length} combinations (${preferredCount} preferred, ${alternativeCount} alternatives)`);
        }
      }
      
      console.log('📊 Rejection Analysis:', rejectionReasons);
      console.log('✅ Valid routines after filtering:', validRoutines.length);
      
      // Add another small delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Separate preferred and alternative routines
      const preferred = [];
      const alternatives = [];
      
      validRoutines.forEach(routine => {
        let hasAllPreferredFaculty = true;
        const warnings = [];
        
        routine.forEach(section => {
          const preferredFaculty = facultyPreferences[section.courseCode];
          
          // Handle both old format (just initial string) and new format (faculty object)
          let preferredName = null;
          let preferredInitial = null;
          
          if (preferredFaculty) {
            if (typeof preferredFaculty === 'string') {
              preferredInitial = preferredFaculty;
            } else if (preferredFaculty.name) {
              preferredName = preferredFaculty.name;
              preferredInitial = preferredFaculty.initial;
            }
          }
          
          // Compare using faculty names instead of initials
          let isFacultyMatch = false;
          
          if (preferredName) {
            isFacultyMatch = section.facultyName && 
                           section.facultyName.toLowerCase().trim() === preferredName.toLowerCase().trim();
          } else if (preferredInitial) {
            if (preferredInitial.toLowerCase().trim() === 'tba') {
              isFacultyMatch = false;
            } else {
              isFacultyMatch = section.facultyInitial && 
                             section.facultyInitial.toLowerCase().trim() !== 'tba' &&
                             section.facultyInitial.trim() === preferredInitial.trim();
            }
          }
          
          // Only check for mismatches if there's a preference set
          if (preferredName || preferredInitial) {
            if (!isFacultyMatch) {
              hasAllPreferredFaculty = false;
              const preferredDisplay = preferredName || preferredInitial;
              warnings.push(`${section.courseCode}: You preferred ${preferredDisplay} but got ${section.facultyName}`);
            }
          }
        });
        
        const routineWithWarnings = {
          sections: routine,
          warnings,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        if (hasAllPreferredFaculty) {
          preferred.push(routineWithWarnings);
        } else {
          alternatives.push(routineWithWarnings);
        }
      });
      
      console.log('🎯 Preferred routines:', preferred.length);
      console.log('⚠️ Alternative routines:', alternatives.length);
      
      // Sort alternatives from best to worst (fewer warnings = better)
      alternatives.sort((a, b) => {
        if (a.warnings.length !== b.warnings.length) {
          return a.warnings.length - b.warnings.length; // Fewer warnings first
        }
        // If same number of warnings, maintain original order
        return 0;
      });
      
      console.log('🔄 Sorted alternatives by number of warnings:', alternatives.map(alt => alt.warnings.length));
      
      setPreferredRoutines(preferred);
      setAlternativeRoutines(alternatives);
      setLoading(false);
      
      // Save detailed rejection reasons for UI display
      setRejectionReasons(rejectionReasons);
      
      // Save results to parent component for state persistence
      if (onRoutineGenerated) {
        onRoutineGenerated({
          preferred: preferred,
          alternative: alternatives,
          rejectionReasons: rejectionReasons
        });
      }
      
      console.log('🎉 Routine generation complete!');
      
    } catch (error) {
      console.error('❌ Error during routine generation:', error);
      setPreferredRoutines([]);
      setAlternativeRoutines([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always generate routines when dependencies change, regardless of cache
    // Clear any existing results first
    setPreferredRoutines([]);
    setAlternativeRoutines([]);
    setRejectionReasons(null);
    setAlternativesDisplayCount(20); // Reset display count when generating new routines
    setPreferredDisplayCount(5); // Reset preferred display count when generating new routines
    
    // Only generate if we have the required data
    if (selectedCourses && selectedCourses.length > 0 && 
        facultyPreferences && timePreferences && courses && courses.length > 0) {
      generateRoutines();
    }
  }, [selectedCourses, facultyPreferences, timePreferences]);

  const formatTime = (time) => {
    if (!time) return '';
    return time.replace(' - ', ' - ');
  };

  const RoutineCard = ({ routine, isAlternative = false }) => (
    <div className={`border rounded-lg p-4 ${isAlternative ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' : 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isAlternative ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {isAlternative ? 'Alternative Routine' : 'Preferred Routine'}
          </span>
        </div>
        {routine.warnings.length > 0 && (
          <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
            {routine.warnings.length} warning{routine.warnings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Warnings */}
      {routine.warnings.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Warnings:</div>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                {routine.warnings.map((warning, i) => (
                  <li key={i}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-center py-2 px-3 text-sm font-bold text-gray-700 dark:text-gray-300">Course</th>
              <th className="text-center py-2 px-3 text-sm font-bold text-gray-700 dark:text-gray-300">Section</th>
              <th className="text-center py-2 px-3 text-sm font-bold text-gray-700 dark:text-gray-300">Faculty</th>
              <th className="text-center py-2 px-3 text-sm font-bold text-gray-700 dark:text-gray-300">Schedule</th>
              <th className="text-center py-2 px-3 text-sm font-bold text-gray-700 dark:text-gray-300">Room</th>
            </tr>
          </thead>
          <tbody>
            {routine.sections.map((section, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2 px-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{section.courseCode}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{section.title}</div>
                </td>
                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">{section.section}</td>
                <td className="py-2 px-3">
                  <div className="text-sm text-gray-900 dark:text-white">{section.facultyName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">({section.facultyInitial})</div>
                </td>
                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                  <div>{section.day1} {formatTime(section.time1)}</div>
                  {section.day2 && section.time2 && (
                    <div>{section.day2} {formatTime(section.time2)}</div>
                  )}
                </td>
                <td className="py-2 px-3 text-sm text-gray-900 dark:text-white">
                  <div>{section.room1}</div>
                  {section.room2 && <div>{section.room2}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Generating your routines...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Routine Suggestions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Here are your personalized routine suggestions based on your preferences.
            </p>
          </div>
          <button
            onClick={() => {
              generateRoutines();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Preferred Routines */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Best Match Routines ({preferredRoutines.length > preferredDisplayCount ? `${preferredDisplayCount} of ${preferredRoutines.length}` : preferredRoutines.length})
        </h3>
        
        {preferredRoutines.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No routines found that match all your preferred faculty choices.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {preferredRoutines.slice(0, preferredDisplayCount).map((routine, index) => (
              <div key={routine.id}>
                <div className="text-sm text-gray-600 mb-2">Best Match #{index + 1}</div>
                <RoutineCard routine={routine} />
              </div>
            ))}
            
            {/* Load More Button for Preferred Routines */}
            {preferredRoutines.length > preferredDisplayCount && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setPreferredDisplayCount(prev => Math.min(prev + 5, preferredRoutines.length))}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Load More ({Math.min(5, preferredRoutines.length - preferredDisplayCount)} more)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alternative Routines */}
      {alternativeRoutines.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Alternative Routines ({alternativeRoutines.length > alternativesDisplayCount ? `${alternativesDisplayCount} of ${alternativeRoutines.length}` : alternativeRoutines.length})
            </h3>
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showAlternatives ? 'Hide Alternatives' : 'Show Alternatives'}
            </button>
          </div>
          
          {showAlternatives && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-medium text-yellow-800 mb-1">Alternative Routines Notice:</div>
                    <p className="text-sm text-yellow-700">
                      These routines don't match all your preferred faculty choices, but are sorted from best to worst based on the number of faculty mismatches. 
                      Each routine will show specific warnings about faculty mismatches.
                      {alternativeRoutines.length > alternativesDisplayCount && (
                        <span className="block mt-1 font-medium">
                          Showing {alternativesDisplayCount} out of {alternativeRoutines.length} alternatives.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {alternativeRoutines.slice(0, alternativesDisplayCount).map((routine, index) => (
                <div key={routine.id}>
                  <div className="text-sm text-gray-600 mb-2">
                    Alternative #{index + 1} 
                    <span className="text-yellow-600 font-medium ml-2">
                      ({routine.warnings.length} mismatch{routine.warnings.length !== 1 ? 'es' : ''})
                    </span>
                  </div>
                  <RoutineCard routine={routine} isAlternative={true} />
                </div>
              ))}
              
              {/* Load More Button */}
              {alternativeRoutines.length > alternativesDisplayCount && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setAlternativesDisplayCount(prev => Math.min(prev + 10, alternativeRoutines.length))}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Load More ({Math.min(10, alternativeRoutines.length - alternativesDisplayCount)} more)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Routines Found */}
      {preferredRoutines.length === 0 && alternativeRoutines.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 font-medium mb-4 text-center">No Valid Routines Found</div>
          
          {rejectionReasons && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-3">Detailed Analysis:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total possible combinations:</span>
                    <span className="font-medium text-gray-900">{rejectionReasons.total}</span>
                  </div>
                  
                  {rejectionReasons.timeConflicts > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">❌ Rejected due to time conflicts:</span>
                      <span className="font-medium text-red-600">{rejectionReasons.timeConflicts}</span>
                    </div>
                  )}
                  
                  {rejectionReasons.beforePreferredTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">❌ Rejected due to early start times:</span>
                      <span className="font-medium text-red-600">{rejectionReasons.beforePreferredTime}</span>
                    </div>
                  )}
                  
                  {rejectionReasons.mondayRestriction > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">❌ Rejected due to Monday restriction:</span>
                      <span className="font-medium text-red-600">{rejectionReasons.mondayRestriction}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-3">💡 Suggestions to get routines:</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  {rejectionReasons.beforePreferredTime > 0 && (
                    <li>• Try selecting an earlier preferred start time (currently: {timePreferences.preferredStartTime})</li>
                  )}
                  {rejectionReasons.mondayRestriction > 0 && !timePreferences.allowMonday && (
                    <li>• Consider allowing Monday classes to get more options</li>
                  )}
                  {rejectionReasons.timeConflicts > 0 && (
                    <li>• Some selected courses may have unavoidable time conflicts</li>
                  )}
                  {rejectionReasons.total < 10 && (
                    <li>• Very few combinations possible - try selecting courses with more sections</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          {!rejectionReasons && (
            <div className="text-center">
              <p className="text-red-600 mb-4">
                No routines could be generated with your current preferences. Common reasons:
              </p>
              <ul className="text-sm text-red-600 space-y-1 max-w-md mx-auto text-left">
                <li>• Selected courses have unavoidable time conflicts</li>
                <li>• Your preferred start time is too restrictive</li>
                <li>• Monday restriction limits available options</li>
                <li>• Not enough sections available for selected courses</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Back Button */}
      {onBack && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change Preferences
          </button>
        </div>
      )}
    </div>
  );
}

export default EnhancedRoutineGenerator;
