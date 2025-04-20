
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  description?: string;
}

const educationData: EducationItem[] = [
  {
    institution: "Indraprastha Institute of Information Technology (IIITD), Delhi, India",
    degree: "B.Tech in Computer Science and Design",
    duration: "2023 - Ongoing",
    description: "Focusing on advanced programming, data structures, algorithms, and interactive design systems.",
  },
  {
    institution: "Adarsh Jain Dharmic Shiksha Sadan, Delhi, India",
    degree: "Class XII, CBSE Board",
    duration: "2021 - 2023",
  }
];

const Education: React.FC = () => {
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
        staggerChildren: 0.2,
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
    <section className="py-16 bg-white">
      <div ref={ref} className="container mx-auto px-6">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-aurora-900"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          Education
        </motion.h2>
        
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {educationData.map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row gap-6"
              variants={itemVariants}
            >
              {/* Timeline dot and line */}
              <div className="hidden md:flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
                {index < educationData.length - 1 && (
                  <div className="w-1 h-full bg-gray-200 my-2"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex-1">
                <div className="flex flex-col md:flex-row justify-between mb-3">
                  <h3 className="text-xl font-semibold text-aurora-800">{item.institution}</h3>
                  <span className="text-primary font-medium">{item.duration}</span>
                </div>
                <p className="text-lg font-medium mb-1">{item.degree}</p>
                {item.description && <p className="text-aurora-600">{item.description}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-aurora-600 italic">
            Continuously learning and expanding my knowledge in computer science and design.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
