
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Award, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../contexts/PortfolioContext';

const IntroSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const { setActivePage } = usePortfolio();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="py-20 px-6 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Image */}
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative">
              {/* Main image */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="/assets/5de97592-983a-4526-96ce-9c8a7799f994.png" 
                  alt="Diya Narula" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating decorative elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-accent text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Briefcase size={24} />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-primary text-white p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
              >
                <Award size={24} />
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 -right-10 bg-secondary text-foreground p-3 rounded-lg shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
              >
                <BookOpen size={24} />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            variants={itemVariants}
          >
            <motion.span 
              className="text-sm uppercase tracking-wider text-primary font-medium"
              variants={itemVariants}
            >
              B.Tech Student in Computer Science and Design
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6 text-aurora-900"
              variants={itemVariants}
            >
              Hello, I'm Diya Narula
            </motion.h2>
            
            <motion.p 
              className="text-lg text-aurora-600 leading-relaxed mb-6 max-w-lg"
              variants={itemVariants}
            >
              A passionate developer and designer from Delhi, India, currently pursuing B.Tech in Computer Science at IIITD. I create elegant solutions that combine technical expertise and creative design thinking.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start"
              variants={itemVariants}
            >
              <span className="px-3 py-1 bg-secondary text-aurora-700 rounded-full text-sm">UI/UX Design</span>
              <span className="px-3 py-1 bg-secondary text-aurora-700 rounded-full text-sm">Web Development</span>
              <span className="px-3 py-1 bg-secondary text-aurora-700 rounded-full text-sm">Mobile Apps</span>
              <span className="px-3 py-1 bg-secondary text-aurora-700 rounded-full text-sm">Data Structures</span>
            </motion.div>
            
            <motion.div 
              className="flex gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <Link to="/projects" onClick={() => setActivePage('projects')}>
                <Button className="rounded-full">
                  View Projects
                </Button>
              </Link>
              
              <Link to="/contact" onClick={() => setActivePage('contact')}>
                <Button variant="outline" className="rounded-full">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default IntroSection;
