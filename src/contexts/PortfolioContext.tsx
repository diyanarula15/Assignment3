
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface PortfolioContextType {
  activePage: string;
  setActivePage: (page: string) => void;
  visitorCount: number;
  themeMode: ThemeMode;
  timeOfDay: TimeOfDay;
  soundEnabled: boolean;
  toggleSound: () => void;
  userName: string;
  setUserName: (name: string) => void;
  assistantOpen: boolean;
  toggleAssistant: () => void;
}

const defaultContextValue: PortfolioContextType = {
  activePage: 'home',
  setActivePage: () => {},
  visitorCount: 0,
  themeMode: 'light',
  timeOfDay: 'morning',
  soundEnabled: false,
  toggleSound: () => {},
  userName: '',
  setUserName: () => {},
  assistantOpen: false,
  toggleAssistant: () => {}
};

const PortfolioContext = createContext<PortfolioContextType>(defaultContextValue);

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState('home');
  const [visitorCount, setVisitorCount] = useState(0);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Update visitor count from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('visitorCount');
    const count = storedCount ? parseInt(storedCount) : 0;
    
    // Increment count for new session
    setVisitorCount(count + 1);
    localStorage.setItem('visitorCount', (count + 1).toString());
    
    // Check if there's a stored username
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Determine time of day
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon');
      } else if (hour >= 17 && hour < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const toggleAssistant = () => {
    setAssistantOpen(prev => !prev);
  };

  // Save username to localStorage when it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('userName', userName);
    }
  }, [userName]);

  return (
    <PortfolioContext.Provider
      value={{
        activePage,
        setActivePage,
        visitorCount,
        themeMode,
        timeOfDay,
        soundEnabled,
        toggleSound,
        userName,
        setUserName,
        assistantOpen,
        toggleAssistant
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
