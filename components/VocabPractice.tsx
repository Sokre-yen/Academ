
import React, { useState } from 'react';
import { UserSettings, Flashcard } from '../types';
import { generateVocabList, getSpeechAudio } from '../services/gemini';
import { RefreshCw, ArrowRight, RotateCw, Lightbulb, Volume2, Loader2, BookOpen, Sparkles } from 'lucide-react';

interface VocabPracticeProps {
  userSettings: UserSettings;
  t: (path: string) => string;
  onAddWords?: (count: number) => void;
}

// Audio helper functions
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const quickTopics = ["Travel", "Restaurant", "Business", "Hobbies", "Weather"];

export const VocabPractice: React.FC<VocabPracticeProps> = ({ userSettings, t, onAddWords }) => {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (forcedTopic?: string) => {
    const activeTopic = forcedTopic || topic;
    if (!activeTopic.trim()) return;
    
    if (forcedTopic) setTopic(forcedTopic);
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    
    const newCards = await generateVocabList(userSettings.targetLanguage, userSettings.nativeLanguage, activeTopic);
    setCards(newCards);
    setLoading(false);
    if (newCards.length > 0 && onAddWords) {
      onAddWords(newCards.length);
    }
  };

  const playAudio = async (text: string) => {
    if (audioLoading) return;
    setAudioLoading(true);
    try {
      const base64Audio = await getSpeechAudio(text);
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const bytes = decodeBase64(base64Audio);
        const buffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    } finally {
      setAudioLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">{t('tools.vocab.title')}</h2>
        <p className="text-slate-500">{t('tools.vocab.subtitle')}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('tools.vocab.topicLabel')}</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('tools.vocab.topicPlaceholder')}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !topic}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center shadow-lg hover:shadow-indigo-500/20"
          >
            {loading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <Sparkles className="mr-2" size={18} />}
            {loading ? t('tools.vocab.generating') : t('tools.vocab.generateBtn')}
          </button>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
           <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Try a Topic:</span>
           {quickTopics.map(q => (
             <button
                key={q}
                onClick={() => handleGenerate(q)}
                disabled={loading}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all whitespace-nowrap"
             >
               {q}
             </button>
           ))}
        </div>
      </div>

      {cards.length > 0 && (
        <div className="space-y-6">
          <div className="relative h-96 w-full perspective-1000 group">
            <div className={`relative w-full h-full duration-500 transform-style-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
              <div 
                className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-3xl shadow-xl flex flex-col items-center justify-center p-10 cursor-pointer overflow-hidden"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute top-6 left-6">
                  <span className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold px-3 py-1 bg-indigo-50 rounded-full">
                    {userSettings.targetLanguage}
                  </span>
                </div>
                <h3 className={`text-5xl md:text-6xl font-bold text-slate-800 mb-8 text-center transition-all ${audioLoading ? 'opacity-40 blur-[1px]' : ''}`}>
                  {cards[currentIndex].word}
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(cards[currentIndex].word);
                    }}
                    disabled={audioLoading}
                    className="p-5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center space-x-3 group/audio"
                  >
                    {audioLoading ? (
                      <Loader2 size={28} className="animate-spin" />
                    ) : (
                      <Volume2 size={28} />
                    )}
                    <span className="font-bold text-lg pr-1">{t('tools.vocab.listen')}</span>
                  </button>
                </div>
                <p className="absolute bottom-8 text-slate-400 text-sm flex items-center">
                  <RotateCw size={14} className="mr-2" /> {t('tools.vocab.clickToFlip')}
                </p>
              </div>
              <div 
                className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-3xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-10 text-white cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="text-center w-full max-w-lg space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">{t('tools.vocab.translation')}</span>
                    <h3 className="text-4xl md:text-5xl font-bold mt-2">{cards[currentIndex].translation}</h3>
                  </div>
                  <div className="w-24 h-1.5 bg-white/20 rounded-full mx-auto my-6"></div>
                  <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                    <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold flex items-center justify-center gap-2 mb-3">
                      <Lightbulb size={14} /> {t('tools.vocab.example')}
                    </span>
                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic">"{cards[currentIndex].example}"</p>
                  </div>
                </div>
                <p className="absolute bottom-8 text-indigo-200 text-sm flex items-center">
                  <RotateCw size={14} className="mr-2" /> {t('tools.vocab.clickToFlip')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-2">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl disabled:opacity-50 font-bold shadow-sm transition-all"
            >
              <span>{t('common.previous')}</span>
            </button>
            <div className="bg-slate-100 px-4 py-2 rounded-full text-slate-600 font-bold text-sm">
              {currentIndex + 1} / {cards.length}
            </div>
            <button
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-xl disabled:opacity-50 font-bold shadow-sm transition-all"
            >
              <span>{t('common.next')}</span>
            </button>
          </div>
        </div>
      )}

      {!loading && cards.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={40} className="text-slate-300" />
           </div>
           <h4 className="text-xl font-bold text-slate-800 mb-2">Ready to study?</h4>
           <p className="text-slate-500 max-w-xs mx-auto">{t('tools.vocab.emptyState')}</p>
        </div>
      )}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
