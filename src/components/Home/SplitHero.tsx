
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { ArrowDownIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    playSwishSound?: () => void;
    playTypingSound?: () => boolean;
  }
}

const SplitHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const { setActivePage } = usePortfolio();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    setHoverSide(x < bounds.width / 2 ? 'left' : 'right');
    
    if (window.playSwishSound) {
      window.playSwishSound();
    }
  };

  const handleMouseLeave = () => {
    setHoverSide(null);
  };

  const leftBgClip =
    hoverSide === 'left'
      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
      : hoverSide === 'right'
      ? 'polygon(0 0, 0% 0, 0% 100%, 0 100%)'
      : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';

  const rightBgClip =
    hoverSide === 'right'
      ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
      : hoverSide === 'left'
      ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
      : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)';

  const parallaxEffect = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const movement = (e.clientY / window.innerHeight) * 100;
    gsap.to(containerRef.current, {
      backgroundPosition: `center ${movement}%`,
      duration: 0.3,
    });
  };

  useEffect(() => {
    gsap.fromTo(
      '.left-content', 
      { x: '-100%' }, 
      { x: '0%', duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    gsap.fromTo(
      '.right-content', 
      { x: '100%' }, 
      { x: '0%', duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    if (containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, delay: 0.5 }
      );
    }

    gsap.to('.particle', {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
      stagger: 0.1,
      repeat: -1,
      yoyo: true
    });

    const codeStrings = [
      "const createPortfolio = () => {",
      "  const skills = ['React', 'ThreeJS', 'Design'];",
      "  return new Portfolio(skills);",
      "};",
      "",
      "function optimizeExperience() {",
      "  let creativity = 100;",
      "  while (creativity > 0) {",
      "    buildSomethingAmazing();",
      "    creativity--;",
      "  }",
      "}",
      "",
      "class Designer {",
      "  createConcept() {",
      "    return new Concept('innovative');",
      "  }",
      "}",
      "",
      "class Developer extends Human {",
      "  code() {",
      "    if (coffee.isEmpty) refillCoffee();",
      "    return this.transform(idea, into.reality);",
      "  }",
      "}"
    ];

    let codeElement = document.querySelector('.code-background');
    if (codeElement) {
      let htmlContent = '';
      codeStrings.forEach((line, index) => {
        htmlContent += `<div class="code-line" style="animation-delay: ${index * 0.1}s">${line}</div>`;
      });
      codeElement.innerHTML = htmlContent;
    }

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#fdf8f2] flex justify-center items-center overflow-hidden">
      {[...Array(20)].map((_, index) => (
        <div 
          key={index}
          className="particle absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-30"
          style={{
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={parallaxEffect}
        className="relative w-full h-full max-w-[1600px] mx-auto overflow-hidden"
        style={{ boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.25)' }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center left-content"
          style={{ 
            backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            backgroundSize: '200% 200%'
          }}
          animate={{ 
            clipPath: leftBgClip,
            backgroundPosition: hoverSide === 'left' ? '0% 0%' : '100% 100%' 
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-cover bg-center right-content"
          style={{ 
            backgroundImage: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
            backgroundSize: '200% 200%'
          }}
          animate={{ 
            clipPath: rightBgClip,
            backgroundPosition: hoverSide === 'right' ? '0% 0%' : '100% 100%' 
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        <div className="code-background absolute top-0 right-0 w-1/2 h-full overflow-hidden text-[#000] opacity-20 p-8 font-mono text-sm mt-20 z-0">
          {/* JS code will be inserted here by useEffect */}
        </div>

        <div
          className="absolute pointer-events-none z-10"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            maxWidth: '1000px',
            maxHeight: '800px',
          }}
        >
          <motion.div
            className="absolute w-full h-full overflow-hidden"
            animate={{ clipPath: leftBgClip }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/assets/d3267b10-5618-4d96-a08e-00044d13843e.png"
              alt="Designer Portrait"
              className="absolute w-full h-full object-contain left-content"
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.2))',
                clipPath: 'polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)',
              }}
            />
          </motion.div>
          <motion.div
            className="absolute w-full h-full overflow-hidden"
            animate={{ clipPath: rightBgClip }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="/assets/30e37085-1134-4fe3-b527-6b2b8aa47aad.png"
              alt="Developer Portrait"
              className="absolute w-full h-full object-contain right-content"
              style={{ 
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.2))',
                clipPath: 'polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)',
              }}
            />
          </motion.div>
        </div>

        <motion.div
          className="absolute z-20 top-1/2 left-10 -translate-y-1/2 max-w-sm left-content"
          animate={{ opacity: hoverSide === 'right' ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            designer
          </h1>
          <p className="mt-4 text-lg leading-relaxed bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
            Product designer specialising in UI<br />
            design and design systems.
          </p>
        </motion.div>

        <motion.div
          className="absolute z-20 top-1/2 right-10 -translate-y-1/2 max-w-sm text-right right-content"
          animate={{ opacity: hoverSide === 'left' ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-5xl font-extrabold text-black">
            &lt;coder&gt;
          </h1>
          <p className="mt-4 text-lg font-semibold text-black">
            Developer specializing in<br />
            JavaScript, React, and Three.js
          </p>
        </motion.div>

        <div className="absolute inset-0 z-10 flex">
          <div 
            className="w-1/2 h-full cursor-pointer"
            onMouseEnter={() => setHoverSide('left')}
          />
          <div 
            className="w-1/2 h-full cursor-pointer"
            onMouseEnter={() => setHoverSide('right')}
          />
        </div>

        <style>
          {`
          .code-line {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.5s forwards;
          }
          
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
        </style>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-[#fdf8f2]"
        style={{
          boxShadow: '0px -12px 60px rgba(0, 0, 0, 0.25)',
          zIndex: -1,
        }}
      />

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-aurora-700 flex flex-col items-center cursor-pointer z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }}
      >
        <span className="text-sm mb-2 font-medium">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDownIcon size={20} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplitHero;
