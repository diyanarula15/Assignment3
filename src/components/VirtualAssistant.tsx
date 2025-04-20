
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './ui/button';
import { BotIcon, X, Volume2, VolumeX, MessageSquare } from 'lucide-react';

interface Message {
  content: string;
  sender: 'assistant' | 'user';
}

const VirtualAssistant: React.FC = () => {
  const { assistantOpen, toggleAssistant, userName, setUserName, timeOfDay, visitorCount, activePage } = usePortfolio();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (assistantOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        let greeting = '';
        
        if (userName) {
          greeting = `Welcome back, ${userName}! 👋 Good ${timeOfDay}! How can I help you explore Diya's portfolio today?`;
        } else {
          greeting = `Hello there! 👋 Good ${timeOfDay}! I'm Diya's portfolio assistant. What's your name?`;
        }
        
        setMessages([{ content: greeting, sender: 'assistant' }]);
        setIsTyping(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [assistantOpen, userName, timeOfDay]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { content: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      
      if (messages.length === 1 && !userName && messages[0].sender === 'assistant' && messages[0].content.includes("What's your name?")) {
        setUserName(input);
        response = `Nice to meet you, ${input}! 😊 I'm here to guide you through Diya's portfolio. You can ask me about her projects, skills, or how to navigate the site!`;
      } 
      else if (input.toLowerCase().includes('project') || input.toLowerCase().includes('work')) {
        response = `Diya has worked on several exciting projects, including Angry Birds, ResQpet, TempStat, KUSH, and a Directory Management System. You can find them in the Projects section!`;
      }
      else if (input.toLowerCase().includes('skill') || input.toLowerCase().includes('tech')) {
        response = `Diya is skilled in multiple programming languages like C++, Java, Python, and JavaScript. Her expertise includes data structures, algorithms, web development, and mobile app development!`;
      }
      else if (input.toLowerCase().includes('contact') || input.toLowerCase().includes('reach')) {
        response = `You can contact Diya through LinkedIn, GitHub, or via email at diyanarula41@gmail.com!`;
      }
      else if (input.toLowerCase().includes('about')) {
        response = `Diya is a B.Tech student at IIITD with expertise in programming and design. She has worked on various projects and has interned at organizations like CRIS and Barkedo!`;
      }
      else if (input.toLowerCase().includes('hello') || input.toLowerCase().includes('hi') || input.toLowerCase().includes('hey')) {
        response = `Hi there! How can I help you explore the portfolio today?`;
      }
      else if (input.toLowerCase().includes('thank')) {
        response = `You're welcome! Feel free to ask if you need anything else!`;
      }
      else if (input.toLowerCase().includes('ar') || input.toLowerCase().includes('augmented reality')) {
        response = `Check out the AR features in the portfolio! You can scan the QR codes on project cards for an immersive experience!`;
      }
      else {
        response = `Thanks for your message! Feel free to explore the portfolio. You can check out Diya's projects, skills, or contact information using the navigation menu!`;
      }
      
      setMessages(prev => [...prev, { content: response, sender: 'assistant' }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
      >
        <AnimatePresence mode="wait">
          {assistantOpen ? (
            <X size={24} key="close" />
          ) : (
            <MessageSquare size={24} key="open" />
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-40 w-80 md:w-96 bg-background rounded-lg shadow-xl border border-border overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BotIcon size={20} />
                <h3 className="font-medium">Portfolio Assistant</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10"
                  onClick={toggleAssistant}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto flex flex-col gap-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                        : 'bg-gradient-to-r from-gray-100 to-indigo-100 text-gray-800 rounded-tl-none shadow-sm border border-indigo-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gradient-to-r from-gray-100 to-indigo-100 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%] border border-indigo-100 shadow-sm">
                    <div className="flex gap-1">
                      <span className="animate-pulse">●</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>●</span>
                      <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>●</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-2 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim()} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Send
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-center p-2 text-muted-foreground bg-gray-50">
              {visitorCount > 1 
                ? `You and others are exploring this portfolio` 
                : "You're currently exploring the portfolio"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VirtualAssistant;
