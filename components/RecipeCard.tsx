import React from 'react';
import { Clock, Users, Flame, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { Recipe, Language } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  image: string | null;
  language: Language;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, image, language }) => {
  const isArabic = language === Language.ARABIC;
  const dir = isArabic ? 'rtl' : 'ltr';

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" dir={dir}>
      {/* Hero Image Section */}
      <div className="relative h-64 sm:h-80 w-full bg-gray-100 group overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-orange-50 text-orange-200">
            <ChefHat className="h-20 w-20 animate-pulse" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className={`absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className="inline-block px-3 py-1 bg-orange-500/90 rounded-full text-xs font-bold uppercase tracking-wide mb-2 backdrop-blur-sm">
            {recipe.cuisine} • {recipe.difficulty}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 shadow-sm">{recipe.title}</h2>
          <p className="text-gray-200 text-sm sm:text-base line-clamp-2 max-w-2xl">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Meta Data Grid */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-white">
        <div className="p-4 text-center">
          <div className="flex justify-center mb-1 text-orange-500">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? 'الوقت' : 'Time'}</div>
          <div className="font-semibold text-gray-800">{recipe.cookTime}</div>
        </div>
        <div className="p-4 text-center">
          <div className="flex justify-center mb-1 text-orange-500">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? 'الكمية' : 'Servings'}</div>
          <div className="font-semibold text-gray-800">{recipe.servings} {isArabic ? 'أشخاص' : 'ppl'}</div>
        </div>
        <div className="p-4 text-center">
          <div className="flex justify-center mb-1 text-orange-500">
            <Flame className="h-5 w-5" />
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">{isArabic ? 'السعرات' : 'Calories'}</div>
          <div className="font-semibold text-gray-800">{recipe.calories || 'N/A'}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-0">
        {/* Ingredients Sidebar */}
        <div className={`md:col-span-4 bg-orange-50/50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-orange-100 ${isArabic ? 'md:order-last md:border-l md:border-r-0' : ''}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <div className="bg-orange-100 p-1.5 rounded-lg mr-2 ml-2">
               <span className="text-xl">🥕</span>
            </div>
            {isArabic ? 'المكونات' : 'Ingredients'}
          </h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start text-gray-700 text-sm">
                <div className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0 ${isArabic ? 'ml-3' : 'mr-3'}`}></div>
                <span className="leading-relaxed">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Main Area */}
        <div className="md:col-span-8 p-6 sm:p-8 bg-white">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <div className="bg-orange-100 p-1.5 rounded-lg mr-2 ml-2">
              <span className="text-xl">👩‍🍳</span>
            </div>
            {isArabic ? 'طريقة التحضير' : 'Instructions'}
          </h3>
          <div className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="flex">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm ${isArabic ? 'ml-4' : 'mr-4'}`}>
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h4 className="text-blue-800 font-semibold mb-3 flex items-center text-sm uppercase tracking-wide">
                <AlertCircle className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? 'نصائح الشيف' : 'Chef\'s Tips'}
              </h4>
              <ul className="space-y-2">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start text-blue-700 text-sm">
                    <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 opacity-50 ${isArabic ? 'ml-2' : 'mr-2'}`} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;