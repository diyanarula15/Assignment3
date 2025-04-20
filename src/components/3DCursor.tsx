
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThreeDCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isClicking ? 0.9 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.3
        }}
      >
        <div className="w-6 h-6 bg-white rounded-full" />
      </motion.div>
      <motion.div
        className="fixed pointer-events-none z-40"
        animate={{
          x: position.x - 32,
          y: position.y - 32,
          scale: isClicking ? 1.5 : 1,
          opacity: isVisible ? 0.2 : 0
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 150,
          mass: 0.5
        }}
      >
        <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full blur-sm" />
      </motion.div>
    </>
  );
};

export default ThreeDCursor;
