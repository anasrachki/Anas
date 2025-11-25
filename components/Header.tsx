import React from 'react';
import { ChefHat, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === Language.ENGLISH ? Language.ARABIC : Language.ENGLISH);
  };

  const isArabic = language === Language.ARABIC;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center h-16 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-3`}>
            <div className="bg-orange-100 p-2 rounded-full">
              <ChefHat className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">
                {isArabic ? 'غيسيبيز' : 'Ghisipies'}
              </h1>
              <p className="text-xs text-orange-600 font-medium">
                {isArabic ? 'مساعد المطبخ الذكي' : 'AI Culinary Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
          >
            <Globe className="h-5 w-5" />
            <span className="font-medium">{language === Language.ENGLISH ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;