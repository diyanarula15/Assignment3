
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import { 
  Search, PenTool, LayoutTemplate, Users, Code, RefreshCw, 
  MapPin, Map, Compass
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface JourneyStep {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const steps: JourneyStep[] = [
  {
    title: "Research & Discovery",
    description: "Every project begins with understanding user needs through research, interviews, and competitive analysis.",
    icon: <Search className="h-6 w-6" />,
    color: "#8B5CF6" // Purple
  },
  {
    title: "Ideation & Wireframing",
    description: "Sketching concepts and creating wireframes to visualize the structure and layout of the solution.",
    icon: <PenTool className="h-6 w-6" />,
    color: "#EC4899" // Pink
  },
  {
    title: "Prototyping",
    description: "Converting ideas into interactive prototypes to test functionality and user flows.",
    icon: <LayoutTemplate className="h-6 w-6" />,
    color: "#F97316" // Orange
  },
  {
    title: "User Testing",
    description: "Gathering feedback through usability testing to refine and improve the design.",
    icon: <Users className="h-6 w-6" />,
    color: "#10B981" // Green
  },
  {
    title: "Implementation",
    description: "Bringing designs to life through development, ensuring the final product meets design specifications.",
    icon: <Code className="h-6 w-6" />,
    color: "#0EA5E9" // Blue
  },
  {
    title: "Evaluation & Iteration",
    description: "Continuous improvement based on user feedback and data to enhance the experience.",
    icon: <RefreshCw className="h-6 w-6" />,
    color: "#6366F1" // Indigo
  }
];

const DesignJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"] 
  });
  const controls = useAnimation();
  const [containerViewRef, inView] = useInView({ 
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    // Effect for the SVG path animation
    if (!pathRef.current || !markerRef.current) return;
    
    const pathLength = pathRef.current.getTotalLength();
    
    // Set up the path
    pathRef.current.style.strokeDasharray = `${pathLength}`;
    pathRef.current.style.strokeDashoffset = `${pathLength}`;
    
    // Create the animation for the path and marker
    const pathAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });
    
    pathAnimation.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "power2.inOut"
    });
    
    // For each step, add an animation
    steps.forEach((_, index) => {
      const stepEl = document.querySelector(`.journey-step-${index}`);
      if (stepEl) {
        pathAnimation.to(markerRef.current, {
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: index / (steps.length - 1),
            end: (index + 1) / (steps.length - 1)
          },
          duration: 1,
          onStart: () => {
            gsap.to(`.journey-step-${index}`, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1
            });
          }
        }, index);
      }
    });
    
    // Clean up
    return () => {
      pathAnimation.kill();
    };
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Calculate a vertical path for the journey
  const pathPoints = steps.map((_, i) => {
    const x = 50; // Center x-position for all points
    const y = (i * 100) / (steps.length - 1); // Vertically distributed points
    return `${x}% ${y}%`;
  });
  
  const pathD = `M${pathPoints.join(' L')}`;

  return (
    <div 
      ref={(element) => {
        containerRef.current = element;
        // Properly use the containerViewRef function
        if (element) containerViewRef(element);
      }}
      className="py-28 px-6 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Design Journey
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow the path of creation from concept to completion
          </p>
        </div>

        {/* Place landmarks above the journey */}
        <div className="relative z-10">
          {/* Journey landmarks - positioned higher */}
          <div className="absolute top-[-60px] left-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md flex items-center gap-2">
            <Map className="h-5 w-5 text-purple-600" />
            <span className="text-gray-700 font-medium">Design Expedition</span>
          </div>
          
          <div className="absolute top-[-60px] right-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-600" />
            <span className="text-gray-700 font-medium">Journey Guide</span>
          </div>
        </div>

        {/* Vertical journey layout */}
        <div className="relative min-h-[1200px] mt-24 flex flex-col items-center">
          {/* The SVG path that represents the journey */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Decorative elements */}
            {[...Array(10)].map((_, i) => (
              <circle 
                key={`star-${i}`} 
                cx={Math.random() * 100} 
                cy={Math.random() * 100} 
                r={Math.random() * 0.3 + 0.1} 
                fill="#fff" 
                className="animate-pulse"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              />
            ))}
            
            {/* Dotted background path (always visible) */}
            <path
              d={pathD}
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            
            {/* The actual path to animate */}
            <path
              ref={pathRef}
              d={pathD}
              stroke="url(#journeyGradient)"
              strokeWidth="2"
              fill="none"
              className="journey-path"
            />
            
            {/* Moving marker along the path */}
            <circle
              ref={markerRef}
              r="2"
              fill="#6366F1"
              className="animate-pulse"
              filter="drop-shadow(0 0 4px rgba(99, 102, 241, 0.8))"
            />
            
            {/* Path gradient */}
            <defs>
              <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="20%" stopColor="#EC4899" />
                <stop offset="40%" stopColor="#F97316" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="80%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Steps arranged vertically */}
          <div className="relative w-full max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`journey-step-${index} opacity-0 translate-y-10 mb-28`}
              >
                {/* Card layout with marker on the left */}
                <div className="flex items-start gap-8">
                  {/* Step marker */}
                  <div
                    className="w-14 h-14 rounded-full bg-white shadow-xl flex-shrink-0 flex items-center justify-center border-2 mt-2"
                    style={{ 
                      borderColor: step.color,
                      boxShadow: `0 0 20px ${step.color}40`
                    }}
                  >
                    <span style={{ color: step.color }}>{step.icon}</span>
                  </div>
                  
                  {/* Step content */}
                  <div 
                    className="bg-white/90 backdrop-blur-sm p-5 rounded-lg shadow-lg border-t-4 hover:transform hover:scale-105 transition-all duration-300 w-full"
                    style={{ 
                      borderColor: step.color,
                      boxShadow: `0 10px 30px ${step.color}20`
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-2" style={{ color: step.color }}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                    
                    {/* Visual indicator of completion */}
                    <div className="mt-3 h-1 w-full bg-gray-100 rounded overflow-hidden">
                      <motion.div 
                        className="h-full"
                        style={{ background: step.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: 0.2 * index }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Connecting line to the next step */}
                {index < steps.length - 1 && (
                  <div 
                    className="absolute left-7 ml-[-1px] w-0.5 h-28 bg-gradient-to-b"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, ${step.color}, ${steps[index + 1].color})`,
                      top: '60px'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Decorative elements */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`landmark-${i}`}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                zIndex: -1
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <MapPin 
                className="h-6 w-6 opacity-20" 
                style={{ 
                  color: steps[Math.floor(Math.random() * steps.length)].color 
                }} 
              />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div 
          className="text-center mt-16 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-gray-700 italic text-lg">
            "Design is not just what it looks like and feels like. Design is how it works."
          </p>
          <p className="text-gray-500 mt-2">- Steve Jobs</p>
        </motion.div>
      </motion.div>
      
      {/* Dynamic background particles */}
      {[...Array(15)].map((_, index) => (
        <motion.div 
          key={`particle-${index}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            background: `radial-gradient(circle, ${steps[Math.floor(Math.random() * steps.length)].color}20, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default DesignJourney;
