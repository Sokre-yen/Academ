
import React from 'react';
import { View } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Flame, Target, ArrowRight, Gamepad2, Star, BookOpen, CheckCircle } from 'lucide-react';

interface UserProfileStats {
  targetLanguage: string;
  proficiency: string;
  xp: number;
  words_learned: number;
  streak: number;
}

interface DashboardProps {
  userSettings: UserProfileStats;
  onNavigate: (view: View) => void;
  userName: string;
  t: (path: string) => string;
}

const data = [
  { name: 'Mon', hours: 0.5 },
  { name: 'Tue', hours: 1.2 },
  { name: 'Wed', hours: 0.8 },
  { name: 'Thu', hours: 1.5 },
  { name: 'Fri', hours: 2.0 },
  { name: 'Sat', hours: 1.0 },
  { name: 'Sun', hours: 0.4 },
];

const achievements = [
  { id: 1, title: 'Early Bird', desc: 'Started a lesson before 8 AM', icon: <Star className="text-amber-500" size={16} /> },
  { id: 2, title: 'Word Smith', desc: 'Learned 10 words in one day', icon: <CheckCircle className="text-emerald-500" size={16} /> },
  { id: 3, title: 'Chatty Learner', desc: '5 messages with the AI Tutor', icon: <Trophy className="text-indigo-500" size={16} /> },
];

const recommendedLessons = [
  { id: 1, title: 'Common Greetings', progress: 100, status: 'Completed' },
  { id: 2, title: 'Ordering at a Café', progress: 45, status: 'In Progress' },
  { id: 3, title: 'Travel Essentials', progress: 0, status: 'Not Started' },
];

export const Dashboard: React.FC<DashboardProps> = ({ userSettings, onNavigate, userName, t }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('dashboard.welcome')}, {userName}!</h2>
          <p className="text-slate-500">{t('dashboard.learning')} {userSettings.targetLanguage} • {userSettings.proficiency}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-400">{t('dashboard.streak')}</p>
          <div className="flex items-center text-orange-500 font-bold text-2xl justify-end">
            <Flame className="mr-1 fill-orange-500" size={24} />
            {userSettings.streak} {t('dashboard.days')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('dashboard.stats.xp')}</p>
            <p className="text-2xl font-bold text-slate-900">{userSettings.xp.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('dashboard.stats.words')}</p>
            <p className="text-2xl font-bold text-slate-900">{userSettings.words_learned}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{t('dashboard.stats.goal')}</p>
            <p className="text-2xl font-bold text-slate-900">80%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('dashboard.weeklyActivity')}</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 border-t border-slate-100 pt-6">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recommended for You</h4>
             <div className="space-y-4">
               {recommendedLessons.map(lesson => (
                 <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${lesson.progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                         <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{lesson.title}</p>
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${lesson.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">{lesson.status}</span>
                       <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-xl font-bold mb-2">{t('dashboard.continueChat')}</h3>
              <p className="text-indigo-100 mb-4 text-sm">{t('dashboard.chatPrompt')}</p>
              <button 
                onClick={() => onNavigate(View.CHAT)}
                className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                {t('dashboard.chatNow')} <ArrowRight size={16} className="ml-2" />
              </button>
           </div>

           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Achievements</h3>
              <div className="space-y-4">
                 {achievements.map(a => (
                   <div key={a.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                         {a.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{a.title}</p>
                        <p className="text-[10px] text-slate-500">{a.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group cursor-pointer hover:border-indigo-300 transition-all" onClick={() => onNavigate(View.GAME)}>
              <div className="flex items-center space-x-3 mb-2 text-indigo-600">
                <Gamepad2 size={24} />
                <h3 className="text-lg font-bold text-slate-900">{t('dashboard.playGame')}</h3>
              </div>
              <p className="text-slate-500 text-sm mb-4">{t('dashboard.gameDesc')}</p>
              <div className="flex items-center text-indigo-600 font-bold text-sm">
                {t('tools.game.startBtn')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
