
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { explainGrammar } from '../services/gemini';
import { Search, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GrammarGuideProps {
  userSettings: UserSettings;
  t: (path: string) => string;
}

export const GrammarGuide: React.FC<GrammarGuideProps> = ({ userSettings, t }) => {
  const [query, setQuery] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (forcedQuery?: string) => {
    const activeQuery = forcedQuery || query;
    if (!activeQuery.trim()) return;

    if (forcedQuery) setQuery(forcedQuery);
    setLoading(true);
    const result = await explainGrammar(userSettings.targetLanguage, userSettings.nativeLanguage, activeQuery);
    setContent(result);
    setLoading(false);
  };

  const popularTopics = [
    "Past Tense", "Definite Articles", "Personal Pronouns", "Verb Conjugation", "Subjunctive Mood", "Prepositions", "Sentence Structure"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('tools.grammar.title')}</h2>
        <p className="text-slate-500">{t('tools.grammar.subtitle').replace('{lang}', userSettings.targetLanguage)}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('tools.grammar.searchPlaceholder')}
          className="w-full p-4 pl-12 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg transition-all"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
        <button 
            type="submit" 
            disabled={loading || !query}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all"
        >
            {loading ? t('tools.grammar.searching') : t('tools.grammar.explainBtn')}
        </button>
      </form>

      {!content && !loading && (
        <div className="mt-8">
           <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t('tools.grammar.popularTopics')}</h3>
           </div>
           <div className="flex flex-wrap gap-2">
             {popularTopics.map(topic => (
               <button
                  key={topic}
                  onClick={() => handleSearch(topic)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm font-medium shadow-sm"
               >
                 {topic}
               </button>
             ))}
           </div>
           
           <div className="mt-12 text-center text-slate-400">
             <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
             <p>{t('tools.grammar.emptyState')}</p>
           </div>
        </div>
      )}

      {content && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in mb-20">
          <div className="prose prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-p:text-slate-600">
             <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <button 
            onClick={() => setContent('')}
            className="mt-8 text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            ← Back to topics
          </button>
        </div>
      )}
    </div>
  );
};
