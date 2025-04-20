
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import SkillsSection from '../components/About/SkillsSection';
import Education from '../components/About/Education';
import Experience from '../components/About/Experience';
import Sound from '../components/Sound';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Puzzle, 
  Code, 
  Palette, 
  Database, 
  Layers, 
  Server, 
  ChevronDown,
  FileJson, 
  FileCode, 
  FileType, 
  FilePieChart, 
  Flame, 
  Wind, 
  BrainCircuit, 
  GitBranch, 
  BoxIcon, 
  MonitorSmartphone, 
  FigmaIcon, 
  PanelLeftClose 
} from 'lucide-react';

interface PuzzlePiece {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Array<{
    name: string;
    icon?: React.ReactNode;
  }>;
  description: string;
  expanded: boolean;
}

declare global {
  interface Window {
    playSwishSound?: () => void;
    playTypingSound?: () => boolean;
  }
}

const About: React.FC = () => {
  const { setActivePage } = usePortfolio();
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([
    {
      id: 'Programming Languages',
      title: 'Programming Languages',
      icon: <Code className="h-8 w-8" />,
      color: 'bg-blue-500',
      skills: [
        { name: 'C++', icon: <FileCode className="h-5 w-5" /> },
        { name: 'C', icon: <FileCode className="h-5 w-5" /> },
        { name: 'Python', icon: <FilePieChart className="h-5 w-5" /> },
        { name: 'Java', icon: <FileCode className="h-5 w-5" /> },
        { name: 'JavaScript', icon: <FileJson className="h-5 w-5" /> }
      ],
      description: 'Expertise in foundational and advanced programming languages that power my development solutions',
      expanded: false
    },
    {
      id: 'Frontend Development',
      title: 'Frontend Development',
      icon: <Palette className="h-8 w-8" />,
      color: 'bg-purple-500',
      skills: [
        { name: 'React', icon: <BrainCircuit className="h-5 w-5" /> },
        { name: 'HTML/CSS', icon: <FileType className="h-5 w-5" /> },
        { name: 'Flutter', icon: <Wind className="h-5 w-5" /> },
        { name: 'Tailwind CSS', icon: <Wind className="h-5 w-5" /> },
        { name: 'Framer Motion', icon: <Flame className="h-5 w-5" /> }
      ],
      description: 'mastery of modern frameworks, libraries and methodologies that enable creation of sophisticated UI',
      expanded: false
    },
    {
      id: 'Backend Technology',
      title: 'Backend Technology',
      icon: <Server className="h-8 w-8" />,
      color: 'bg-emerald-500',
      skills: [
        { name: 'Django', icon: <Code className="h-5 w-5" /> },
        { name: 'Node.js', icon: <PanelLeftClose className="h-5 w-5" /> },
        { name: 'Express', icon: <Server className="h-5 w-5" /> },
        { name: 'MySQL', icon: <Database className="h-5 w-5" /> },
        { name: 'MongoDB', icon: <Database className="h-5 w-5" /> }
      ],
      description: 'Proficient in building reliable server-side systems that power applications with efficiency and security',
      expanded: false
    },
    {
      id: 'Development Toolkit',
      title: 'Development Toolkit',
      icon: <Layers className="h-8 w-8" />,
      color: 'bg-amber-500',
      skills: [
        { name: 'Git', icon: <GitBranch className="h-5 w-5" /> },
        { name: 'Docker', icon: <BoxIcon className="h-5 w-5" /> },
        { name: 'Linux', icon: <MonitorSmartphone className="h-5 w-5" /> },
        { name: 'Figma', icon: <FigmaIcon className="h-5 w-5" /> },
        { name: 'Adobe Suite', icon: <Palette className="h-5 w-5" /> }
      ],
      description: 'Competent with a comprehensive set of professional tools that streamline the entire development process',
      expanded: false
    }
  ]);
  
  // For typewriter effect
  const bioText = "  Hello! I'm Diya Narula, a computer science and design student at Indraprastha Institute of Information Technology, Delhi. My journey in tech began with a fascination for how digital solutions can solve real-world problems. I'm passionate about creating products that are not just functional but also provide a delightful user experience. My background in both computer science and design gives me a unique perspective on building technology that's both powerful and accessible. When I'm not coding or designing, you can find me exploring new technologies, contributing to open-source projects, or sketching creative concepts for future applications.";
  const [displayText, setDisplayText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  
  useEffect(() => {
    setActivePage('about');
    document.title = "About - Diya Narula";
    
    window.scrollTo(0, 0);
    
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < bioText.length) {
        setDisplayText(prev => prev + bioText.charAt(index));
        index++;
        
        if (index % 4 === 0 && window.playTypingSound) {
          window.playTypingSound();
        }
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true);
      }
    }, 20);
    
    return () => clearInterval(typingInterval);
  }, [setActivePage]);

  const toggleExpand = (id: string) => {
    setPuzzlePieces(prevPieces => 
      prevPieces.map(piece => 
        piece.id === id ? { ...piece, expanded: !piece.expanded } : piece
      )
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-aurora-50 via-white to-aurora-50"
    >
      <Sound />
      
      <section className="pt-32 pb-20 px-6 bg-gradient-radial from-aurora-200 via-white to-aurora-100 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full mix-blend-multiply opacity-20"
              style={{
                width: `${Math.random() * 300 + 100}px`, 
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `rgba(${Math.floor(Math.random() * 150) + 100}, ${Math.floor(Math.random() * 150) + 100}, ${Math.floor(Math.random() * 200) + 55}, 0.4)`,
                filter: 'blur(40px)',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
          
          <div className="absolute inset-0 bg-grid-pattern opacity-10" 
            style={{
              backgroundImage: "linear-gradient(to right, rgba(100, 100, 255, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 100, 255, 0.3) 1px, transparent 1px)",
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-aurora-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-aurora-900 to-indigo-800">About Me</h1>
            <p className="text-lg max-w-3xl mx-auto text-aurora-700">
              I'm a B.Tech student at IIITD with a passion for creating elegant solutions that combine technical expertise and creative design thinking.
            </p>
          </motion.div>
          
          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-full h-80 md:h-96 overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="/assets/5de97592-983a-4526-96ce-9c8a7799f994.png" 
                    alt="Diya Narula profile" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                

              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-aurora-800 border-b border-aurora-200 pb-3">Who I Am</h2>
              <div className="space-y-4 text-aurora-700">
                <p className="min-h-[200px]">
                  {displayText}
                  {!typingComplete && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-16 px-6 bg-gradient-to-br from-white via-aurora-50 to-white relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-aurora-900">Skill Sets</h2>
            <p className="text-aurora-700 max-w-2xl mx-auto">
              Explore my skills by clicking on each puzzle piece to expand and see details.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M25,50 L75,50" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M50,25 L50,75" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="0.5" strokeDasharray="5,5" />
                <circle cx="50" cy="50" r="3" fill="rgba(147, 51, 234, 0.5)" />
              </svg>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {puzzlePieces.map((piece) => (
                  <motion.div 
                    key={piece.id} 
                    className={`rounded-xl shadow-lg overflow-hidden cursor-pointer ${piece.expanded ? 'row-span-2 col-span-2' : ''}`}
                    onClick={() => toggleExpand(piece.id)}
                    layout
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <div className={`${piece.color} p-6 text-white relative`}>
                      <div className="mb-4 p-3 bg-white/20 rounded-full inline-block">
                        {piece.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{piece.title}</h3>
                      <p className="opacity-90">{piece.description}</p>
                      <ChevronDown 
                        className={`absolute top-4 right-4 transition-transform ${piece.expanded ? 'rotate-180' : ''}`} 
                        size={20} 
                      />
                    </div>

                    {piece.expanded && (
                      <motion.div 
                        className="bg-white p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="font-bold mb-4 border-b border-gray-200 pb-2">Skills</h4>
                        <ul className="space-y-3">
                          {piece.skills.map((skill, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className={`mr-3 ${piece.color} rounded-full p-1.5 text-white`}>
                                {skill.icon}
                              </div>
                              {skill.name}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Education />
      
      <Experience />

      <style>
        {`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        `}
      </style>
    </motion.div>
  );
};

export default About;
