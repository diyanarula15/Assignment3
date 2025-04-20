import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../contexts/PortfolioContext';

interface ObjectDetailsProps {
  name: string;
  description: string;
  color: string;
  visible: boolean;
  position: { x: number; y: number };
}

const ObjectDetails: React.FC<ObjectDetailsProps> = ({ name, description, color, visible, position }) => {
  if (!visible) return null;
  
  return (
    <div 
      className="absolute pointer-events-none px-4 py-2 rounded-lg shadow-lg z-10 w-48 text-white text-center"
      style={{ 
        backgroundColor: color, 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)',
        opacity: 0.9
      }}
    >
      <p className="font-bold text-sm">{name}</p>
      <p className="text-xs">{description}</p>
    </div>
  );
};

interface BoxProps {
  position: [number, number, number];
  color: string;
  size?: [number, number, number];
  speed?: number;
  onClick?: () => void;
  onHover?: (event: ThreeEvent<PointerEvent>, hover: boolean, position?: { x: number, y: number }) => void;
}

const Box: React.FC<BoxProps> = ({ position, color, size = [1, 1, 1], speed = 0.01, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const coords = {
      x: event.pointer.x * window.innerWidth / 2 + window.innerWidth / 2,
      y: event.pointer.y * window.innerHeight / 2 + window.innerHeight / 2
    };
    setHovered(true);
    if (onHover) onHover(event, true, coords);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    if (onHover) onHover(event, false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh 
      position={position} 
      ref={meshRef}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.1 : 1}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color={hovered ? "#ffffff" : color} wireframe={hovered} />
    </mesh>
  );
};

interface SphereProps {
  position: [number, number, number];
  color: string;
  radius?: number;
  speed?: number;
  onClick?: () => void;
  onHover?: (event: ThreeEvent<PointerEvent>, hover: boolean, position?: { x: number, y: number }) => void;
}

const Sphere: React.FC<SphereProps> = ({ position, color, radius = 1, speed = 0.01, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.5;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const coords = {
      x: event.pointer.x * window.innerWidth / 2 + window.innerWidth / 2,
      y: event.pointer.y * window.innerHeight / 2 + window.innerHeight / 2
    };
    setHovered(true);
    if (onHover) onHover(event, true, coords);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    if (onHover) onHover(event, false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh 
      position={position} 
      ref={meshRef}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.1 : 1}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#ffffff" : color} />
    </mesh>
  );
};

interface IcosahedronProps {
  position: [number, number, number];
  color: string;
  radius?: number;
  speed?: number;
  onClick?: () => void;
  onHover?: (event: ThreeEvent<PointerEvent>, hover: boolean, position?: { x: number, y: number }) => void;
}

const Icosahedron: React.FC<IcosahedronProps> = ({ position, color, radius = 1, speed = 0.01, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.3;
      meshRef.current.rotation.y += speed;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const coords = {
      x: event.pointer.x * window.innerWidth / 2 + window.innerWidth / 2,
      y: event.pointer.y * window.innerHeight / 2 + window.innerHeight / 2
    };
    setHovered(true);
    if (onHover) onHover(event, true, coords);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    if (onHover) onHover(event, false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh 
      position={position} 
      ref={meshRef}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.1 : 1}
    >
      <icosahedronGeometry args={[radius, 0]} />
      <meshStandardMaterial color={color} wireframe={true} />
    </mesh>
  );
};

interface RingProps {
  position: [number, number, number];
  color: string;
  innerRadius?: number;
  outerRadius?: number;
  rotation?: [number, number, number];
  onClick?: () => void;
  onHover?: (event: ThreeEvent<PointerEvent>, hover: boolean, position?: { x: number, y: number }) => void;
}

const Ring: React.FC<RingProps> = ({ 
  position, 
  color, 
  innerRadius = 0.5, 
  outerRadius = 1,
  rotation = [0, 0, 0],
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = rotation[1] + clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.z = rotation[2];
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const coords = {
      x: event.pointer.x * window.innerWidth / 2 + window.innerWidth / 2,
      y: event.pointer.y * window.innerHeight / 2 + window.innerHeight / 2
    };
    setHovered(true);
    if (onHover) onHover(event, true, coords);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    if (onHover) onHover(event, false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh 
      position={position} 
      ref={meshRef}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.1 : 1}
    >
      <ringGeometry args={[innerRadius, outerRadius, 32]} />
      <meshStandardMaterial color={hovered ? "#ffffff" : color} side={THREE.DoubleSide} />
    </mesh>
  );
};

interface PortalProps {
  position: [number, number, number];
  color: string;
  onClick?: () => void;
  onHover?: (event: ThreeEvent<PointerEvent>, hover: boolean, position?: { x: number, y: number }) => void;
}

const Portal: React.FC<PortalProps> = ({ position, color, onClick, onHover }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      
      if (hovered) {
        groupRef.current.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh;
          if (mesh.position && mesh.scale) {
            mesh.position.y = Math.sin(clock.getElapsedTime() * 2 + i) * 0.1;
            mesh.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.05);
          }
        });
      }
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const coords = {
      x: event.pointer.x * window.innerWidth / 2 + window.innerWidth / 2,
      y: event.pointer.y * window.innerHeight / 2 + window.innerHeight / 2
    };
    setHovered(true);
    if (onHover) onHover(event, true, coords);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    setHovered(false);
    if (onHover) onHover(event, false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      position={position} 
      ref={groupRef}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : color} emissive={color} emissiveIntensity={hovered ? 2 : 0.5} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

