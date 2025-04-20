
import React, { useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { usePortfolio } from '../contexts/PortfolioContext';

const Sound: React.FC = () => {
  const { soundEnabled } = usePortfolio();
  const bgSoundRef = useRef<Howl | null>(null);
  const hoverSoundRef = useRef<Howl | null>(null);
  const clickSoundRef = useRef<Howl | null>(null);
  const swishSoundRef = useRef<Howl | null>(null);
  const typingSoundRef = useRef<Howl | null>(null);

  // Initialize sounds
  useEffect(() => {
    // Generate audio files on the fly with Web Audio API
    const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.03): string => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration);
      
      return '';
    };

    // Background ambient sound
    bgSoundRef.current = new Howl({
      src: ['/bg-ambient.mp3'],
      loop: true,
      volume: 0.03,
      preload: true,
      autoplay: false,
    });
    
    // Hover sound (softer)
    hoverSoundRef.current = new Howl({
      src: ['/hover-sound.mp3'],
      volume: 0.04,
      preload: true,
    });
    
    // Click sound
    clickSoundRef.current = new Howl({
      src: ['/click-sound.mp3'],
      volume: 0.10,
      preload: true,
    });
    
    // Swish sound for split hero
    swishSoundRef.current = new Howl({
      src: ['/swish-sound.mp3'],
      volume: 0.15,
      preload: true,
    });
    
    // Typing sound
    typingSoundRef.current = new Howl({
      src: ['/typing-sound.mp3'],
      volume: 0.05,
      rate: 1.5,
      preload: true,
    });

    // Generate fallback sounds if files don't exist
    bgSoundRef.current.once('loaderror', () => {
      console.log('Background sound load error, using fallback');
      generateTone(200, 100, 'sine', 0.02);
    });

    hoverSoundRef.current.once('loaderror', () => {
      console.log('Hover sound load error, using fallback');
      // Softer sound instead of beep
      generateTone(600, 40, 'sine', 0.01);
    });

    clickSoundRef.current.once('loaderror', () => {
      console.log('Click sound load error, using fallback');
      generateTone(800, 50, 'sine', 0.03);
    });
    
    swishSoundRef.current.once('loaderror', () => {
      console.log('Swish sound load error, using fallback');
      // Create a swishing sound effect
      const duration = 300;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 400;
      gain.gain.value = 0.05;
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      // Create swish effect with frequency sweep
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + duration/1000);
      gain.gain.setValueAtTime(0.01, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration/1000);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration);
    });
    
    typingSoundRef.current.once('loaderror', () => {
      console.log('Typing sound load error, using fallback');
      // Create typing sound effect
      const createKeyStroke = () => {
        generateTone(Math.random() * 100 + 800, 20, 'sine', 0.01);
      };
      createKeyStroke();
    });
    
    // Add event listeners for interactive sounds
    const handleHover = () => {
      if (soundEnabled && hoverSoundRef.current) {
        hoverSoundRef.current.play();
      }
    };
    
    const handleClick = () => {
      if (soundEnabled && clickSoundRef.current) {
        clickSoundRef.current.play();
      }
    };
    
    // Make swish sound and typing sound available globally
    window.playSwishSound = () => {
      if (soundEnabled && swishSoundRef.current) {
        swishSoundRef.current.play();
      }
    };
    
    window.playTypingSound = () => {
      if (soundEnabled && typingSoundRef.current) {
        typingSoundRef.current.play();
        return true;
      }
      return false;
    };
    
    // Select interactive elements
    const buttons = document.querySelectorAll('button, a, .clickable');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', handleHover);
      button.addEventListener('click', handleClick);
    });
    
    return () => {
      if (bgSoundRef.current) {
        bgSoundRef.current.stop();
      }
      
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleHover);
        button.removeEventListener('click', handleClick);
      });
      
      // Clean up global functions
      delete window.playSwishSound;
      delete window.playTypingSound;
    };
  }, []);

  // Control background sound based on soundEnabled state
  useEffect(() => {
    if (bgSoundRef.current) {
      if (soundEnabled) {
        bgSoundRef.current.play();
      } else {
        bgSoundRef.current.pause();
      }
    }
    
    // Update global functions to respect sound state
    window.playSwishSound = () => {
      if (soundEnabled && swishSoundRef.current) {
        swishSoundRef.current.play();
      }
    };
    
    window.playTypingSound = () => {
      if (soundEnabled && typingSoundRef.current) {
        typingSoundRef.current.play();
        return true;
      }
      return false;
    };

    return () => {
      delete window.playSwishSound;
      delete window.playTypingSound;
    };
  }, [soundEnabled]);

  // Set global Howler volume
  useEffect(() => {
    Howler.volume(soundEnabled ? 0.3 : 0);
  }, [soundEnabled]);

  return null;
};

export default Sound;
