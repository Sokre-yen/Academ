
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { UserSettings, ChatMessage } from '../types';
import { createTutorChat } from '../services/gemini';
import { Chat, GenerateContentResponse } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface ChatTutorProps {
  userSettings: UserSettings;
  t: (path: string) => string;
  onAddXP?: (amount: number) => void;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({ userSettings, t, onAddXP }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = createTutorChat(userSettings.targetLanguage, userSettings.proficiency, userSettings.nativeLanguage);
    setChatSession(chat);
    setMessages([{
        id: Date.now().toString(),
        role: 'model',
        text: `Hello! I am ready to help you learn ${userSettings.targetLanguage}. How are you doing today?`,
        timestamp: new Date()
    }]);
  }, [userSettings.targetLanguage, userSettings.proficiency, userSettings.nativeLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const resultStream = await chatSession.sendMessageStream({ message: userMsg.text });
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
          id: botMsgId,
          role: 'model',
          text: '',
          timestamp: new Date()
      }]);

      let fullText = '';
      for await (const chunk of resultStream) {
          const chunkText = (chunk as GenerateContentResponse).text;
          if (chunkText) {
            fullText += chunkText;
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, text: fullText } : msg
                )
            );
          }
      }

      // Reward XP for active participation
      if (onAddXP) onAddXP(5);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mx-4 my-4 md:mx-8 md:my-8 max-w-5xl md:w-full lg:w-4/5 mx-auto">
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold">{t('tools.chat.header')}</h3>
            <p className="text-xs text-indigo-200">Practicing {userSettings.targetLanguage}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert">
                 {msg.role === 'user' ? (
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                 ) : (
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                 )}
              </div>
              <p className={`text-[10px] mt-1 text-right opacity-70 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-sm text-slate-500">{t('tools.chat.thinking')}</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 pb-12 bg-white border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('tools.chat.placeholder').replace('{lang}', userSettings.targetLanguage)}
            className="flex-1 p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
