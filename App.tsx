import React, { useState } from 'react';
import { ChefHat, MessageSquare } from 'lucide-react';
import Header from './components/Header';
import RecipeGenerator from './components/RecipeGenerator';
import ChefChat from './components/ChefChat';
import { AppView, Language } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.GENERATOR);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);

  const isArabic = language === Language.ARABIC;

  return (
    <div className={`min-h-screen bg-[#fff7ed] pb-20 font-sans ${isArabic ? 'font-arabic' : ''}`}>
      <Header language={language} setLanguage={setLanguage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-orange-100 inline-flex">
            <button
              onClick={() => setCurrentView(AppView.GENERATOR)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentView === AppView.GENERATOR
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChefHat className={`h-5 w-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              <span>{isArabic ? 'مبتكر الوصفات' : 'Recipe Creator'}</span>
            </button>
            <button
              onClick={() => setCurrentView(AppView.CHAT)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                currentView === AppView.CHAT
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className={`h-5 w-5 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              <span>{isArabic ? 'محادثة الشيف' : 'Chef Chat'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in-up">
          {currentView === AppView.GENERATOR ? (
            <RecipeGenerator language={language} />
          ) : (
            <ChefChat language={language} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-orange-100 py-4 text-center text-gray-500 text-sm">
        <p>
          Powered by <span className="font-bold text-orange-600">Gemini 2.5</span> • Ghisipies AI Kitchen
        </p>
      </footer>
    </div>
  );
}

export default App;