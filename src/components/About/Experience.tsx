
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ExperienceItem {
  position: string;
  company: string;
  duration: string;
  description: string[];
  outcome: string;
}

const experienceData: ExperienceItem[] = [
  {
    position: "Software Engineer Intern",
    company: "Centre for Railway Information Systems (CRIS)",
    duration: "Dec 2023 - Jan 2024",
    description: [
      "Built a Django web platform for team performance tracking and project management, streamlining workflow for 40-person team.",
      "Implemented role-based access control to assign targets to respective teams securely and efficiently.",
      "Designed and implemented an efficient relational database schema to optimize data retrieval speed and reliability.",
      "Collaborated with cross-functional teams to improve the usability and adoption of the system for field operators."
    ],
    outcome: "Improved task assignment accuracy by 30% and ensured scalability for future system enhancements."
  },
  {
    position: "Graphic Design Intern",
    company: "Barkedo",
    duration: "May 2024 - Jul 2024",
    description: [
      "Designed cohesive marketing collateral using Figma, adhering to established style guides.",
      "Optimized design workflows by integrating version control systems, enhancing team collaboration and efficiency."
    ],
    outcome: "Boosted online engagement by 20% across social channels."
  }
];

const Experience: React.FC = () => {
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
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-aurora-50">
      <div ref={ref} className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-aurora-900"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          Professional Experience
        </motion.h2>
        
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {experienceData.map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row gap-6"
              variants={itemVariants}
            >
              {/* Timeline dot and line */}
              <div className="hidden md:flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-accent"></div>
                {index < experienceData.length - 1 && (
                  <div className="w-1 h-full bg-gray-200 my-2"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                  <h3 className="text-xl font-semibold text-aurora-800">
                    {item.position} at {item.company}
                  </h3>
                  <span className="text-accent font-medium">{item.duration}</span>
                </div>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {item.description.map((point, idx) => (
                    <li key={idx} className="text-aurora-700">{point}</li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="font-medium text-aurora-800">Outcome:</p>
                  <p className="text-aurora-700">{item.outcome}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
