
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../hooks/useLanguage';
import { ThemeContext, ToastContext, LoggedInUser } from '../App'; // Assuming LoggedInUser might be needed later
import firebase from 'firebase/compat/app'; // If using Firebase for chat

// Heroicons
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);
const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-1.5a3 3 0 00-3.741 1.5M15 11.25a3 3 0 11-6 0 3 3 0 016 0zm-3 0c0 .662-.108 1.298-.304 1.898l-.062.28A8.967 8.967 0 017.5 12c0-.962.168-1.88.474-2.722L8.196 8.72A3 3 0 019 11.25zM6.083 15.872a11.955 11.955 0 01-1.65-.011A1.875 1.875 0 013 14.111V9.89a1.875 1.875 0 011.875-1.875h1.408a8.967 8.967 0 001.034-.386 3 3 0 013.958 0 8.967 8.967 0 001.033.386h1.409a1.875 1.875 0 011.875 1.875v4.221a1.875 1.875 0 01-1.433 1.747 11.956 11.956 0 01-1.65.011M18.25 11.25a3.375 3.375 0 00-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375V15a3.375 3.375 0 003.375 3.375h1.5a3.375 3.375 0 003.375-3.375V11.25z" /></svg>
);


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other'; // Or a user ID
  timestamp: Date;
  userName?: string; // Optional, for displaying names
}

const ChatView: React.FC = () => {
  const { t, language } = useLanguageContext();
  const { theme } = React.useContext(ThemeContext);
  const { addToast } = useContext(ToastContext);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: language === 'ar' ? 'يا جماعة الوردية الجاية مين اللي معاه مفتاح المخزن؟' : 'Guys, who has the warehouse key for the next shift?', sender: 'other', userName: 'Ahmed Iraqi', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: '2', text: language === 'ar' ? 'أنا معايا يا ريس أحمد، هسيبهولك مع الأمن قبل ما أمشي.' : 'I have it, Boss Ahmed. I\'ll leave it with security before I go.', sender: 'user', userName: 'You', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
    { id: '3', text: language === 'ar' ? 'تمام يا بطل، تسلم إيدك.' : 'Alright champ, thanks!', sender: 'other', userName: 'Ahmed Iraqi', timestamp: new Date(Date.now() - 1000 * 60 * 1) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user', // This would be the logged-in user
      userName: 'You', // Replace with actual user name
      timestamp: new Date(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
    addToast(t('chatMessageSent'), 'success');
    // Here you would typically send the message to a backend (e.g., Firebase Firestore)
  };
  
  const pageTitleColor = theme === 'dark' ? 'text-orange-400' : 'text-orange-500';
  const chatWindowBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const chatInputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const chatInputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const chatInputText = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const chatPlaceholder = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';
  const sendButtonBg = theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700';

  const userMessageBg = theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500';
  const userMessageText = theme === 'dark' ? 'text-blue-100' : 'text-white';
  const otherMessageBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const otherMessageText = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';


  return (
    <div className={`flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-150px)] ${language === 'ar' ? 'font-cairo' : 'font-poppins'}`}>
      <header className="mb-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${pageTitleColor}`}>
          {t('chatTitle')}
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('chatDescription')}
        </p>
      </header>

      <div className={`flex-1 flex flex-col rounded-xl shadow-xl overflow-hidden ${chatWindowBg}`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
            <UserGroupIcon className={`h-8 w-8 mr-3 rtl:ml-3 rtl:mr-0 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} />
            <div>
                <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {language === 'ar' ? 'شات الفريق العام' : 'General Team Chat'}
                </h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {language === 'ar' ? 'متصل الآن' : 'Online'}
                </p>
            </div>
        </div>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? (language === 'ar' ? 'justify-start' : 'justify-end') : (language === 'ar' ? 'justify-end' : 'justify-start')}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-xl shadow ${msg.sender === 'user' ? `${userMessageBg} ${userMessageText}` : `${otherMessageBg} ${otherMessageText}`}`}>
                <div className="flex items-center mb-1">
                    {msg.sender !== 'user' && <UserCircleIcon className={`h-5 w-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`} />}
                    <span className={`text-xs font-semibold ${msg.sender === 'user' ? (theme === 'dark' ? 'text-gray-300' : 'text-gray-100') : (theme === 'dark' ? 'text-orange-300' : 'text-orange-600')}`}>
                        {msg.userName}
                    </span>
                </div>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? (theme === 'dark' ? 'text-gray-400 text-opacity-70' : 'text-gray-200 text-opacity-70') : (theme === 'dark' ? 'text-gray-500' : 'text-gray-500')} ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={`p-4 border-t ${chatInputBorder} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا يا ريس...' : 'Type your message here, boss...'}
              className={`flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${chatInputBg} ${chatInputBorder} ${chatInputText} ${chatPlaceholder}`}
            />
            <button
              onClick={handleSendMessage}
              className={`p-3 rounded-lg text-white transition-colors shadow-md ${sendButtonBg}`}
              aria-label={language === 'ar' ? 'إرسال' : 'Send'}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
