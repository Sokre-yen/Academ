import React, { useState } from 'react';
import { ArrowRight, BookOpen, AlertCircle, Globe, Loader2, Info } from 'lucide-react';
import { AppLanguage } from '../translations';
import { supabase } from '../services/supabase';

interface LoginScreenProps {
  onNavigateToSignUp: () => void;
  appLanguage: AppLanguage;
  onToggleLanguage: () => void;
  t: (path: string) => string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToSignUp, appLanguage, onToggleLanguage, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsEmailUnconfirmed(false);
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          setIsEmailUnconfirmed(true);
        }
      }
    } catch (err) {
      setError(t('auth.authFailed'));
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{t('common.appTitle')}</h1>
            <p className="text-slate-500">{t('auth.loginTitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex flex-col gap-2 text-sm animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
                {isEmailUnconfirmed && (
                  <div className="mt-2 p-3 bg-white/50 border border-red-100 rounded-lg text-xs text-red-500 flex gap-2">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <p>
                      <strong>Tip:</strong> To allow login without verification, disable <strong>"Confirm email"</strong> in your Supabase Dashboard under Authentication &nbsp;&gt;&nbsp; Providers &nbsp;&gt;&nbsp; Email.
                    </p>
                  </div>
                )}
              </div>
            )}

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
                  <span>{t('auth.signingIn')}</span>
                </div>
              ) : (
                <>
                  <span>{t('auth.signInBtn')}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            {t('auth.noAccount')} <button onClick={onNavigateToSignUp} className="text-indigo-600 font-medium hover:underline">{t('auth.signUpLink')}</button>
          </p>
        </div>
      </div>
    </div>
  );
};