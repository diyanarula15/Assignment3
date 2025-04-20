
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import ThreeDCursor from './components/3DCursor.tsx';

console.log("Main.tsx initializing...");

// Create root with explicit non-null assertion
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(
  <>
    <App />
    <ThreeDCursor />
  </>
);
