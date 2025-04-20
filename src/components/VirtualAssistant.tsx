import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext'; // Adjust path if needed
import { Button } from './ui/button'; // Adjust path if needed
import { BotIcon, X, Send, MessageSquare, ThumbsUp, ThumbsDown, Smile, Meh, Frown } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


interface Message {
  id: number;
  content: string;
  sender: 'assistant' | 'user';
  feedback?: 'positive' | 'negative';
  quickReplies?: string[];
}

type AssistantMood = 'idle' | 'greeting' | 'thinking' | 'answering' | 'confused' | 'listening' | 'happy';


const VirtualAssistant: React.FC = () => {
  const {
    assistantOpen,
    toggleAssistant,
    userName,
    setUserName,
    timeOfDay,
    visitorCount,
    activePage
  } = usePortfolio();

  const navigate = useNavigate(); // Hook for navigation
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<AssistantMood>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  useEffect(() => {
    if (assistantOpen) {
      setMood('greeting');
      setIsTyping(true);
      const timer = setTimeout(() => {
        let greeting = '';
        const baseGreeting = `Good ${timeOfDay}! I'm Diya's portfolio assistant.`;

        if (userName) {
          greeting = `Welcome back, ${userName}! 👋 ${baseGreeting} Currently on the ${activePage} page. How can I assist you?`;
        } else {
          greeting = `Hello there! 👋 ${baseGreeting} It's nice to meet you. What's your name?`;
        }

        addAssistantMessage(greeting, ['About Diya', 'Projects', 'Contact']);
        setMood('listening');
        setIsTyping(false);
        inputRef.current?.focus(); // Focus input when chat opens
      }, 1200);

      return () => clearTimeout(timer);
    } else {
       setMessages([]); // Clear messages when closed
       setMood('idle');
    }
  }, [assistantOpen, userName, timeOfDay, activePage]); // Added activePage dependency


 const addAssistantMessage = (content: string, quickReplies?: string[]) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), content, sender: 'assistant', quickReplies }
    ]);
  };

  const addUserMessage = (content: string) => {
     setMessages(prev => [
       ...prev,
       { id: Date.now(), content, sender: 'user' }
     ]);
  };


  // Enhanced response generation using resume data
  const generateResponse = useCallback((userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let response = '';
    let quickReplies: string[] | undefined;
    let navigationTarget: string | null = null;


    // 1. Handle Name Input
    if (messages.length === 1 && !userName && messages[0].content.includes("What's your name?")) {
        const name = userInput.trim();
        setUserName(name);
        response = `Nice to meet you, ${name}! 😊 I'm here to guide you. Feel free to ask about Diya's projects[cite: 13, 14, 15, 17, 18], skills[cite: 3], experience[cite: 4, 9], or education[cite: 2]. What interests you most?`;
        setMood('happy');
        quickReplies = ['Projects', 'Skills', 'Experience'];
    }
    // 2. Specific Keywords from Resume & General Topics
    else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('portfolio')) {
        response = `Diya has worked on several exciting projects:
        \n* **Angry Birds Clone** (Java/LibGDX): A 2D physics game[cite: 13].
        \n* **ResQpet** (Flutter/Firebase): Mobile app for reporting stray animals, with NGO dispatch[cite: 15, 16].
        \n* **TempStat** (C): Analyzed over 50 million weather records efficiently[cite: 18, 19].
        \n* **KUSH** (C/Linux): An interactive shell simulating bash/zsh[cite: 14].
        \n* **Directory Management System** (C): CLI tool for file/folder operations[cite: 17].
        \nWould you like to visit the Projects page or know more about a specific one?`;
        quickReplies = ['Go to Projects', 'Tell me about ResQpet', 'Tell me about KUSH'];
        if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/projects';
    }
    else if (lowerInput.includes('resqpet')) {
        response = "ResQpet is a mobile app built with Flutter and Firebase[cite: 15]. It allows users to report stray animals by capturing images, location, and condition details[cite: 16]. It features a smart dispatch algorithm to notify verified NGOs and provides real-time status updates[cite: 15, 16]. There's also a knowledge base section[cite: 17]. Want to see it on the Projects page?";
        quickReplies = ['Go to Projects'];
        navigationTarget = '/projects';
    }
     else if (lowerInput.includes('angry birds')) {
        response = "Diya developed a 2D physics simulation game inspired by Angry Birds using Java and LibGDX[cite: 13]. It features projectile motion and collision detection, with a focus on object-oriented design for modularity[cite: 13].";
        quickReplies = ['Go to Projects', 'Skills'];
    }
     else if (lowerInput.includes('kush') || lowerInput.includes('shell')) {
        response = "KUSH is an interactive shell implemented in C for Linux[cite: 14]. It simulates functionalities of bash/zsh, supporting standard shell commands, piping, redirection, user-defined commands, and comprehensive signal/error handling[cite: 14].";
        quickReplies = ['Go to Projects', 'Skills'];
    }
    else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('language') || lowerInput.includes('framework')) {
        response = `Diya has a strong technical foundation. Key areas include:
        \n* **Languages:** C++, C, Python, Java, JavaScript, HTML/CSS, SQL, Dart, Elixir[cite: 3].
        \n* **Frameworks/Tech:** React, Flutter, Django, Phoenix, Linux, Git, Docker, Firebase, MongoDB, MySQL, AR Kit[cite: 3].
        \n* **Core Skills:** Data Structures & Algorithms, OOP, Web Development, DB Management, OS, HCI[cite: 3].
        \nAnything specific you'd like to know more about?`;
        quickReplies = ['Web Development', 'Mobile (Flutter)', 'Data Structures'];
    }
    else if (lowerInput.includes('experience') || lowerInput.includes('internship') || lowerInput.includes('cris') || lowerInput.includes('barkedo')) {
       response = `Diya has valuable internship experience:
       \n* **CRIS (Software Engineer Intern):** Built a Django web platform for team performance tracking & project management for a 40-person team[cite: 4], implemented role-based access[cite: 5], designed the database schema[cite: 6], and improved task assignment accuracy by 30%[cite: 8].
       \n* **Barkedo (Graphic Design Intern):** Designed marketing collateral using Figma[cite: 10], optimized design workflows[cite: 11], and boosted online engagement by 20%[cite: 12].
       \nWould you like more details on either?`;
       quickReplies = ['More on CRIS', 'More on Barkedo', 'Skills'];
    }
     else if (lowerInput.includes('cris')) {
       response = `At CRIS (Centre for Railway Information Systems), Diya worked as a Software Engineer Intern from Dec 2023 to Jan 2024[cite: 4]. She developed a Django web platform to track team performance and manage projects, streamlining workflow for a 40-person team[cite: 4]. Key contributions included role-based access control[cite: 5], efficient database design[cite: 6], and collaboration with field operators[cite: 7], leading to a 30% improvement in task assignment accuracy[cite: 8].`;
       quickReplies = ['Barkedo Internship', 'Projects'];
    }
     else if (lowerInput.includes('barkedo')) {
       response = `During her Graphic Design Internship at Barkedo (May-Jul 2024)[cite: 9], Diya focused on enhancing brand visibility. She designed marketing materials using Figma[cite: 10], followed style guides, and optimized design workflows with version control, contributing to a 20% increase in online engagement[cite: 11, 12].`;
       quickReplies = ['CRIS Internship', 'Skills'];
    }
    else if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('iiitd')) {
        response = `Diya is currently pursuing a B.Tech in Computer Science and Design at IIIT Delhi (IIITD), starting in 2023[cite: 2]. Before that, she completed Class XII from Adarsh Jain Dharmic Shiksha Sadan with 93.6% [cite: 2] and Class X from Kothari International School with 96%[cite: 2]. She was also a WISE Scholar (Top 10) at IIITD[cite: 21].`;
        quickReplies = ['Skills', 'Projects', 'Experience'];
    }
     else if (lowerInput.includes('wise scholar')) {
        response = "Diya was selected for the elite Women in Software Engineering (WISE) program at IIITD, ranking in the Top 10[cite: 21]. As part of WISE, she contributed to open-source projects and participated in advanced engineering workshops[cite: 21].";
        quickReplies = ['Education', 'Skills'];
     }
    else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email') || lowerInput.includes('linkedin') || lowerInput.includes('github')) {
        response = `You can connect with Diya via:
        \n* **Email:** [diyanarula41@gmail.com](mailto:diyanarula41@gmail.com) [cite: 1]
        \n* **LinkedIn:** (You'd typically link Diya's actual LinkedIn profile here) [cite: 1]
        \n* **GitHub:** (Link Diya's GitHub profile here) [cite: 1]
        \n The Contact page also has this information.`;
        quickReplies = ['Go to Contact Page', 'Tell me about Projects'];
         if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/contact';
    }
    else if (lowerInput.includes('about diya') || lowerInput.includes('who is diya')) {
        response = `Diya Narula is a B.Tech student at IIIT Delhi specializing in Computer Science and Design[cite: 2]. She has expertise in programming (C++, Java, Python, JS etc. [cite: 3]), web/app development (React, Flutter, Django [cite: 3]), and design[cite: 3, 10]. She's completed internships at CRIS [cite: 4] and Barkedo [cite: 9] and worked on diverse projects like ResQpet [cite: 15] and KUSH[cite: 14]. She was also a WISE Scholar[cite: 21]. What aspect interests you most?`;
        quickReplies = ['Projects', 'Experience', 'Skills'];
    }
    else if (lowerInput.includes('ar') || lowerInput.includes('augmented reality')) {
        response = `This portfolio features Augmented Reality! Look for QR codes on project cards. Scanning them often reveals an immersive AR experience related to the project. Give it a try on the Projects page!`;
        quickReplies = ['Go to Projects'];
         if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/projects';
    }
     else if (lowerInput.includes('navigate') || lowerInput.includes('go to') || lowerInput.includes('show me')) {
        if (lowerInput.includes('home') || lowerInput.includes('index')) navigationTarget = '/';
        else if (lowerInput.includes('about')) navigationTarget = '/about';
        else if (lowerInput.includes('project')) navigationTarget = '/projects';
        else if (lowerInput.includes('contact')) navigationTarget = '/contact';

        if(navigationTarget) {
            response = `Okay, taking you to the ${navigationTarget === '/' ? 'Home' : navigationTarget.substring(1)} page!`;
        } else {
            response = `Where would you like to go? You can say "Go to Projects", "Show me About", etc.`;
            quickReplies = ['Home', 'About', 'Projects', 'Contact'];
        }
    }
     else if (lowerInput.match(/\b(hello|hi|hey|yo)\b/)) {
        response = `Hi ${userName || 'there'}! 👋 How can I help you navigate Diya's work today?`;
        setMood('greeting');
        quickReplies = ['Projects', 'Skills', 'Contact'];
    }
    else if (lowerInput.includes('thank')) {
        response = `You're very welcome! 😊 Let me know if anything else comes up.`;
        setMood('happy');
        quickReplies = ['Explore Projects', 'Ask another question'];
    }
     else if (lowerInput.includes('bye') || lowerInput.includes('later')) {
        response = `Alright, have a great time exploring! Feel free to open me again if you need help. 👋`;
        setMood('idle');
        setTimeout(toggleAssistant, 1500); // Close assistant after saying bye
    }
     else if (lowerInput.length < 4) { // Very short, possibly unclear input
         response = "Could you please provide a bit more detail? I'm here to help with information about Diya's portfolio.";
         setMood('confused');
         quickReplies = ['What can you do?', 'Projects', 'Skills'];
     }
     else if (lowerInput.includes('what can you do') || lowerInput.includes('help')) {
         response = `I can tell you about Diya's:
         \n* Projects (like ResQpet, KUSH) [cite: 13, 14, 15, 17, 18]
         \n* Skills (Programming, Web/App Dev) [cite: 3]
         \n* Internship Experience (CRIS, Barkedo) [cite: 4, 9]
         \n* Education (IIITD, WISE Scholar) [cite: 2, 21]
         \n* Contact Information [cite: 1]
         \n I can also help you navigate the site. Just ask!`;
         quickReplies = ['Projects', 'Skills', 'Experience', 'Navigate'];
     }
    // Default/Fallback
    else {
        response = `That's an interesting question! I'm specifically trained on Diya's portfolio information like projects[cite: 13, 14, 15, 17, 18], skills[cite: 3], and experience[cite: 4, 9]. Could you rephrase, or ask about one of those topics?`;
        setMood('confused');
        quickReplies = ['Projects', 'Skills', 'Experience', 'Contact'];
    }

    return { response, quickReplies, navigationTarget };

  }, [messages, userName, setUserName]); // Added dependencies


  const handleSend = (messageToSend?: string) => {
    const currentInput = (messageToSend || input).trim();
    if (!currentInput) return;

    addUserMessage(currentInput);
    if (!messageToSend) setInput(''); // Clear input only if it wasn't a quick reply
    setIsTyping(true);
    setMood('thinking');

    // Simulate thinking and generate response
    setTimeout(() => {
      const { response, quickReplies, navigationTarget } = generateResponse(currentInput);

      addAssistantMessage(response, quickReplies);
      setIsTyping(false);
      setMood('answering'); // Or set based on response type?

      // Navigate if requested
      if (navigationTarget) {
        setTimeout(() => navigate(navigationTarget), 500); // Slight delay for reading message
      }

       // Set mood back to listening after a delay
      setTimeout(() => setMood('listening'), 2000);


    }, 1500 + Math.random() * 500); // Add slight variability to response time
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Send on Enter, allow Shift+Enter for newline
      e.preventDefault(); // Prevent default newline behavior
      handleSend();
    }
  };

  const getAvatarSrc = () => {
      return '/assets/avatar.png'; 
  };


  return (
    <>
      {/* --- Toggle Button --- */}
      <motion.button
        className="fixed bottom-6 right-6 z-[1001] bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center w-14 h-14"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
        aria-label={assistantOpen ? "Close Assistant" : "Open Assistant"}
      >
        <AnimatePresence mode="wait">
          {assistantOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
             <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <MessageSquare size={28} />
             </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* --- Chat Window --- */}
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-[1000] w-[90vw] max-w-md bg-background rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            style={{ height: 'clamp(400px, 70vh, 600px)' }} // Responsive height
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <motion.img
                    key={mood} // Re-trigger animation on mood change
                    src={getAvatarSrc()}
                    alt="Assistant Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50 bg-white"
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                 />
                <div>
                    <h3 className="font-semibold text-base">Portfolio Assistant</h3>
                    <p className="text-xs opacity-80 capitalize">{mood}...</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10"
                onClick={toggleAssistant}
                aria-label="Close Chat"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-indigo-50/30 space-y-4 scroll-smooth">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm md:text-base break-words ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                    }`}
                  >
                    {/* Render message content with potential links */}
                     <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-300 underline hover:text-indigo-100">$1</a>') }} />

                  </div>
                   {/* Quick Replies */}
                    {message.sender === 'assistant' && message.quickReplies && (
                        <div className="flex gap-2 flex-wrap mt-2 justify-start">
                            {message.quickReplies.map((reply, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                className="text-xs md:text-sm h-7 px-2 bg-white/80 hover:bg-white border-indigo-200 text-indigo-700 hover:text-indigo-800"
                                onClick={() => handleSend(reply)}
                            >
                                {reply}
                            </Button>
                            ))}
                        </div>
                    )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="bg-white text-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200">
                    <div className="flex gap-1 items-center h-5">
                      <span className="animate-pulse bg-indigo-300 rounded-full w-2 h-2"></span>
                      <span className="animate-pulse bg-indigo-300 rounded-full w-2 h-2" style={{ animationDelay: '0.2s' }}></span>
                      <span className="animate-pulse bg-indigo-300 rounded-full w-2 h-2" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 p-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                  placeholder={isTyping ? "Assistant is typing..." : "Ask about projects, skills..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  aria-label="Chat input"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send Message"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>

             {/* Footer Info - Optional */}
             <div className="text-xs text-center p-1.5 text-gray-500 bg-gray-100/50 border-t border-gray-200/50 flex-shrink-0">
                {visitorCount > 1
                    ? `${visitorCount} people exploring`
                    : "Welcome to the portfolio!"}
                 {` | Currently on: ${activePage}`}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VirtualAssistant;