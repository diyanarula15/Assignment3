import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

// Extend Window interface for AFRAME
declare global {
  interface Window {
    AFRAME: any;
  }

  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-box': any;
      'a-sphere': any;
      'a-sky': any;
      'a-cursor': any;
      'a-light': any;
      'a-text': any;
      'a-plane': any;
    }
  }
}

const ARScene: React.FC = () => {
  const { soundEnabled } = usePortfolio();
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shotsFired, setShotsFired] = useState(0);
  const [shotsReached, setShotsReached] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('arHighScore') : null;
    return saved ? parseInt(saved, 10) : 0;
  });

  const [aframeLoaded, setAframeLoaded] = useState(false);
  const componentRegistered = useRef(false);
  const sceneRef = useRef<any>(null);

  // --- Script Loading Effect ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const AFRAME_SRC = 'https://aframe.io/releases/1.4.0/aframe.min.js';
    const PHYSICS_SRC = 'https://cdn.jsdelivr.net/gh/c-frame/aframe-physics-system@v4.2.2/dist/aframe-physics-system.min.js';

    const checkScriptsLoaded = () => {
        // Check if A-Frame core and physics system are available globally
       if (window.AFRAME && window.AFRAME.systems && window.AFRAME.systems.physics) {
           console.log("A-Frame and physics system are ready.");
           setAframeLoaded(true);
       } else {
            console.log("A-Frame or physics system not yet ready.");
       }
    };

    const loadPhysicsScript = () => {
        let physicsScript = document.querySelector(`script[src="${PHYSICS_SRC}"]`) as HTMLScriptElement | null;

        if (!physicsScript) {
             console.log("Physics system script not found, appending...");
             physicsScript = document.createElement('script');
             physicsScript.src = PHYSICS_SRC;
             physicsScript.async = false; // Maintain load order
             physicsScript.onload = checkScriptsLoaded; // Check if both are ready after physics loads
             physicsScript.onerror = () => console.error("Failed to load physics system script.");
             document.body.appendChild(physicsScript);
        } else {
             console.log("Physics system script already exists.");
             // Even if script exists, check if the system is registered (might be from a previous mount)
             if (window.AFRAME?.systems?.physics) {
                 checkScriptsLoaded();
             } else {
                 // If script exists but system isn't registered, re-attach onload?
                 // This case is tricky. Relying on the *first* script's onload is best.
                 // Just check if it eventually becomes ready via the A-Frame onload pathway.
             }
        }
    };

    const loadAFrameScript = () => {
        let aframeScript = document.querySelector(`script[src="${AFRAME_SRC}"]`) as HTMLScriptElement | null;

        if (!aframeScript) {
            console.log("A-Frame core script not found, appending...");
            aframeScript = document.createElement('script');
            aframeScript.src = AFRAME_SRC;
            aframeScript.async = false; // Maintain load order
            aframeScript.onload = () => {
                console.log("A-Frame core script loaded.");
                loadPhysicsScript(); // Load physics AFTER A-Frame core is ready
            };
            aframeScript.onerror = () => console.error("Failed to load A-Frame core script.");
            document.body.appendChild(aframeScript);
        } else {
             console.log("A-Frame core script already exists.");
             // If A-Frame core is already globally available, immediately try loading physics
             if (window.AFRAME) {
                 console.log("A-Frame core already globally available.");
                 loadPhysicsScript();
             } else {
                 // If script exists but AFRAME is not global, re-attach onload? Tricky.
                 // Rely on the first script's onload.
             }
        }
    };

    // Start the loading process only if A-Frame is not already fully loaded
    // This check prevents *starting* the append process if a previous render
    // in strict mode already finished loading successfully.
    if (!window.AFRAME || !window.AFRAME.systems?.physics) {
         console.log("A-Frame or Physics not fully loaded, initiating script load sequence...");
         loadAFrameScript(); // Start the sequence
    } else {
         console.log("A-Frame and physics system already present on effect start.");
         setAframeLoaded(true); // Already loaded from a previous effect run
    }


    // Cleanup function remains tricky for globally loaded libraries.
    // Focus on preventing duplicates rather than trying to remove.
    return () => {
      console.log("ARScene cleanup effect running. Script removal skipped as they are global dependencies.");
       // Clean up listeners if you added them in a way that needs explicit removal,
       // but onload/onerror on script tags are usually handled by the browser.
    };

  }, []); // Empty dependency array ensures this effect runs once on mount (and potential strict mode re-run)

  // Update high score effect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('arHighScore', score.toString());
    }
  }, [score, highScore]);

  // Game timer effect
  useEffect(() => {
    let timer: number | undefined;

    if (gameActive && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      document.exitPointerLock?.();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameActive, timeLeft]);

  // Start game function
  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    setShotsFired(0);
    setShotsReached(0);
    setGameActive(true);
    sceneRef.current?.canvas?.requestPointerLock?.();

     if (sceneRef.current) {
         const targets = sceneRef.current.querySelectorAll('[target-health-behavior]');
         targets.forEach((targetEl: any) => {
             // Use the component's own method to reset if available, or set attributes
             if (targetEl.components['target-health-behavior']?.resetTarget) {
                  targetEl.components['target-health-behavior'].resetTarget();
             } else {
                 // Fallback if resetTarget method doesn't exist or component not ready
                 const initialHealth = parseInt(targetEl.getAttribute('data-initial-health') || '5', 10); // Get initial health
                 targetEl.setAttribute('target-health-behavior', `currentHealth: ${initialHealth}`); // Reset health in component state
                 const healthText = targetEl.querySelector('a-text');
                 if(healthText) {
                      healthText.setAttribute('value', initialHealth.toString());
                      healthText.setAttribute('color', '#FFFFFF'); // Reset color
                      healthText.setAttribute('visible', 'true'); // Make text visible again
                 }
                 targetEl.setAttribute('visible', 'true'); // Make target visible again

                 // Respawn to a random position (same logic as in component)
                 const x = (Math.random() - 0.5) * 8;
                 const y = Math.random() * 2.5 + 1;
                 const z = -Math.random() * 4 - 3;
                 targetEl.setAttribute('position', `${x} ${y} ${z}`);

                  // Optional: Reset physics body if necessary (static body position usually updates fine)
                 // if (targetEl.body) { /* ... reset velocity if dynamic */ }
             }
         });
     }

  }, []);

  // Handle target hit (memoized) - Now called when target is *destroyed*
  const handleTargetDestroyed = useCallback((points: number) => {
    if (!gameActive) return;

    console.log(`Target destroyed for ${points} points!`);

    if (soundEnabled) {
      const hitSound = new Audio('/assets/click-sound.mp3');
      hitSound.volume = 0.15;
      hitSound.play().catch(e => console.error("Error playing hit sound:", e));
    }

    setScore(prev => prev + points);
    setShotsReached(prev => prev + 1);

  }, [gameActive, soundEnabled]);

    // Shoot ball function (memoized)
    const shootBall = useCallback(() => {
        if (!gameActive || !sceneRef.current || !window.AFRAME || !window.AFRAME.THREE) return;

        const cameraEl = sceneRef.current.camera?.el;
        if (!cameraEl) {
            console.error("Camera element not found!");
            return;
        }

        setShotsFired(prev => prev + 1); // Increment shots fired

        const THREE = window.AFRAME.THREE;

        const worldPos = new THREE.Vector3();
        cameraEl.object3D.getWorldPosition(worldPos);

        const worldDir = new THREE.Vector3();
        cameraEl.object3D.getWorldDirection(worldDir);

        const ball = document.createElement('a-sphere');
        ball.setAttribute('class', 'projectile'); // Use class for selection in component
        ball.setAttribute('radius', '0.1');
        ball.setAttribute('color', '#ff4444');
        ball.setAttribute('shadow', 'cast: true; receive: false');

        const startOffset = 0.5;
        const startPos = worldPos.add(worldDir.clone().multiplyScalar(startOffset));
        ball.setAttribute('position', `${startPos.x} ${startPos.y} ${startPos.z}`);

        // Add physics - dynamic-body for collisions and movement
        ball.setAttribute('dynamic-body', 'shape: sphere; mass: 0.5');

        sceneRef.current.appendChild(ball);

        // Apply velocity after a small delay to ensure physics body is ready
        const applyVelocity = () => {
             const ballEntity = ball as any;
             if (ballEntity.body) {
                 const shootingSpeed = 20;
                 const velocity = worldDir.multiplyScalar(shootingSpeed);
                 ballEntity.body.velocity.set(velocity.x, velocity.y, velocity.z);
                 console.log("Ball shot with velocity:", velocity);
             } else {
                 console.warn("Physics body not initialized for the ball, cannot set velocity.");
                 // Optional: Clean up the ball if it couldn't be shot
                 if (ball.parentNode) {
                     ball.parentNode.removeChild(ball);
                 }
             }
        };

        // Use a small timeout to yield to the event loop, giving physics a chance to init
        setTimeout(applyVelocity, 10);

        // Remove ball after 3 seconds
        setTimeout(() => {
            if (ball.parentNode === sceneRef.current) {
                sceneRef.current.removeChild(ball);
            }
        }, 3000);

        if (soundEnabled) {
            const shootSound = new Audio('/assets/swish-sound.mp3');
            shootSound.volume = 0.2;
            shootSound.play().catch(e => console.error("Error playing shoot sound:", e));
        }
    }, [gameActive, soundEnabled]);

  // Effect to register A-Frame components AFTER scripts are loaded
  useEffect(() => {
    // Only attempt to register if AFRAME is globally available and component hasn't been registered
    if (aframeLoaded && window.AFRAME && !componentRegistered.current) {
        console.log("Attempting to register A-Frame components...");
      try {
         // Double check just before registering in case of complex timing
         if (window.AFRAME.components['target-health-behavior']) {
             console.warn("Component 'target-health-behavior' already registered before explicit registration attempt. Skipping registration.");
             componentRegistered.current = true;
             return;
         }

        // --- Target Health and Behavior Component ---
        window.AFRAME.registerComponent('target-health-behavior', {
          schema: {
            initialHealth: { type: 'int', default: 5 },
            currentHealth: { type: 'int', default: -1 }, // -1 means use initialHealth on init
            points: { type: 'int', default: 1 }, // Points awarded on destruction
            respawnDelay: { type: 'number', default: 2000 } // ms before respawning
          },

          init: function() {
            const data = this.data;
            this.isHitting = false;
            this.isDestroyed = false;
            this.healthTextEl = null;
            this.respawnTimeout = null; // To clear timeout on remove/reset

            // --- More robust way to determine initial health ---
            // Read attribute first, fall back to schema default
            let initialHealthValue = parseInt(this.el.getAttribute('data-initial-health') as string, 10);

            if (isNaN(initialHealthValue)) {
                // console.warn(`[target-health-behavior] Could not parse data-initial-health on ${this.el.id || this.el.outerHTML}. Falling back to schema default: ${data.initialHealth}`);
                initialHealthValue = data.initialHealth;
                 if (isNaN(initialHealthValue)) {
                     console.error(`[target-health-behavior] Schema default initialHealth is also NaN. Using hardcoded 5.`);
                     initialHealthValue = 5;
                 }
            }

            // Set current health: Use loaded currentHealth if not default, otherwise use the determined initialHealth
            // The data.currentHealth default of -1 signals to use initialHealthValue
            this.currentHealth = data.currentHealth === -1 ? initialHealthValue : data.currentHealth;

             console.log(`[target-health-behavior] Initialized target ${this.el.id || this.el.outerHTML} with health: ${this.currentHealth}`);


            // Create and attach the health text element
            this.healthTextEl = document.createElement('a-text');
            this.healthTextEl.setAttribute('value', this.currentHealth.toString());
            this.healthTextEl.setAttribute('align', 'center');
            this.healthTextEl.setAttribute('color', '#FFFFFF');
            this.healthTextEl.setAttribute('scale', '0.5 0.5 0.5');
            this.healthTextEl.setAttribute('position', '0 0.5 0');

            // Ensure the text faces the camera
            this.healthTextEl.setAttribute('look-at', '#camera');

            this.el.appendChild(this.healthTextEl);


            this.handleCollision = (e: any) => {
              const collidingEl = e.detail.target.el;

              if (collidingEl?.classList.contains('projectile') && !this.isHitting && !this.isDestroyed) {
                 // console.log(`[target-health-behavior] Collision detected on ${this.el.id || this.el.outerHTML} by projectile.`);

                this.isHitting = true; // Set debounce flag

                // Decrement health
                this.currentHealth = Math.max(0, this.currentHealth - 1); // Ensure health doesn't go below 0
                // console.log(`[target-health-behavior] Health reduced to: ${this.currentHealth}`);

                // Update health text display
                if (this.healthTextEl) {
                     this.healthTextEl.setAttribute('value', this.currentHealth.toString());
                     if (this.currentHealth <= initialHealthValue / 3 && this.currentHealth > 0) {
                         this.healthTextEl.setAttribute('color', '#FF0000'); // Red
                     } else if (this.currentHealth <= initialHealthValue / 1.5 && this.currentHealth > 0) {
                         this.healthTextEl.setAttribute('color', '#FFA500'); // Orange
                     } else {
                         this.healthTextEl.setAttribute('color', '#FFFFFF'); // White (includes 0 health or high health)
                     }
                 }

                // Remove the projectile immediately upon collision
                 if (collidingEl.parentNode) {
                    collidingEl.parentNode.removeChild(collidingEl);
                    // console.log("[target-health-behavior] Removed projectile.");
                }

                // Check if target is destroyed AFTER removing projectile
                if (this.currentHealth <= 0 && !this.isDestroyed) {
                    this.isDestroyed = true;
                    console.log(`[target-health-behavior] Target destroyed! Emitting event.`);

                    // Hide the target and text temporarily
                    this.el.setAttribute('visible', 'false');
                    if(this.healthTextEl) this.healthTextEl.setAttribute('visible', 'false');

                    // Emit event on the scene indicating destruction and points
                    this.el.sceneEl.emit('targetdestroyed', { points: data.points, targetEl: this.el });

                    // Respawn logic: wait for delay, then reset and show
                    this.respawnTimeout = setTimeout(() => {
                        console.log(`[target-health-behavior] Respawning target ${this.el.id || this.el.outerHTML}`);
                        this.resetTarget(); // Use the dedicated reset method
                    }, data.respawnDelay);

                } else {
                    // Reset debounce flag after a short delay only if target was NOT destroyed
                     setTimeout(() => {
                        this.isHitting = false;
                        // console.log("[target-health-behavior] isHitting flag reset.");
                     }, 150); // Debounce duration
                }
              }
            };

             // Method to reset target state (called from startGame or respawn timeout)
             this.resetTarget = () => {
                 console.log(`[target-health-behavior] Resetting target ${this.el.id || this.el.outerHTML}`);
                 const initialHealthValueAgain = parseInt(this.el.getAttribute('data-initial-health') as string, 10) || 5; // Re-read initial health

                 this.currentHealth = initialHealthValueAgain; // Reset health
                 this.isDestroyed = false; // Reset destroyed flag
                 this.isHitting = false; // Reset hitting flag

                 // Update health text display and make it visible again
                 if (this.healthTextEl) {
                      this.healthTextEl.setAttribute('value', this.currentHealth.toString());
                      this.healthTextEl.setAttribute('color', '#FFFFFF'); // Reset color
                      this.healthTextEl.setAttribute('visible', 'true');
                 }

                 // Make the target visible again
                 this.el.setAttribute('visible', 'true');

                 // Respawn at a random position
                 const x = (Math.random() - 0.5) * 8;
                 const y = Math.random() * 2.5 + 1;
                 const z = -Math.random() * 4 - 3;
                 this.el.setAttribute('position', `${x} ${y} ${z}`);

                 // Note: For static bodies, just setting position usually works fine with physics.
             };


            // Listen for the 'collide' event
            this.el.addEventListener('collide', this.handleCollision);
            console.log(`[target-health-behavior] Added collision listener to ${this.el.id || this.el.outerHTML}`);
          },

          remove: function() {
            console.log(`[target-health-behavior] Removing component from ${this.el.id || this.el.outerHTML}`);
            this.el.removeEventListener('collide', this.handleCollision);
            if (this.healthTextEl && this.healthTextEl.parentNode) {
                this.healthTextEl.parentNode.removeChild(this.healthTextEl);
            }
            if (this.respawnTimeout) {
                clearTimeout(this.respawnTimeout);
            }
          },

           // Add update method if attributes could change after init (not needed for this game)
           // update: function (oldData) {}
        });

        componentRegistered.current = true;
        console.log("A-Frame components registered successfully.");
      } catch (error: any) {
          console.error("Error registering A-Frame component:", error);
      }
    } else if (aframeLoaded && !window.AFRAME) {
         console.error("A-Frame scripts loaded according to state, but window.AFRAME is not defined.");
    }
  }, [aframeLoaded]);


  // Effect to listen for custom 'targetdestroyed' events from A-Frame scene
  useEffect(() => {
    const currentScene = sceneRef.current;
    if (currentScene && componentRegistered.current) {
      const sceneDestroyedListener = (event: CustomEvent) => {
        if (event.detail && typeof event.detail.points === 'number') {
             handleTargetDestroyed(event.detail.points);
        } else {
             console.warn("Received targetdestroyed event without points data:", event.detail);
        }
      };

      console.log("Adding scene event listener for 'targetdestroyed'");
      currentScene.addEventListener('targetdestroyed', sceneDestroyedListener);

      return () => {
        if (currentScene) {
             console.log("Removing scene event listener for 'targetdestroyed'");
             currentScene.removeEventListener('targetdestroyed', sceneDestroyedListener);
        }
      };
    }
  }, [handleTargetDestroyed, componentRegistered.current]);


  // --- Render ---
  return (
    <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
      {/* Loading Indicator */}
      {!aframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-800 z-50">
            Loading AR Experience... (Ensure A-Frame scripts can load)
        </div>
      )}

      {/* A-Frame Scene (Render only when loaded) */}
      {aframeLoaded && window.AFRAME && (
        <a-scene
          ref={sceneRef}
          embedded
          physics="driver: local; debug: true;" // Keep debug true for now
          loading-screen="enabled: false"
          renderer="antialias: true; colorManagement: true; physicallyCorrectLights: true;"
          vr-mode-ui="enabled: false"
          background="color: #1E293B"
        >
          {/* --- Lighting --- */}
          <a-entity light="type: ambient; color: #BBB"></a-entity>
          <a-entity light="type: directional; color: #FFF; intensity: 0.6" position="-0.5 1 1"></a-entity>
          <a-entity light="type: hemisphere; color: #FFFFFF; groundColor: #444444; intensity: 0.4"></a-entity>

          {/* --- Camera and Controls --- */}
          <a-entity id="rig" position="0 0 2" wasd-controls="fly: false; acceleration: 65;">
             <a-camera id="camera" position="0 1.6 0" look-controls="pointerLockEnabled: true; magicWindowTrackingEnabled: false">
                {/* Aiming Cursor (visible in game) */}
                <a-cursor
                    color="#FFD700"
                    scale="0.5 0.5 0.5"
                    fuse="false"
                     // Added objects attribute to satisfy raycaster warning, targeting our health component
                    raycaster="objects: [target-health-behavior];"
                    visible={gameActive ? 'true' : 'false'}
                 />
             </a-camera>
          </a-entity>

          {/* --- Targets --- */}
          <a-sphere
            position="-2 2 -5"
            radius="0.3"
            color="#ef4444" // Red
            shadow="receive: true; cast: true"
            data-points="3"
            data-initial-health="3"
            static-body="shape: sphere;"
            target-health-behavior
          ></a-sphere>

          <a-box
            position="2 1.5 -4"
            width="0.4" height="0.4" depth="0.4"
            color="#eab308" // Yellow
            shadow="receive: true; cast: true"
            data-points="2"
            data-initial-health="2"
            static-body="shape: box;"
            target-health-behavior
          ></a-box>

          <a-box
            position="0 2.5 -6"
            width="0.5" height="0.5" depth="0.5"
            color="#a855f7" // Purple
            shadow="receive: true; cast: true"
            data-points="1"
            data-initial-health="1"
            static-body="shape: box;"
            target-health-behavior
          ></a-box>

           {/* Example Ground (Optional) */}
           <a-plane
              position="0 0 -4"
              rotation="-90 0 0"
              width="20" height="20"
              color="#4A5568" // Grey
              static-body
              shadow="receive: true"
           ></a-plane>


        </a-scene>
      )}

      {/* --- Game UI Overlay --- */}
      <div className="absolute inset-0 pointer-events-none select-none z-20">
        {/* Start Screen / Loading */}
        {!gameActive && !aframeLoaded && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-auto">
               <p className="text-white text-lg animate-pulse">Loading AR Experience... (Ensure A-Frame scripts can load)</p>
            </div>
        )}
        {/* Show Start Button only when AFrame loaded and not game over */}
        {!gameActive && aframeLoaded && timeLeft > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/70 p-6 rounded-xl text-center shadow-lg">
              <h3 className="text-white text-2xl font-bold mb-3">AR Target Practice</h3>
              <p className="text-gray-300 mb-1">Use mouse to look, WASD to move.</p>
              <p className="text-gray-300 mb-4">Click anywhere to shoot.</p>
              <p className="text-yellow-300 text-lg mb-5">High Score: {highScore}</p>
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-md text-lg font-semibold"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* In-Game UI */}
        {gameActive && (
          <>
            {/* Score and Time */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow">
              <div className="flex flex-col gap-1 md:gap-2">
                <div>Score: <span className="font-bold text-yellow-300">{score}</span></div>
                <div>Time: <span className="font-bold text-red-400">{timeLeft}s</span></div>
                <div>Shots Fired: <span className="font-bold text-green-300">{shotsFired}</span></div>
                <div>Targets Hit: <span className="font-bold text-blue-300">{shotsReached}</span></div>
              </div>
            </div>

            {/* Countdown Timer */}
            {timeLeft <= 5 && timeLeft > 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-red-500 animate-ping opacity-80">
                {timeLeft}
              </div>
            )}
          </>
        )}

        {/* Game Over Screen */}
        {timeLeft === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="bg-black/70 p-6 rounded-xl text-center shadow-lg">
              <h3 className="text-white text-2xl font-bold mb-2">Game Over!</h3>
              <p className="text-gray-300 mb-1">Your final score:</p>
              <p className="text-5xl font-bold text-yellow-400 mb-4">{score}</p>
               <p className="text-gray-300 mb-1">Shots Fired: <span className="font-bold text-green-300">{shotsFired}</span></p>
              <p className="text-gray-300 mb-4">Targets Hit: <span className="font-bold text-blue-300">{shotsReached}</span></p>
              {score > highScore && score > 0 && (
                <p className="text-green-400 mb-4 text-xl animate-pulse">New High Score!</p>
              )}
               <p className="text-yellow-300 text-lg mb-5">High Score: {highScore}</p>
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-md text-lg font-semibold"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click anywhere to shoot overlay (only active during game) */}
      {gameActive && (
        <div
          className="absolute inset-0 cursor-crosshair z-10"
          onClick={shootBall}
          onTouchStart={(e) => { e.preventDefault(); shootBall(); }}
        ></div>
      )}
    </div>
  );
};

export default ARScene;