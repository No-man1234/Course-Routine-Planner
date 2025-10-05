import React from 'react';

function SuccessPopup({ coursesCount, onClose }) {
  console.log('SuccessPopup rendered with coursesCount:', coursesCount);
  
  const handleClose = () => {
    console.log('SuccessPopup button clicked');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-dark-700 animate-scale-in">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
          🎉 PDF Processed Successfully!
        </h2>
        
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Your course PDF has been analyzed and all course information has been extracted.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-green-800 dark:text-green-200 font-semibold">
              {coursesCount} courses found
            </span>
          </div>
        </div>
        
        <button
          onClick={handleClose}
          className="w-full btn-primary text-lg"
        >
          Continue to Course Selection
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
