
import React, { useState } from 'react';
import { ArrowRight, BookOpen, AlertCircle, Globe, Loader2, Mail, CheckCircle2 } from 'lucide-react';
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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Frontend validation for DB constraint
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
      } else if (data.user && !data.session) {
        // Sign up successful but email verification is required
        setIsSuccess(true);
      } else if (data.session) {
        // Logged in immediately (auto-confirm is on)
        // App.tsx listener will handle the redirect
      }
    } catch (err) {
      setError(t('auth.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (authError) setError(authError.message);
    } catch (err) {
      setError(t('auth.authFailed'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">
            {appLanguage === 'km' ? 'សូមពិនិត្យមើលអ៊ីមែលរបស់អ្នក' : 'Check your email'}
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {appLanguage === 'km' 
              ? `យើងបានផ្ញើតំណភ្ជាប់បញ្ជាក់ទៅកាន់ ${email}។ សូមពិនិត្យមើលប្រអប់សំបុត្ររបស់អ្នក ដើម្បីបញ្ចប់ការចុះឈ្មោះ។`
              : `We've sent a confirmation link to ${email}. Please check your inbox and click the link to finish setting up your account.`}
          </p>
          <button
            onClick={onNavigateToLogin}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            {t('auth.loginLink')}
          </button>
        </div>
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

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 size={20} className="animate-spin text-slate-400" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isGoogleLoading ? t('common.loading') : t('auth.googleBtn')}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-widest font-bold">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
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
                disabled={isLoading || isGoogleLoading}
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
