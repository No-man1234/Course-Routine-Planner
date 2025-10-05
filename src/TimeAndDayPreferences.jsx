import React, { useState } from 'react';

function TimeAndDayPreferences({ onContinue, onBack, timePreferences }) {
  const [preferredStartTime, setPreferredStartTime] = useState(
    timePreferences?.preferredStartTime || '08:30 am'
  );
  const [allowMonday, setAllowMonday] = useState(
    timePreferences?.allowMonday !== undefined ? timePreferences.allowMonday : true
  );

  const timeOptions = [
    '08:30 am', '09:51 am', '11:11 am', 
    '12:31 pm', '1:51 pm', '3:11 pm'
  ];

  const handleContinue = () => {
    onContinue({
      preferredStartTime,
      allowMonday
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Time & Day Preferences</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Set your preferred earliest class start time and day preferences.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
        >
          Generate My Routines
        </button>
      </div>

      <div className="space-y-8">
        {/* Preferred Start Time */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferred Earliest Class Start Time
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                No classes should start before this time:
              </label>
              <select
                value={preferredStartTime}
                onChange={(e) => setPreferredStartTime(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> The system will strictly enforce this time preference. 
                    Any routines with classes starting before {preferredStartTime} will not be shown.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monday Preference */}
        <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monday Preference
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="allow-monday"
                type="checkbox"
                checked={allowMonday}
                onChange={(e) => setAllowMonday(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700"
              />
              <label htmlFor="allow-monday" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I'm willing to take classes on Monday
              </label>
            </div>
            
            <div className={`border rounded-lg p-4 ${allowMonday ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${allowMonday ? 'text-green-400' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${allowMonday ? 'text-green-800' : 'text-yellow-800'}`}>
                    {allowMonday 
                      ? 'Monday classes will be included in your routine suggestions.'
                      : 'Monday classes will be excluded from your routine suggestions. This may limit your options.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Preferences Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Earliest class start time:</span>
              <span className="font-medium text-gray-900 dark:text-white">{preferredStartTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Monday classes:</span>
              <span className={`font-medium ${allowMonday ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {allowMonday ? 'Allowed' : 'Not allowed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeAndDayPreferences;
