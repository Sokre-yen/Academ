
import React, { useState } from 'react';
import { ArrowRight, BookOpen, AlertCircle, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { AppLanguage } from '../translations';
import { supabase } from '../services/supabase';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  appLanguage: AppLanguage;
  onToggleLanguage: () => void;
  t: (path: string) => string;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigateToLogin, appLanguage, onToggleLanguage, t }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name.length < 3) {
      setError(appLanguage === 'km' ? 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ ៣ តួអក្សរ' : 'Full name must be at least 3 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) {
        setError(authError.message);
      } else {
        // Sign up successful
        setIsSuccess(true);
        
        // If Supabase is configured with "Confirm Email: OFF", data.session will exist
        // and App.tsx's onAuthStateChange will handle the redirect automatically.
        // If it's ON, we show a message telling them to check email.
        if (!data.session) {
           // Wait a bit then go to login if auto-login didn't trigger
           setTimeout(() => {
             onNavigateToLogin();
           }, 3000);
        }
      }
    } catch (err) {
      setError(t('auth.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            {appLanguage === 'km' ? 'ការចុះឈ្មោះជោគជ័យ!' : 'Account Created!'}
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {appLanguage === 'km' 
              ? 'គណនីរបស់អ្នកត្រូវបានបង្កើតរួចរាល់។ អ្នកអាចចូលប្រើប្រាស់បានឥឡូវនេះ។'
              : 'Your account has been created successfully. You are being redirected...'}
          </p>
          <div className="w-12 h-1 bg-indigo-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-indigo-600 animate-[loading_3s_ease-in-out_infinite]"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            100% { width: 100%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={onToggleLanguage}
        className="mb-8 flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all group"
      >
        <Globe size={16} className="text-slate-400 group-hover:text-indigo-600" />
        <span className="text-sm font-medium text-slate-600">
          {appLanguage === 'en' ? 'ភាសាខ្មែរ' : 'English'}
        </span>
      </button>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-3 shadow-lg">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{t('auth.signUpTitle')}</h1>
            <p className="text-slate-500">{t('auth.signUpSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.fullName')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="student@academ.app"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('auth.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>{t('auth.creatingAccount')}</span>
                </div>
              ) : (
                <>
                  <span>{t('auth.createAccountBtn')}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            {t('auth.hasAccount')} <button onClick={onNavigateToLogin} className="text-indigo-600 font-medium hover:underline">{t('auth.loginLink')}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
