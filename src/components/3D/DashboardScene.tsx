
import { useEffect, useState, useRef, MutableRefObject } from "react";
import * as THREE from "three";
import { useTheme } from "@/hooks/use-theme";

interface Stat {
  label: string;
  value: number;
  icon: string;
}

interface DashboardSceneProps {
  stats: Stat[];
  containerRef: MutableRefObject<HTMLDivElement | null>;
  isClient?: boolean;
}

const DashboardScene = ({ stats, containerRef, isClient = false }: DashboardSceneProps) => {
  const { theme } = useTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || initialized) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 15;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Set background color based on theme
    scene.background = new THREE.Color(
      theme === 'dark' ? 0x111111 : 0xf8f9fa
    );

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Point Light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Add stats visualization objects
    createVisualization(stats, isClient);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    setInitialized(true);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      objectsRef.current.forEach((obj, i) => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
        
        // Make objects float slightly
        obj.position.y = Math.sin(Date.now() * 0.001 + i) * 0.2;
      });
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (objectsRef.current) {
        objectsRef.current.forEach(obj => {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
          } else {
            obj.material.dispose();
          }
        });
      }
      
      objectsRef.current = [];
      rendererRef.current?.dispose();
    };
  }, [containerRef, stats, theme, isClient, initialized]);

  // Update scene background when theme changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(
        theme === 'dark' ? 0x111111 : 0xf8f9fa
      );
    }
  }, [theme]);

  // Create visual elements based on stats
  const createVisualization = (stats: Stat[], isClient: boolean) => {
    if (!sceneRef.current) return;
    
    // Clear previous objects
    if (objectsRef.current.length > 0) {
      objectsRef.current.forEach(obj => {
        if (sceneRef.current) {
          sceneRef.current.remove(obj);
        }
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(material => material.dispose());
        } else {
          obj.material.dispose();
        }
      });
      objectsRef.current = [];
    }
    
    // Colors based on user type
    const colors = isClient 
      ? [0x4c6ef5, 0x40c057, 0xfa5252, 0xfcc419] 
      : [0x7950f2, 0x228be6, 0x12b886, 0xe64980];
    
    // Position objects in a circular pattern
    const radius = 6;
    const shapes: THREE.BufferGeometry[] = [];
    
    // Create different shapes based on icon type
    stats.forEach((_, i) => {
      switch (stats[i].icon) {
        case 'project':
          shapes.push(new THREE.BoxGeometry(1.5, 1.5, 1.5));
          break;
        case 'application':
          shapes.push(new THREE.OctahedronGeometry(1));
          break;
        case 'money':
          shapes.push(new THREE.TorusGeometry(1, 0.3, 16, 32));
          break;
        case 'star':
        case 'active':
          shapes.push(new THREE.IcosahedronGeometry(1));
          break;
        default:
          shapes.push(new THREE.SphereGeometry(1, 32, 32));
      }
    });
    
    // Create meshes and add to scene
    stats.forEach((stat, i) => {
      const angle = (i / stats.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Create a material with the appropriate color
      const material = new THREE.MeshStandardMaterial({ 
        color: colors[i % colors.length],
        roughness: 0.7,
        metalness: 0.2
      });
      
      const mesh = new THREE.Mesh(shapes[i], material);
      mesh.position.set(x, 0, z);
      mesh.userData = { stat };
      
      sceneRef.current?.add(mesh);
      objectsRef.current.push(mesh);
      
      // Add text label
      const size = stat.value.toString().length > 3 ? 3 : (stat.value > 99 ? 2 : 1.5);
      createTextLabel(stat, x, -1.5, z, size, colors[i % colors.length]);
    });
  };
  
  // Create floating text labels for each stat
  const createTextLabel = (
    stat: Stat, 
    x: number, 
    y: number, 
    z: number, 
    size: number,
    color: number
  ) => {
    if (!sceneRef.current) return;
    
    // Create a canvas for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = 256;
    canvas.height = 128;
    
    // Draw background
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    context.font = '64px Arial';
    context.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Format the value for display
    let displayValue = stat.value.toString();
    if (stat.icon === 'money') {
      displayValue = `$${stat.value}`;
    } else if (stat.icon === 'star') {
      displayValue = `${stat.value}/5`;
    }
    
    context.fillText(displayValue, canvas.width / 2, canvas.height / 2);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create a material with the texture
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    // Create a plane geometry for the label
    const geometry = new THREE.PlaneGeometry(size, size * 0.5);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position the label
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    
    sceneRef.current.add(mesh);
    objectsRef.current.push(mesh);
  };

  return null; // The scene is appended directly to the container
};

export default DashboardScene;
