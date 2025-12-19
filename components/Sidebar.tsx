import React from 'react';
import { View } from '../types';
import { LayoutDashboard, MessageCircle, BookOpen, GraduationCap, Settings, LogOut, Globe, Gamepad2 } from 'lucide-react';
import { AppLanguage } from '../translations';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  appLanguage: AppLanguage;
  onToggleLanguage: () => void;
  t: (path: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, appLanguage, onToggleLanguage, t }) => {
  const navItems = [
    { view: View.DASHBOARD, label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { view: View.CHAT, label: t('sidebar.chat'), icon: MessageCircle },
    { view: View.VOCAB, label: t('sidebar.vocab'), icon: BookOpen },
    { view: View.GRAMMAR, label: t('sidebar.grammar'), icon: GraduationCap },
    { view: View.GAME, label: t('sidebar.game'), icon: Gamepad2 },
    { view: View.SETTINGS, label: t('sidebar.settings'), icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400 font-serif">{t('common.appTitle')}</h1>
        <p className="text-xs text-slate-400 mt-1">{t('sidebar.aiCompanion')}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              currentView === item.view
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-1">
        <button 
          onClick={onToggleLanguage}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
        >
          <div className="flex items-center space-x-3">
            <Globe size={20} className="group-hover:text-indigo-400" />
            <span>{t('sidebar.languageToggle')}</span>
          </div>
          <span className="text-[10px] font-bold bg-slate-700 px-2 py-1 rounded-md text-indigo-300">
            {appLanguage.toUpperCase()}
          </span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>{t('sidebar.signOut')}</span>
        </button>
      </div>
    </div>
  );
};