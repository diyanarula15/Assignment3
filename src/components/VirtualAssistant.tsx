import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './ui/button'; // Adjust path if needed
const MotionButton = motion(Button); // <-- FIX: Wrap the custom Button component with motion()


import { BotIcon, X, Send, MessageSquare } from 'lucide-react'; // Removed unused icons
import { useNavigate } from 'react-router-dom';


interface Message {
  id: number;
  content: string; // This content will be pre-processed HTML
  rawContent: string; // Keep the original markdown/text content
  sender: 'assistant' | 'user';
  feedback?: 'positive' | 'negative';
  quickReplies?: string[];
}

type AssistantMood = 'idle' | 'greeting' | 'thinking' | 'answering' | 'confused' | 'listening' | 'happy';


// More robust (though still simple) Markdown to HTML parser
const markdownToHtml = (markdownText: string): string => {
  let htmlText = markdownText;

  // Process lines: identify lists and potential paragraph breaks
  const lines = htmlText.split('\n');
  let processedLines: string[] = [];
  let inList = false;

  lines.forEach(line => {
      const trimmedLine = line.trim();
      // Check for list item marker at the start of the trimmed line
      // Allow optional indentation before the marker
      const listItemMatch = line.match(/^(\s*)[*\-+]\s+(.*)$/);

      if (listItemMatch) {
          if (!inList) {
              processedLines.push('<ul data-markdown-list>'); // Use data-attribute for potential targeting
              inList = true;
          }
          const [, indentation, itemContent] = listItemMatch;
          processedLines.push(`<li>${itemContent.trim()}</li>`);
      } else {
          if (inList) {
              processedLines.push('</ul>');
              inList = false;
          }
           // Handle lines that are just whitespace or empty - treat as paragraph separators
           if (trimmedLine === '') {
               processedLines.push('<p data-markdown-empty-line></p>'); // Use a marker
           } else {
              processedLines.push(line); // Keep non-list, non-empty lines for later inline processing
           }
      }
  });

  if (inList) { // Close list if the text ended with one
      processedLines.push('</ul>');
  }

  // Join processed blocks/lines back into final HTML structure
  let finalHtmlParts: string[] = [];
  let currentParagraphLines: string[] = [];

  processedLines.forEach(block => {
      if (block === '<p data-markdown-empty-line></p>') {
           if (currentParagraphLines.length > 0) {
                finalHtmlParts.push(`<p>${currentParagraphLines.join('<br/>')}</p>`);
                currentParagraphLines = [];
           }
           finalHtmlParts.push('<br/>'); // Use a single br for spacing between paragraphs
      } else if (block.startsWith('<ul') || block === '</ul>' || block.startsWith('<li>')) {
           if (currentParagraphLines.length > 0) {
                finalHtmlParts.push(`<p>${currentParagraphLines.join('<br/>')}</p>`);
                currentParagraphLines = [];
           }
           finalHtmlParts.push(block); // Add list parts directly
      } else {
           currentParagraphLines.push(block); // These are lines within a paragraph block
      }
  });
   // Add any remaining paragraph lines at the end
   if (currentParagraphLines.length > 0) {
       finalHtmlParts.push(`<p>${currentParagraphLines.join('<br/>')}</p>`);
   }

  htmlText = finalHtmlParts.join('');


  // Inline processing: bold and links
  // Convert **bold** to <strong>bold</strong>
  htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Convert [link text](url) to <a href="url">link text</a>
   htmlText = htmlText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-300 underline hover:text-indigo-100">$1</a>');

   // Clean up any unintended breaks near list boundaries
   htmlText = htmlText.replace(/<br\/>\s*<ul data-markdown-list>/g, '<ul data-markdown-list>');
   htmlText = htmlText.replace(/<\/ul>\s*<br\/>/g, '</ul>');


  return htmlText;
};


