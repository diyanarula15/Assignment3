
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: "Angry Birds",
    type: "Game",
    description: "2D physics simulation with Java & LibGDX.",
    image: "/assets/5bf9eabe-a2c4-417f-a0dc-21c0524b44e9.png",
    link: "https://github.com/diyanarula15/angry-birds-clone"
  },
  {
    title: "ResQpet",
    type: "Mobile App",
    description: "Flutter app with Firebase backend for reporting injured animals.",
    image: "/assets/e213d346-a135-47c8-8368-310863217275.png",
    link: "https://github.com/diyanarula15/ResQpet"
  },
  {
    title: "TempStat",
    type: "Data Processing",
    description: "Real-time processing of 50M+ weather records in C.",
    image: "/assets/df84435f-9aa3-4ec1-8f28-550e2e17b150.png",
    link: "https://github.com/diyanarula15/tempstat"
  },
  {
    title: "KUSH",
    type: "Systems / Shell",
    description: "Custom bash/zsh-like shell with piping, redirection, and user-defined commands.",
    image: "/assets/a674f60c-95a9-4e93-ba51-6a4590623b81.png",
    link: "https://github.com/diyanarula15/Kush"
  },
  {
    title: "Directory Management System",
    type: "CLI Tool",
    description: "Command-line system for adding, moving, aliasing, and searching files/folders.",
    image: "/assets/448f6df1-d24b-49ea-a401-6d8438b57dcb.png",
    link: "https://github.com/diyanarula15/Directory-Management-System"
  }
];

const ProjectsSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

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
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} id="portfolio" className="bg-[#f9f9f9] py-20 px-6 md:px-12">
      <motion.div 
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div className="text-center mb-14" variants={headerVariants}>
          <p className="text-sm tracking-widest text-gray-400 font-light mb-2">
            — SOME OF MY LATEST PROJECTS —
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-aurora-900">Featured Work</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.map((proj, idx) => (
            <ProjectCard 
              key={idx}
              title={proj.title}
              type={proj.type}
              description={proj.description}
              image={proj.image}
              link={proj.link}
              index={idx}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
