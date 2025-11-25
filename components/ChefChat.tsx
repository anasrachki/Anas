import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ChefHat, Loader2, MessageSquare } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { chatWithChef } from '../services/geminiService';

interface ChefChatProps {
  language: Language;
}

const ChefChat: React.FC<ChefChatProps> = ({ language }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: language === Language.ARABIC 
        ? 'أهلاً بك! أنا الشيف غيسيبيز. كيف يمكنني مساعدتك في المطبخ اليوم؟' 
        : 'Hello! I am Chef Ghisipies. How can I help you in the kitchen today?',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isArabic = language === Language.ARABIC;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset welcome message on language change if it's the only message
  useEffect(() => {
    if (messages.length === 1) {
       setMessages([{
        role: 'model',
        text: language === Language.ARABIC 
          ? 'أهلاً بك! أنا الشيف غيسيبيز. كيف يمكنني مساعدتك في المطبخ اليوم؟' 
          : 'Hello! I am Chef Ghisipies. How can I help you in the kitchen today?',
        timestamp: Date.now()
      }]);
    }
  }, [language]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithChef(history, userMessage.text, language);
      
      const modelMessage: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        text: isArabic ? 'عذراً، واجهت مشكلة في الاتصال. حاول مرة أخرى.' : 'Sorry, I encountered a connection issue. Please try again.', 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Chat Header */}
      <div className="bg-orange-600 p-4 flex items-center shadow-md z-10">
        <div className="bg-white/20 p-2 rounded-full mr-3">
          <ChefHat className="text-white h-6 w-6" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg font-sans">
            {isArabic ? 'الشيف غيسيبيز' : 'Chef Ghisipies'}
          </h3>
          <p className="text-orange-100 text-xs flex items-center">
            <span className="h-2 w-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
            {isArabic ? 'متصل الآن' : 'Online Now'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={idx} 
              className={`flex w-full ${isUser ? (isArabic ? 'justify-start' : 'justify-end') : (isArabic ? 'justify-end' : 'justify-start')}`}
              dir={isArabic ? 'rtl' : 'ltr'}
            >
               <div className={`flex max-w-[80%] ${isUser ? (isArabic ? 'flex-row' : 'flex-row-reverse') : (isArabic ? 'flex-row-reverse' : 'flex-row')}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${isUser ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-600 border border-gray-200'} ${isUser ? (isArabic ? 'ml-2' : 'ml-2') : (isArabic ? 'ml-2' : 'mr-2')}`}>
                  {isUser ? <User className="h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
                </div>
                
                <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className={`flex w-full ${isArabic ? 'justify-end' : 'justify-start'}`} dir={isArabic ? 'rtl' : 'ltr'}>
             <div className={`flex max-w-[80%] ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-white text-gray-600 border border-gray-200 flex items-center justify-center mt-1 ${isArabic ? 'ml-2' : 'mr-2'}`}>
                 <ChefHat className="h-5 w-5" />
               </div>
               <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isArabic ? 'اسأل الشيف عن أي شيء...' : 'Ask the chef anything...'}
            className={`flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all ${isArabic ? 'text-right' : 'text-left'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className={`h-5 w-5 ${isArabic ? 'transform rotate-180' : ''}`} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChefChat;