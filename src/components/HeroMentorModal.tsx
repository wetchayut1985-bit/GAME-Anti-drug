import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle, Bot, Loader2, PhoneCall } from 'lucide-react';
import { askHeroMentor } from '../utils/geminiMentor';
import { sound } from '../utils/audio';

interface HeroMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'mentor' | 'user';
  text: string;
  timestamp: string;
}

export const HeroMentorModal: React.FC<HeroMentorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: 'สวัสดีครับน้องฮีโร่! พี่ฮีโร่ที่ปรึกษาพร้อมช่วยเหลือและให้ความรู้เรื่องยาเสพติด ทักษะการปฏิเสธเพื่อน หรือวิธีคลายเครียด มีเรื่องอะไรอยากถามหรือปรึกษาพี่ ถามได้เลยนะครับ!',
      timestamp: 'ตอนนี้',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'บุหรี่ไฟฟ้ามีผลเสียยังไง',
    'วิธีปฏิเสธเพื่อนชวนลองยา',
    'เครียดเรื่องเรียนทำยังไงดี',
    'เบอร์สายด่วนขอความช่วยเหลือ',
    'ยาบ้าส่งผลต่อสมองยังไง',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || isLoading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askHeroMentor(textToSend);
      const mentorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: response,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: 'ขออภัยครับน้องฮีโร่ เกิดข้อขัดข้องชั่วคราว แต่จำไว้ว่าหากต้องการความช่วยเหลือด่วน สามารถโทรฟรีสายด่วนสุขภาพจิต 1323 หรือสายด่วนบำบัดยาเสพติด 1165 ได้ตลอดเวลานะครับ!',
        timestamp: 'ตอนนี้',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full h-[600px] max-h-[90vh] shadow-2xl border border-indigo-200 dark:border-indigo-900/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base leading-tight">
                พี่ฮีโร่ที่ปรึกษา (Drug-Free Advisor)
              </h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>คำปรึกษาต้านยาเสพติดและพลังบวก</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] text-slate-400 shrink-0 font-semibold">ถามด่วน:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-amber-300'
                }`}
              >
                {msg.sender === 'user' ? 'คุณ' : 'พี่'}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-500 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>พี่ฮีโร่กำลังพิมพ์คำตอบ...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="พิมพ์คำถามหรือปรึกษาพี่ฮีโร่..."
            className="flex-1 py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