const Particles: React.FC<{ count: number, color: string }> = ({ count, color }) => {
  const points = useRef<THREE.Points>(null!);
  
  useEffect(() => {
    if (points.current) {
      points.current.rotation.x = Math.random() * Math.PI;
      points.current.rotation.y = Math.random() * Math.PI;
    }
  }, []);
  
  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.001;
    }
  });

  const particlesPosition = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    particlesPosition[i3] = (Math.random() - 0.5) * 10;
    particlesPosition[i3 + 1] = (Math.random() - 0.5) * 10;
    particlesPosition[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={particlesPosition}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color={color} sizeAttenuation />
    </points>
  );
};

const Scene: React.FC = () => {
  const navigate = useNavigate();
  const { setActivePage, soundEnabled } = usePortfolio();
  const [hoveredObject, setHoveredObject] = useState<{
    name: string;
    description: string;
    color: string;
    visible: boolean;
    position: { x: number; y: number };
  } | null>(null);
  
  const handleProjectClick = (projectName: string, route: string) => {
    if (soundEnabled) {
      const clickSound = new Audio('/click-sound.mp3');
      clickSound.volume = 0.2;
      clickSound.play();
    }
    
    toast(`Exploring ${projectName}`, {
      description: "Navigating to related section...",
      duration: 2000,
    });
    
    setTimeout(() => {
      navigate(route);
      setActivePage(route.substring(1));
    }, 800);
  };

  const handleObjectHover = (
    name: string,
    description: string,
    color: string,
    event: ThreeEvent<PointerEvent>,
    hover: boolean,
    position?: { x: number; y: number }
  ) => {
    if (hover && position) {
      if (soundEnabled) {
        const hoverSound = new Audio('/hover-sound.mp3');
        hoverSound.volume = 0.1;
        hoverSound.play();
      }
      
      setHoveredObject({
        name,
        description,
        color,
        visible: true,
        position
      });
    } else {
      setHoveredObject(null);
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      <Icosahedron 
        position={[-3, 0, 0]} 
        color="#3b82f6" 
        radius={1.5} 
        speed={0.005} 
        onClick={() => handleProjectClick("Programming Skills", "/about")}
        onHover={(event, hover, position) => 
          handleObjectHover(
            "Blue Icosahedron", 
            "Represents interconnected systems and programming concepts in my projects", 
            "#3b82f6", 
            event, 
            hover, 
            position
          )
        }
      />
      <Sphere 
        position={[3, -1, -2]} 
        color="#ef4444" 
        radius={1} 
        speed={0.01} 
        onClick={() => handleProjectClick("Angry Birds Project", "/projects")}
        onHover={(event, hover, position) => 
          handleObjectHover(
            "Red Sphere", 
            "Explore my game development projects like Angry Birds", 
            "#ef4444", 
            event, 
            hover, 
            position
          )
        }
      />
      <Box 
        position={[2, 1, 0]} 
        color="#eab308" 
        size={[0.8, 0.8, 0.8]} 
        speed={0.02} 
        onClick={() => handleProjectClick("Directory Management System", "/projects")}
        onHover={(event, hover, position) => 
          handleObjectHover(
            "Yellow Cubes", 
            "Discover my software development projects", 
            "#eab308", 
            event, 
            hover, 
            position
          )
        }
      />
      <Ring 
        position={[0, 0, -1]} 
        color="#a855f7" 
        innerRadius={1.8} 
        outerRadius={2} 
        rotation={[Math.PI / 4, 0, 0]} 
        onClick={() => handleProjectClick("Project Hub", "/contact")}
        onHover={(event, hover, position) => 
          handleObjectHover(
            "Purple Ring", 
            "Learn more about my networking projects and contact info", 
            "#a855f7", 
            event, 
            hover, 
            position
          )
        }
      />
      
      <Portal
        position={[0, 2, -3]}
        color="#22c55e"
        onClick={() => handleProjectClick("Mixed Reality Demo", "/projects")}
        onHover={(event, hover, position) => 
          handleObjectHover(
            "Green Portal", 
            "Try the interactive Mixed Reality demo", 
            "#22c55e", 
            event, 
            hover, 
            position
          )
        }
      />
      
      <Particles count={100} color="#ef4444" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        enableRotate={true}
        zoomSpeed={0.6}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const ThreeJSModel: React.FC = () => {
  const [hoveredObject, setHoveredObject] = useState<{
    name: string;
    description: string;
    color: string;
    visible: boolean;
    position: { x: number; y: number };
  } | null>(null);
  
  return (
    <div className="relative w-full h-full">
      {hoveredObject && (
        <ObjectDetails
          name={hoveredObject.name}
          description={hoveredObject.description}
          color={hoveredObject.color}
          visible={hoveredObject.visible}
          position={hoveredObject.position}
        />
      )}
      <Canvas
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeJSModel;
