import React, { useState } from 'react';
import { Wand2, Loader2, ChefHat, Utensils } from 'lucide-react';
import { Language, Recipe } from '../types';
import { generateRecipeFromIngredients, generateDishImage } from '../services/geminiService';
import RecipeCard from './RecipeCard';

interface RecipeGeneratorProps {
  language: Language;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ language }) => {
  const [ingredients, setIngredients] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isArabic = language === Language.ARABIC;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeImage(null);

    try {
      // 1. Generate Recipe Text
      const generatedRecipe = await generateRecipeFromIngredients(ingredients, preferences, language);
      setRecipe(generatedRecipe);

      // 2. Generate Image (Parallel or subsequent - let's do subsequent to ensure we have a good title)
      if (generatedRecipe.title) {
        const imageBase64 = await generateDishImage(generatedRecipe.title + " " + generatedRecipe.description);
        setRecipeImage(imageBase64);
      }
    } catch (err) {
      setError(isArabic ? 'حدث خطأ أثناء إنشاء الوصفة. حاول مرة أخرى.' : 'Failed to generate recipe. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!recipe ? (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="bg-orange-600 p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
            <Utensils className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-2 font-sans">
              {isArabic ? 'ماذا يوجد في ثلاجتك؟' : 'What\'s in your fridge?'}
            </h2>
            <p className="opacity-90 max-w-lg mx-auto">
              {isArabic 
                ? 'أدخل المكونات المتوفرة لديك، وسيقوم الشيف غيسيبيز بابتكار وجبة لذيذة لك.' 
                : 'Enter the ingredients you have, and Chef Ghisipies will invent a delicious meal for you.'}
            </p>
          </div>

          <form onSubmit={handleGenerate} className="p-6 md:p-8 space-y-6">
            <div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
              <label className="block text-sm font-semibold text-gray-700">
                {isArabic ? 'المكونات (مفصولة بفاصلة)' : 'Ingredients (separated by commas)'}
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={isArabic ? 'مثال: دجاج، أرز، طماطم، بصل...' : 'e.g., Chicken, Rice, Tomatoes, Onions...'}
                className={`w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all h-32 resize-none bg-gray-50 ${isArabic ? 'text-right' : 'text-left'}`}
                required
              />
            </div>

            <div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
              <label className="block text-sm font-semibold text-gray-700">
                {isArabic ? 'تفضيلات إضافية (اختياري)' : 'Additional Preferences (Optional)'}
              </label>
              <input
                type="text"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder={isArabic ? 'مثال: نباتي، حار، تحت 30 دقيقة...' : 'e.g., Vegetarian, Spicy, Under 30 mins...'}
                className={`w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-gray-50 ${isArabic ? 'text-right' : 'text-left'}`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !ingredients.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-orange-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>{isArabic ? 'جاري التحضير...' : 'Cooking up magic...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  <span>{isArabic ? 'ابتكار وصفة' : 'Invent Recipe'}</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="animate-fade-in">
          <button
            onClick={() => setRecipe(null)}
            className="mb-6 flex items-center text-gray-600 hover:text-orange-600 transition-colors"
          >
            ← {isArabic ? 'إنشاء وصفة أخرى' : 'Generate Another'}
          </button>
          <RecipeCard recipe={recipe} image={recipeImage} language={language} />
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;