import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitHero from '../components/Home/SplitHero';
import IntroSection from '../components/Home/IntroSection';
import ProjectsSection from '../components/Projects/ProjectsSection';
import DesignJourney from '../components/Home/DesignJourney';
import { usePortfolio } from '../contexts/PortfolioContext';
import ThreeJSModel from '../components/ThreeJSModel';
import Sound from '../components/Sound';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Index: React.FC = () => {
  const { setActivePage } = usePortfolio();
  const { scrollYProgress } = useScroll();
  const [activeViewers, setActiveViewers] = useState<number>(1);

  // Parallax effect values for different sections
  const threeJSParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    // Set the active page immediately when component mounts
    setActivePage('home');
    document.title = "Diya Narula - Portfolio";

    // Simulate real-time active viewers with WebSocket-like behavior
    const simulateRealTimeViewers = () => {
      // Generate a random number between 1 and 5, representing other viewers
      const randomViewers = Math.floor(Math.random() * 5) + 1;
      setActiveViewers(randomViewers);

      // Update count every 30-60 seconds to simulate real activity
      const timeout = setTimeout(() => {
        simulateRealTimeViewers();
      }, Math.random() * 30000 + 30000);

      return () => clearTimeout(timeout);
    };

    simulateRealTimeViewers();

    // Show welcome toast notification
    setTimeout(() => {
      toast("Welcome to my portfolio!", {
        description: "Feel free to explore and interact with all elements.",
        duration: 5000,
        position: "bottom-right"
      });
    }, 2000);
  }, [setActivePage]);

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-hidden"
      >
        {/* Enable sound effects */}
        <Sound />

        {/* Real-time collaborative presence indicator */}
        <div className="fixed bottom-28 left-6 z-50 bg-black/60 backdrop-blur-sm border border-gray-700 text-gray-200 p-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs">
          <Users className="h-3 w-3 text-indigo-300" />
          <span className="font-medium text-[10px]">{activeViewers + 1}</span>
        </div>

        {/* Hero section with split design */}
        <SplitHero />

        {/* Introduction section */}
        <IntroSection />

        {/* Interactive 3D model */}
        <motion.section
          className="py-20 px-6 relative overflow-hidden"
          style={{
            backgroundColor: "#0f172a",
            backgroundImage: "radial-gradient(circle, rgba(42,55,109,1) 0%, rgba(15,23,42,1) 100%)"
          }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full opacity-20"
            style={{ y: threeJSParallax }}
          >
            {/* Animated grid background */}
            <div className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(100, 100, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(100, 100, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg)'
              }}
            />
          </motion.div>

          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Zoom Around to Discover My Skills
                </span>
              </h2>
              <p className="text-center text-blue-200 mb-8 max-w-2xl mx-auto">
                Interact with the 3D objects to learn about my expertise areas. Hover over or click on different shapes to navigate to related sections.
              </p>
            </motion.div>

            <motion.div
              className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/30"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ThreeJSModel />
            </motion.div>
          </div>
        </motion.section>

        {/* Projects showcase */}
        <ProjectsSection />

        {/* Design journey section */}
        <DesignJourney />

        {/* REMOVED: VirtualAssistant component should not be here */}
      </motion.div>
    </PageTransition>
  );
};

export default Index;