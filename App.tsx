
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatTutor } from './components/ChatTutor';
import { VocabPractice } from './components/VocabPractice';
import { GrammarGuide } from './components/GrammarGuide';
import { GameCenter } from './components/GameCenter';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { View, Language, UserSettings } from './types';
import { Menu, LayoutDashboard, MessageCircle, BookOpen, GraduationCap, Settings, Gamepad2, Save, CheckCircle } from 'lucide-react';
import { translations, AppLanguage } from './translations';
import { supabase } from './services/supabase';

interface UserProfile extends UserSettings {
  full_name: string;
  xp: number;
  words_learned: number;
  streak: number;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en');
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);

  // Initial state with dummy "Seed" data for testing
  const [profile, setProfile] = useState<UserProfile>({
    full_name: 'Test Student',
    targetLanguage: Language.ENGLISH,
    nativeLanguage: Language.KHMER,
    proficiency: 'Beginner',
    xp: 125,
    words_learned: 12,
    streak: 3
  });

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data && !error) {
      setProfile({
        full_name: data.full_name || 'Student',
        targetLanguage: data.target_language as Language,
        nativeLanguage: data.native_language as Language,
        proficiency: data.proficiency as any,
        xp: data.xp || 0,
        words_learned: data.words_learned || 0,
        streak: data.streak || 0
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
        setIsLoggedIn(true);
      }
      setIsAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfileStats = async (updates: Partial<UserProfile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Allow local updates for testing if no user
      setProfile(prev => ({ ...prev, ...updates }));
      return;
    }

    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    const dbUpdates: any = {
      updated_at: new Date()
    };
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.words_learned !== undefined) dbUpdates.words_learned = updates.words_learned;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.targetLanguage !== undefined) dbUpdates.target_language = updates.targetLanguage;
    if (updates.nativeLanguage !== undefined) dbUpdates.native_language = updates.nativeLanguage;
    if (updates.proficiency !== undefined) dbUpdates.proficiency = updates.proficiency;

    await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    await updateProfileStats({
      targetLanguage: profile.targetLanguage,
      nativeLanguage: profile.nativeLanguage,
      proficiency: profile.proficiency
    });
    setIsSaving(false);
    setShowSaveFeedback(true);
    setTimeout(() => setShowSaveFeedback(false), 3000);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[appLanguage];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView(View.DASHBOARD);
    setAuthView('login');
  };

  const mobileNavItems = [
    { view: View.DASHBOARD, label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { view: View.CHAT, label: t('sidebar.chat'), icon: MessageCircle },
    { view: View.VOCAB, label: t('sidebar.vocab'), icon: BookOpen },
    { view: View.GAME, label: t('sidebar.game'), icon: Gamepad2 },
  ];

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard userSettings={profile} onNavigate={setCurrentView} userName={profile.full_name} t={t} />;
      case View.CHAT:
        return (
          <ChatTutor 
            userSettings={profile} 
            t={t} 
            onAddXP={(amount) => updateProfileStats({ xp: profile.xp + amount })} 
          />
        );
      case View.VOCAB:
        return (
          <VocabPractice 
            userSettings={profile} 
            t={t} 
            onAddWords={(count) => updateProfileStats({ words_learned: profile.words_learned + count })} 
          />
        );
      case View.GRAMMAR:
        return <GrammarGuide userSettings={profile} t={t} />;
      case View.GAME:
        return (
          <GameCenter 
            userSettings={profile} 
            t={t} 
            onGameFinish={(score) => updateProfileStats({ xp: profile.xp + (score * 10) })} 
          />
        );
      case View.SETTINGS:
        return (
            <div className="p-8 max-w-2xl mx-auto pb-32 md:pb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">{t('sidebar.settings')}</h2>
                  {showSaveFeedback && (
                    <div className="flex items-center text-emerald-600 font-medium text-sm animate-bounce">
                      <CheckCircle size={16} className="mr-1" /> Settings Saved!
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('tools.settings.targetLang')}</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={profile.targetLanguage}
                            onChange={(e) => setProfile({...profile, targetLanguage: e.target.value as Language})}
                        >
                            {Object.values(Language).map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('tools.settings.nativeLang')}</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={profile.nativeLanguage}
                            onChange={(e) => setProfile({...profile, nativeLanguage: e.target.value as Language})}
                        >
                            {Object.values(Language).map(lang => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">{t('tools.settings.proficiency')}</label>
                         <select 
                            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={profile.proficiency}
                            onChange={(e) => setProfile({...profile, proficiency: e.target.value as any})}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button 
                      onClick={saveSettings}
                      disabled={isSaving}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                      {t('common.save')}
                    </button>
                </div>
            </div>
        );
      default:
        return <Dashboard userSettings={profile} onNavigate={setCurrentView} userName={profile.full_name} t={t} />;
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (authView === 'login') {
      return (
        <LoginScreen 
          onNavigateToSignUp={() => setAuthView('signup')} 
          appLanguage={appLanguage}
          onToggleLanguage={() => setAppLanguage(prev => prev === 'en' ? 'km' : 'en')}
          t={t}
        />
      );
    } else {
      return (
        <SignUpScreen 
          onNavigateToLogin={() => setAuthView('login')} 
          appLanguage={appLanguage}
          onToggleLanguage={() => setAppLanguage(prev => prev === 'en' ? 'km' : 'en')}
          t={t}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 flex items-center px-4 justify-between border-b border-slate-800">
         <span className="text-white font-serif font-bold text-xl">{t('common.appTitle')}</span>
         <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentView(View.SETTINGS)} 
              className={`p-2 rounded-lg transition-colors ${currentView === View.SETTINGS ? 'text-indigo-400' : 'text-slate-400'}`}
            >
              <Settings size={20} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                <Menu />
            </button>
         </div>
      </div>

      <aside className="w-64 bg-slate-900 text-white flex-col h-full fixed left-0 top-0 shadow-xl z-10 hidden md:flex">
        <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          onLogout={handleLogout} 
          appLanguage={appLanguage}
          onToggleLanguage={() => setAppLanguage(prev => prev === 'en' ? 'km' : 'en')}
          t={t}
        />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 bottom-0 bg-slate-900 w-72 flex flex-col transform transition-transform duration-300">
                 <Sidebar 
                  currentView={currentView} 
                  onNavigate={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} 
                  onLogout={handleLogout} 
                  appLanguage={appLanguage}
                  onToggleLanguage={() => setAppLanguage(prev => prev === 'en' ? 'km' : 'en')}
                  t={t}
                />
            </div>
        </div>
      )}

      <main className={`flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen transition-all duration-300 ${appLanguage === 'km' ? 'font-light leading-relaxed' : ''}`}>
        <div className="pb-20 md:pb-0">
          {renderContent()}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 px-2 py-3 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {mobileNavItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center gap-1 min-w-[64px] transition-all duration-200 ${
                currentView === item.view ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${currentView === item.view ? 'bg-indigo-50' : 'bg-transparent'}`}>
                <item.icon size={22} className={currentView === item.view ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
              </div>
              <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
