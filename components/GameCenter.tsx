
import React, { useState, useEffect } from 'react';
import { UserSettings, GameQuestion } from '../types';
import { generateGameQuestions } from '../services/gemini';
import { Trophy, CheckCircle2, XCircle, ArrowRight, Gamepad2 } from 'lucide-react';

interface GameCenterProps {
  userSettings: UserSettings;
  t: (path: string) => string;
  onGameFinish?: (score: number) => void;
}

export const GameCenter: React.FC<GameCenterProps> = ({ userSettings, t, onGameFinish }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'playing' | 'finished'>('idle');

  const startGame = async () => {
    setGameState('loading');
    const newQuestions = await generateGameQuestions(
      userSettings.targetLanguage, 
      userSettings.nativeLanguage, 
      userSettings.proficiency
    );
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setGameState('playing');
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === questions[currentIndex].correctWord) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setGameState('finished');
      if (onGameFinish) onGameFinish(score + (selectedOption === questions[currentIndex].correctWord ? 1 : 0));
    }
  };

  if (gameState === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 transform rotate-6">
          <Gamepad2 size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{t('tools.game.title')}</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-sm md:text-base">{t('tools.game.subtitle')}</p>
        <button
          onClick={startGame}
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center gap-3"
        >
          {t('tools.game.startBtn')} <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Gamepad2 size={20} className="text-indigo-600" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-medium animate-pulse">{t('tools.game.loading')}</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('tools.game.gameOver')}</h2>
        <p className="text-lg text-slate-500 mb-8">
          {t('tools.game.scoreResult').replace('{score}', score.toString()).replace('{total}', questions.length.toString())}
        </p>
        <p className="text-indigo-600 font-bold mb-8 flex items-center gap-2">
          Earned {score * 10} XP!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={startGame}
            className="flex-1 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all"
          >
            {t('tools.game.playAgain')}
          </button>
          <button
            onClick={() => setGameState('idle')}
            className="flex-1 px-8 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            {t('tools.game.quit')}
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correctWord;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-4 md:mb-8 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 text-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center">
              <Gamepad2 size={18} />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('tools.game.title')}</p>
              <div className="flex gap-1 mt-0.5">
                 {questions.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 w-4 md:w-6 rounded-full transition-all ${
                        idx < currentIndex ? 'bg-indigo-600' : idx === currentIndex ? 'bg-indigo-400 animate-pulse' : 'bg-slate-200'
                      }`}
                    />
                 ))}
              </div>
           </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('common.score')}</p>
           <p className="text-base md:text-xl font-bold text-indigo-600">{score} / {questions.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-slide-up">
        <div className="p-5 md:p-10 text-center">
          <p className="text-[10px] md:text-xs font-bold text-indigo-500 mb-3 md:mb-6 uppercase tracking-widest bg-indigo-50 inline-block px-3 py-1 rounded-full">
             Question {currentIndex + 1}
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed mb-2">
             {currentQ.sentence}
          </h3>
          <p className="text-slate-400 italic text-sm md:text-base mb-6 md:mb-8">
            ({currentQ.translation})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isOptionCorrect = option === currentQ.correctWord;
              
              let buttonClass = "p-3.5 md:p-5 rounded-xl border-2 font-semibold text-sm md:text-lg transition-all text-left flex items-center justify-between group ";
              
              if (selectedOption === null) {
                buttonClass += "bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50";
              } else {
                if (isSelected) {
                  buttonClass += isOptionCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-red-50 border-red-500 text-red-700";
                } else if (isOptionCorrect) {
                  buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-60";
                } else {
                  buttonClass += "bg-white border-slate-100 text-slate-400 opacity-40";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={buttonClass}
                >
                  <span className="truncate pr-2">{option}</span>
                  {selectedOption !== null && isOptionCorrect && <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />}
                  {selectedOption !== null && isSelected && !isOptionCorrect && <XCircle size={18} className="text-red-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`mt-6 p-4 md:p-6 rounded-xl border transition-all animate-fade-in ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
               <div className="flex items-center gap-2 mb-2">
                 {isCorrect ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-600" />}
                 <h4 className={`font-bold text-base md:text-lg ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                   {isCorrect ? t('tools.game.correct') : t('tools.game.incorrect')}
                 </h4>
               </div>
               <p className={`text-xs md:text-sm ${isCorrect ? 'text-emerald-600' : 'text-red-600'} mb-4 text-left`}>
                 {currentQ.explanation}
               </p>
               <button
                 onClick={nextQuestion}
                 className="w-full py-3 md:py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-all flex items-center justify-center gap-2 text-sm md:text-base"
               >
                 {currentIndex < questions.length - 1 ? t('tools.game.nextQuestion') : t('tools.game.finishGame')}
                 <ArrowRight size={18} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
