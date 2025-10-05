import React, { useState } from 'react';

function LandingPage({ onGetStarted, darkMode, toggleDarkMode }) {
  const [showVisitorBadge, setShowVisitorBadge] = useState(true);

  const features = [
    {
      icon: '📁',
      title: 'PDF File Support',
      description: 'Upload your course schedule PDF files with ease'
    },
    {
      icon: '🌙',
      title: 'Dark Mode Toggle',
      description: 'Switch between light and dark themes'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Works perfectly on all devices'
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Smart routine generation with AI assistance'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find courses and faculty quickly'
    },
    {
      icon: '⚡',
      title: 'Fast Processing',
      description: 'Generate routines in seconds'
    }
  ];

  const quickLinks = [
    { icon: '🔝', text: 'Back to Top', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { icon: '📁', text: 'Source Code', link: 'https://github.com/your-username/course-routine-planner' },
    { icon: '❓', text: 'Help & Support', action: () => alert('Help section coming soon!') },
    { icon: 'ℹ️', text: 'About', action: () => alert('About section coming soon!') }
  ];

  const techStack = [
    { name: 'React', color: 'bg-blue-500' },
    { name: 'Tailwind CSS', color: 'bg-cyan-500' },
    { name: 'JavaScript', color: 'bg-yellow-500' },
    { name: 'PDF.js', color: 'bg-red-500' },
    { name: 'Vite', color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-fadeInUp">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 leading-tight">
                📅 Course Routine Planner
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Create personalized course schedules from PDF files with ease.
              </p>
              
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="mr-2 text-lg">🚀</span>
                Get Started
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -top-32 left-32 w-64 h-64 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            ✨ Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            🔗 Quick Links
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="group p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {link.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            🛠️ Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${tech.color} group-hover:animate-pulse`}></div>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Visitor Badge */}
          {showVisitorBadge && (
            <div className="flex justify-center mb-4">
              <img 
                src="https://api.visitorbadge.io/api/visitors?path=Course-Routine-Planner&label=Site%20Visits&countColor=%23263759"
                alt="Site Visits"
                className="animate-pulse h-5"
              />
            </div>
          )}
          
          <p className="text-gray-400 mb-3 text-sm">
            © 2025 Course Routine Planner. Made by <a href='https://www.github.com/No-man1234' className="text-blue-400 hover:underline">Abdullah Al Noman</a>
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>Last updated: July 2025</span>
            <span>|</span>
            <span>⚡ Powered by Vite + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
