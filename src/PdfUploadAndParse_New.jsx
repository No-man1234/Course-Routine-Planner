import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
import React, { useRef, useState } from 'react';
import parseCourseTable from './parseCourseTable';
import SuccessPopup from './SuccessPopup';

function PdfUploadAndParse({ onParsed }) {
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (file) => {
    console.log('File change event triggered');
    setError('');
    setParsedData([]);
    setLoading(true);
    
    console.log('Selected file:', file);
    
    if (!file) {
      console.log('No file selected');
      setLoading(false);
      return;
    }

    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      console.log('File type is not PDF:', file.type);
      setError('Please select a PDF file');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting PDF processing...');
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('Got array buffer, length:', arrayBuffer.byteLength);
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded successfully! Pages:', pdf.numPages);
      
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        text += pageText + ' ';
      }
      
      console.log('Extracted text length:', text.length);
      console.log('First 500 chars:', text.substring(0, 500));
      
      const courses = parseCourseTable(text);
      console.log('Parsed courses count:', courses.length);
      
      setParsedData(courses);
      setLoading(false);
      
      if (courses.length > 0) {
        setShowSuccessPopup(true);
      } else {
        setError('No courses found in the PDF. Please ensure the PDF contains course information.');
      }
      
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Error processing PDF file. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSuccessPopupClose = () => {
    console.log('Success popup close called');
    setShowSuccessPopup(false);
    onParsed(parsedData);
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Upload Course PDF
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload your university's course offering PDF to get started. Our AI will automatically extract all course information.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div>
              <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Drop your PDF here or click to browse
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Supports PDF files up to 10MB
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium"
            >
              Choose File
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Processing PDF...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {parsedData.length > 0 && !loading && !showSuccessPopup && (
          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-700 dark:text-green-300 font-medium">
                Successfully parsed {parsedData.length} courses!
              </span>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
            💡 Tips for best results:
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Make sure your PDF contains course schedules with times and faculty information</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>Text-based PDFs work better than scanned image PDFs</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>University course catalogs or timetables are ideal</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup
          coursesCount={parsedData.length}
          onClose={handleSuccessPopupClose}
        />
      )}
    </div>
  );
}

export default PdfUploadAndParse;