const VirtualAssistant: React.FC = () => {
  const {
    assistantOpen,
    toggleAssistant,
    userName,
    setUserName,
    timeOfDay,
    // visitorCount, // Removed as it's not displayed in footer
    activePage
  } = usePortfolio();

  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState<AssistantMood>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

 // Define message adding functions inside the component
 // These functions are correctly scoped here.
 const addAssistantMessage = (content: string, quickReplies?: string[]) => {
     const processedContent = markdownToHtml(content);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), content: processedContent, rawContent: content, sender: 'assistant', quickReplies }
    ]);
  };

  const addUserMessage = (content: string) => {
     // No need to process user message content, display as plain text
     setMessages(prev => [
       ...prev,
       { id: Date.now(), content: content, rawContent: content, sender: 'user' }
     ]);
  };


  const scrollToBottom = () => {
    requestAnimationFrame(() => {
        setTimeout(() => {
             messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50); // Small delay to ensure DOM update
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);


  useEffect(() => {
    if (assistantOpen) {
      if (messages.length === 0) {
        setMood('greeting');
        setIsTyping(true);
        const timer = setTimeout(() => {
          let greeting = '';
          const baseGreeting = `I'm Diya's portfolio assistant.`;

          if (userName) {
            greeting = `Welcome back, **${userName}**! 👋 Good ${timeOfDay}. ${baseGreeting} You're currently on the **${activePage}** page. How can I assist you today?`;
            addAssistantMessage(greeting, ['About Diya', 'Projects', 'Contact']);
          } else {
            greeting = `Hello there! 👋 Good ${timeOfDay}. ${baseGreeting} It's nice to meet you. What's your name?`;
            addAssistantMessage(greeting, undefined); // Explicitly pass undefined for no quick replies
          }

          setMood('listening');
          setIsTyping(false);
          inputRef.current?.focus();
        }, 1200);

        return () => clearTimeout(timer);
      } else {
         inputRef.current?.focus();
         setMood(prevMood => prevMood === 'idle' ? 'listening' : prevMood);
      }
    } else {
       // setMessages([]); // Optional: Clear messages on close
       setMood('idle');
    }
    // Re-run effect if assistantOpen, userName, timeOfDay, or activePage changes
  }, [assistantOpen, userName, timeOfDay, activePage, messages.length, addAssistantMessage]); // Added addAssistantMessage as dep

  // Effect to focus input when typing finishes and chat is open
  useEffect(() => {
      if (!isTyping && assistantOpen) {
           inputRef.current?.focus();
      }
  }, [isTyping, assistantOpen]);


  // Enhanced response generation using resume data
  // Added addUserMessage and addAssistantMessage to dependencies as they are used within useCallback
  const generateResponse = useCallback((userInput: string) => {
    const lowerInput = userInput.toLowerCase().trim();
    let response = '';
    let quickReplies: string[] | undefined;
    let navigationTarget: string | null = null;
    let nextMood: AssistantMood = 'listening';

    // Find the *last* assistant message to check context (using findLast)
    // This requires tsconfig.json to have "lib" set to "es2023" or higher.
    const lastAssistantMessage = messages.findLast(msg => msg.sender === 'assistant');

    const expectingName = lastAssistantMessage && lastAssistantMessage.rawContent.includes("What's your name?") && !userName;

    // --- Conversation Logic ---

    if (expectingName) {
        const name = userInput.trim();
         if (name.length > 1 && name.length < 50 && !/\d/.test(name)) {
            setUserName(name);
            response = `Thanks, **${name}**! 😊 It's great to have you here. I can help you discover Diya's projects, skills, experience, or contact info. What are you curious about?`;
            nextMood = 'happy';
            quickReplies = ['Projects', 'Skills', 'Experience', 'What can you do?'];
        } else {
             response = `Hmm, that doesn't quite look like a typical name. Could you please tell me your name so I can address you properly?`;
             nextMood = 'confused';
             quickReplies = ['Skip naming'];
        }
    }
    else if (lowerInput.includes('skip naming')) {
         response = `Okay, no problem at all! You can explore Diya's portfolio anonymously. Just ask me about projects, skills, or anything else.`;
         setUserName(null);
         nextMood = 'listening';
         quickReplies = ['What can you do?', 'Projects', 'Skills'];
    }

    // --- Portfolio Queries ---
    else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('portfolio')) {
        response = `Diya has worked on several exciting projects:\n* **Angry Birds Clone** (Java/LibGDX): A 2D physics game.\n* **ResQpet** (Flutter/Firebase): Mobile app for reporting stray animals, with NGO dispatch.\n* **TempStat** (C): Analyzed over 5 million weather records efficiently.\n* **KUSH** (C/Linux): An interactive shell simulating bash/zsh.\n* **Directory Management System** (C): CLI tool for file/folder operations.\nWould you like to visit the Projects page or know more about a specific one?`;
        quickReplies = ['Go to Projects', 'Tell me about ResQpet', 'Tell me about KUSH'];
         if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/projects';
         nextMood = 'answering';
    }
    else if (lowerInput.includes('resqpet')) {
        response = "ResQpet is a mobile app built with **Flutter** and **Firebase**. It allows users to report stray animals by capturing images, location, and condition details. It features a smart dispatch algorithm to notify verified NGOs and provides real-time status updates. There's also a knowledge base section.\nWould you like to see it on the Projects page?";
        quickReplies = ['Go to Projects', 'Tell me about Angry Birds Clone'];
        navigationTarget = '/projects';
         nextMood = 'answering';
    }
     else if (lowerInput.includes('angry birds') || lowerInput.includes('libgdx')) {
        response = "Diya developed a 2D physics simulation game inspired by Angry Birds using **Java** and **LibGDX**. It features projectile motion and collision detection, with a focus on object-oriented design for modularity.\nYou can find it on the Projects page.";
        quickReplies = ['Go to Projects', 'Skills'];
        navigationTarget = '/projects';
         nextMood = 'answering';
    }
     else if (lowerInput.includes('kush') || lowerInput.includes('shell')) {
        response = "KUSH is an interactive shell implemented in **C** for **Linux**. It simulates functionalities of bash/zsh, supporting standard shell commands, piping, redirection, user-defined commands, and comprehensive signal/error handling.\nIt's listed on the Projects page.";
        quickReplies = ['Go to Projects', 'Skills', 'Tell me about TempStat'];
        navigationTarget = '/projects';
         nextMood = 'answering';
    }
     else if (lowerInput.includes('tempstat') || lowerInput.includes('weather')) {
        response = "TempStat is a project where Diya used **C** to efficiently analyze over 5 million weather records. It involved processing a large dataset to extract meaningful information.\nFind details on the Projects page.";
        quickReplies = ['Go to Projects', 'Skills', 'Tell me about KUSH'];
        navigationTarget = '/projects';
         nextMood = 'answering';
    }
     else if (lowerInput.includes('directory management')) {
        response = "Diya created a Command Line Interface (CLI) tool in **C** for managing files and folders. This Directory Management System project demonstrates her understanding of file system operations and C programming.";
        quickReplies = ['Go to Projects', 'Skills'];
         nextMood = 'answering';
     }
    else if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('language') || lowerInput.includes('framework') || lowerInput.includes('expertise')) {
        response = `Diya has a strong technical foundation. Key areas include:\n* **Languages:** C++, C, Python, Java, JavaScript, HTML/CSS, SQL, Dart, Elixir.\n* **Frameworks/Tech:** React, Flutter, Django, Phoenix, Linux, Git, Docker, Firebase, MongoDB, MySQL, AR Kit.\n* **Core Skills:** Data Structures & Algorithms, OOP, Web Development, DB Management, OS, HCI.\nAnything specific you'd like to know more about?`;
        quickReplies = ['Web Development', 'Mobile (Flutter)', 'Data Structures & Algorithms', 'Tell me about AR'];
         nextMood = 'answering';
    }
     else if (lowerInput.includes('web development') || lowerInput.includes('react') || lowerInput.includes('django')) {
        response = "Diya is proficient in web development using **React** for frontend and **Django** (Python) or **Phoenix** (Elixir) for backend, along with HTML/CSS and JavaScript. She understands full-stack development principles.";
        quickReplies = ['Tell me about Mobile Dev', 'Skills'];
         nextMood = 'answering';
     }
      else if (lowerInput.includes('mobile') || lowerInput.includes('flutter') || lowerInput.includes('dart')) {
        response = "Diya's mobile development skills are primarily with **Flutter** (**Dart**). She built the ResQpet app using Flutter and Firebase, demonstrating cross-platform development capabilities.";
        quickReplies = ['Tell me about Web Dev', 'Skills'];
         nextMood = 'answering';
     }
       else if (lowerInput.includes('data structure') || lowerInput.includes('algorithm') || lowerInput.includes('dsa')) {
        response = "Data Structures and Algorithms are core to Diya's programming foundation. She has a strong understanding of various data structures and efficient algorithmic approaches, which is crucial for problem-solving.";
        quickReplies = ['Skills', 'Projects'];
         nextMood = 'answering';
     }
    else if (lowerInput.includes('experience') || lowerInput.includes('internship') || lowerInput.includes('cris') || lowerInput.includes('barkedo')) {
       response = `Diya has valuable internship experience:\n* **CRIS (Software Engineer Intern):** Dec 2023 - Jan 2024. Focused on web platform development (Django).\n* **Barkedo (Graphic Design Intern):** May 2024 - Jul 2024. Focused on marketing collateral (Figma).\nWould you like more details on either?`;
       quickReplies = ['More on CRIS', 'More on Barkedo', 'Education'];
        nextMood = 'answering';
    }
     else if (lowerInput.includes('more on cris') || lowerInput.includes('cris internship')) {
       response = `At **CRIS (Centre for Railway Information Systems)**, Diya worked as a Software Engineer Intern (Dec 2023 - Jan 2024). She built a **Django** web platform for team performance tracking & project management for a 40-person team, implemented role-based access, designed the database schema, and improved task assignment accuracy by 30% through collaboration with field operators.`;
       quickReplies = ['More on Barkedo', 'Projects', 'Experience'];
        nextMood = 'answering';
    }
     else if (lowerInput.includes('more on barkedo') || lowerInput.includes('barkedo internship')) {
       response = `During her Graphic Design Internship at **Barkedo** (May - Jul 2024), Diya focused on enhancing brand visibility. She designed marketing materials using **Figma**, followed style guides, and optimized design workflows with version control, contributing to a 20% increase in online engagement. This highlights her design skills complementing her technical background.`;
       quickReplies = ['More on CRIS', 'Skills', 'Experience'];
        nextMood = 'answering';
    }
    else if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('college') || lowerInput.includes('iiitd') || lowerInput.includes('school')) {
        response = `Diya is currently pursuing a **B.Tech in Computer Science and Design** at **IIIT Delhi (IIITD)**, starting in 2023. Before that, she completed Class XII from Adarsh Jain Dharmic Shiksha Sadan with 93.6% and Class X from Kothari International School with 96%. She was also a **WISE Scholar** (Top 10) at IIITD.`;
        quickReplies = ['Tell me about WISE Scholar', 'Skills', 'Projects', 'Experience'];
         nextMood = 'answering';
    }
     else if (lowerInput.includes('wise scholar') || lowerInput.includes('women in software engineering')) {
        response = `Diya was selected for the elite **Women in Software Engineering (WISE)** program at IIITD, ranking in the Top 10. As part of WISE, she contributed to open-source projects and participated in advanced engineering workshops, focusing on building strong engineering fundamentals and contributing to the community.`;
        quickReplies = ['Education', 'Skills'];
         nextMood = 'answering';
     }
    else if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('email') || lowerInput.includes('linkedin') || lowerInput.includes('github')) {
        response = `You can connect with Diya via:\n* **Email:** [diyanarula41@gmail.com](mailto:diyanarula41@gmail.com)\n* **LinkedIn:** [linkedin.com/in/diya-narula-54087b2a5/](https://www.linkedin.com/in/diya-narula-54087b2a5/)\n* **GitHub:** [github.com/diyanarula15](https://github.com/diyanarula15)\nThe Contact page also has this information.`;
        quickReplies = ['Go to Contact Page', 'Tell me about Projects'];
         if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/contact';
          nextMood = 'answering';
    }
    else if (lowerInput.includes('about diya') || lowerInput.includes('who is diya') || lowerInput.includes('tell me about diya')) {
        response = `Diya Narula is a B.Tech student at **IIIT Delhi** specializing in **Computer Science and Design**. She has expertise in programming (**C++, Java, Python, JS** etc.), web/app development (**React, Flutter, Django**), and design. She's completed internships at **CRIS** and **Barkedo** and worked on diverse projects like **ResQpet** and **KUSH**. She was also a **WISE Scholar**. What aspect interests you most?`;
        quickReplies = ['Projects', 'Experience', 'Skills', 'Education'];
         nextMood = 'answering';
    }
     else if (lowerInput.includes('ar') || lowerInput.includes('augmented reality')) {
        response = `This portfolio features **Augmented Reality**! Look for special icons or QR codes on project cards (especially on the Projects page). Scanning them can unlock immersive AR experiences related to that project. It's a cool way to interact!`;
        quickReplies = ['Go to Projects', 'What other tech does Diya use?'];
         if (lowerInput.includes('go') || lowerInput.includes('visit') || lowerInput.includes('show me')) navigationTarget = '/projects';
          nextMood = 'happy';
    }

    // --- General Chat / Navigation ---
     else if (lowerInput.includes('navigate') || lowerInput.includes('go to') || lowerInput.includes('show me')) {
        if (lowerInput.includes('home') || lowerInput.includes('index') || lowerInput === 'go home') navigationTarget = '/';
        else if (lowerInput.includes('about')) navigationTarget = '/about';
        else if (lowerInput.includes('project')) navigationTarget = '/projects';
        else if (lowerInput.includes('contact') || lowerInput.includes('reach')) navigationTarget = '/contact';

        if(navigationTarget) {
            const pageName = navigationTarget === '/' ? 'Home' : navigationTarget.substring(1).charAt(0).toUpperCase() + navigationTarget.substring(1).slice(1);
            response = `Okay${userName ? ', **' + userName + '**' : ''}, taking you to the ${pageName} page!`;
             nextMood = 'idle';
        } else {
            response = `Hmm, I can help you navigate, but I didn't quite catch which page you meant. You can say "Go to Projects", "Show me About", etc.`;
            quickReplies = ['Home', 'About', 'Projects', 'Contact'];
             nextMood = 'confused';
        }
    }
     else if (lowerInput.match(/\b(hello|hi|hey|yo)\b/)) {
        response = `Hi${userName ? ', **' + userName + '**' : ''}! 👋 How can I help you explore Diya's work today?`;
        nextMood = 'greeting';
        quickReplies = ['Projects', 'Skills', 'Contact', 'What can you do?'];
    }
    else if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
        response = `You're very welcome! 😊 Let me know if anything else comes up.`;
        nextMood = 'happy';
        quickReplies = ['Explore Projects', 'Ask another question', 'Bye'];
    }
     else if (lowerInput.includes('bye') || lowerInput.includes('later') || lowerInput.includes('close chat')) {
        response = `Alright${userName ? ', **' + userName + '**' : ''}, have a great time exploring! Feel free to open me again if you need help. 👋`;
        nextMood = 'idle';
        setTimeout(toggleAssistant, 1500);
    }
      else if (lowerInput.includes('what can you do') || lowerInput.includes('help')) {
         response = `I can tell you about Diya's:\n* Projects (like ResQpet, KUSH)\n* Skills (Programming, Web/App Dev)\n* Internship Experience (CRIS, Barkedo)\n* Education (IIITD, WISE Scholar)\n* Contact Information\nI can also help you navigate the site. Just ask!`;
         quickReplies = ['Projects', 'Skills', 'Experience', 'Navigate'];
          nextMood = 'answering';
     }
      else if (lowerInput.length < 4 && !expectingName) {
         response = "Hmm, could you please provide a bit more detail? I'm here to help with information about Diya's portfolio.";
         nextMood = 'confused';
         quickReplies = ['What can you do?', 'Projects', 'Skills'];
     }
    // Default/Fallback
    else {
        response = `That's an interesting question! I'm specifically trained on Diya's portfolio information like projects, skills, experience, and education. Could you rephrase, or ask about one of those topics?`;
        nextMood = 'confused';
        quickReplies = ['Projects', 'Skills', 'Experience', 'Contact', 'What can you do?'];
    }

    // Add default quick replies if none were set and not closing/navigating/expecting name
    if (!quickReplies && nextMood !== 'idle' && navigationTarget === null && !expectingName) {
         quickReplies = ['Tell me about Diya', 'Projects', 'Skills', 'Contact'];
    }

    // --- ADD THIS RETURN STATEMENT ---
    // Return an object containing the calculated values
    return { response, quickReplies, navigationTarget, nextMood };
    // --- END OF ADDED RETURN STATEMENT ---


    // Dependencies for useCallback: Include all state/props accessed inside the function
  }, [messages, userName, setUserName, toggleAssistant, navigate, addAssistantMessage, addUserMessage, timeOfDay, activePage]); // Keep dependencies updated


  const handleSend = (messageToSend?: string) => {
    const currentInput = (messageToSend || input).trim();
    if (!currentInput) return;

    const lastAssistantMessage = messages.findLast(msg => msg.sender === 'assistant');
    const expectingName = lastAssistantMessage && lastAssistantMessage.rawContent.includes("What's your name?") && !userName;

    addUserMessage(currentInput);
    if (!messageToSend) setInput('');

    if (!expectingName) {
        setIsTyping(true);
        setMood('thinking');
    }


    const responseDelay = expectingName ? 400 : (1000 + Math.random() * 800);

    setTimeout(() => {
      const { response, quickReplies, navigationTarget, nextMood } = generateResponse(currentInput);

      addAssistantMessage(response, quickReplies);
      setIsTyping(false);

      if (navigationTarget === null && nextMood !== 'idle') {
           setMood(nextMood);
           setTimeout(() => setMood('listening'), 2500);
      } else {
           setMood(nextMood);
      }


      if (navigationTarget) {
        setTimeout(() => navigate(navigationTarget), 800);
      }


    }, responseDelay);

  };


  const handleQuickReplyClick = (reply: string) => {
     // Set input field value and then trigger send
     setInput(reply);
     // Use a slight delay before sending to simulate typing or selection
     setTimeout(() => handleSend(reply), 100);
  }


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getAvatarSrc = () => {
      return '/assets/avatar.png';
  };

  const messageVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

    const quickReplyContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const quickReplyButtonVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
    };


  return (
    <>
      {/* --- Toggle Button --- */}
      <motion.button
        className="fixed bottom-6 right-6 z-[1001] bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center w-14 h-14 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
        aria-label={assistantOpen ? "Close Assistant" : "Open Assistant"}
      >
        <AnimatePresence mode="wait">
          {assistantOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={28} />
            </motion.div>
          ) : (
             <motion.div key="open" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageSquare size={28} />
             </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* --- Chat Window --- */}
      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-[1000] w-[95vw] max-w-md bg-background rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col md:right-8 lg:right-10"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            style={{ height: 'clamp(450px, 75vh, 650px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white flex justify-between items-center flex-shrink-0 border-b border-purple-700">
              <div className="flex items-center gap-3">
                <motion.img
                    key={mood}
                    src={getAvatarSrc()}
                    alt="Assistant Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white/50 bg-white flex-shrink-0"
                    initial={{ scale: 0.9, rotate: 0 }}
                    animate={{ scale: 1, rotate: mood === 'thinking' ? 360 : 0 }}
                     transition={{ type: mood === 'thinking' ? 'tween' : 'spring', stiffness: mood === 'thinking' ? 0 : 400, damping: mood === 'thinking' ? 0 : 15, duration: mood === 'thinking' ? 1.5 : 0.3, repeat: mood === 'thinking' ? Infinity : 0 }}
                 />
                <div>
                    <h3 className="font-semibold text-base md:text-lg">Portfolio Assistant</h3>
                    <p className="text-xs opacity-80 capitalize">
                       {isTyping ? (
                           <span className="flex items-center gap-1">
                               Typing<span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                   <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                   <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                           </span>
                       ) : (
                           `${mood}...`
                       )}
                    </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                onClick={toggleAssistant}
                aria-label="Close Chat"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-indigo-50/30 space-y-4 scroll-smooth custom-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                   variants={messageVariants}
                   initial="hidden"
                   animate="visible"
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm md:text-base ${ // Max width for message bubble
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                    }`}
                     dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                   {/* Quick Replies */}
                    {message.sender === 'assistant' && message.quickReplies && (
                        <motion.div
                            className="flex gap-2 flex-wrap mt-2 justify-start"
                             variants={quickReplyContainerVariants}
                             initial="hidden"
                             animate="visible"
                        >
                            {message.quickReplies.map((reply, index) => (
                            <MotionButton // <-- FIX: Use MotionButton here
                                key={index}
                                size="sm"
                                className="text-xs md:text-sm h-7 px-2 bg-white/80 hover:bg-white border border-indigo-200 text-indigo-700 hover:text-indigo-800 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                onClick={() => handleQuickReplyClick(reply)}
                                variants={quickReplyButtonVariants}
                            >
                                {reply}
                            </MotionButton>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white text-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-200 flex items-center gap-1">
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                     <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
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
                  className="flex-1 p-2 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  aria-label="Send Message"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>

             {/* Footer Info */}
             <div className="text-xs text-center p-1.5 text-gray-500 bg-gray-100/50 border-t border-gray-200/50 flex-shrink-0">
                 Currently on: <span className="font-semibold">{activePage}</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

       <style>{`
           .custom-scrollbar::-webkit-scrollbar {
               width: 8px;
           }
           .custom-scrollbar::-webkit-scrollbar-track {
               background: #f1f1f1;
               border-radius: 10px;
           }
           .custom-scrollbar::-webkit-scrollbar-thumb {
               background: #888;
               border-radius: 10px;
           }
           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
               background: #555;
           }
           .custom-scrollbar {
               scrollbar-width: thin;
               scrollbar-color: #888 #f1f1f1;
           }
            /* Basic styling for markdown elements within message bubbles */
           .max-w-[85%] strong {
               font-weight: bold;
           }
           /* Added margin-top to separate paragraph blocks, but not for the very first one */
           .max-w-[85%] p {
               margin-top: 0.5em;
               margin-bottom: 0;
           }
            .max-w-[85%] p:first-child {
                margin-top: 0;
            }
           .max-w-[85%] ul {
               padding-left: 20px; /* Standard list indentation */
               margin-top: 8px;
               margin-bottom: 8px; /* Add some spacing around lists */
               list-style: disc; /* Default bullet style */
           }
           .max-w-[85%] li {
               margin-bottom: 4px; /* Space list items */
               line-height: 1.4; /* Improve readability */
           }
           /* Remove margin from the last list item */
            .max-w-[85%] ul li:last-child {
               margin-bottom: 0;
            }
            /* Basic styling for links */
            .max-w-[85%] a {
                color: #6366f1; /* Indigo color */
                text-decoration: underline;
            }
             .max-w-[85%] a:hover {
                color: #818cf8; /* Lighter indigo on hover */
            }


       `}</style>
    </>
  );
};

export default VirtualAssistant;