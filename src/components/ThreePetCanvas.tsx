import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ThreePetCanvasProps {
  modelPath: string;
  action: 'idle' | 'jump' | 'spin' | 'wag';
}

export default function ThreePetCanvas({ modelPath, action }: ThreePetCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef(action);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Sync action prop changes to the ref for the render loop
  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 256;
    const height = container.clientHeight || 256;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    // CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.8);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0.65, 0);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.5); // rich ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Warm Rim Light for edge highlights
    const rimLight = new THREE.DirectionalLight(0xfff3e0, 2.0);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    // Shadow Receiver Ground Plane
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.005;
    floor.receiveShadow = true;
    scene.add(floor);

    // Soft Contact Shadow Plane under model
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(28, 22, 18, 0.28)');
      gradient.addColorStop(1, 'rgba(28, 22, 18, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.001;
    scene.add(shadowPlane);

    // GLB MODEL LOADING
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const loader = new GLTFLoader();
    let loadedScene: THREE.Group | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        loadedScene = gltf.scene;

        // Bounding box automatic scaling and centering
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        // target height of ~1.3 units
        const scale = 1.3 / maxDim;
        loadedScene.scale.set(scale, scale, scale);
        
        // Center the model's geometry and align bottom to y=0
        loadedScene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

        // Enable shadows and tweak materials
        loadedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Adjust materials to react beautifully to our studio lighting
            if (mesh.material && !(mesh.material instanceof Array)) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.roughness !== undefined) {
                mat.roughness = Math.max(mat.roughness, 0.45); // avoid plastic sheen
              }
            }
          }
        });

        modelGroup.add(loadedScene);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        } else {
          // Fallback if total content length header is missing
          setLoadingProgress((prev) => Math.min(prev + 5, 95));
        }
      },
      (error) => {
        console.error('Error loading pug 3D GLB model:', error);
        setHasError(true);
        setIsLoading(false);
      }
    );

    // ANIMATIONS
    const clock = new THREE.Clock();
    
    interface AnimState {
      type: 'idle' | 'jump' | 'spin' | 'wag';
      elapsed: number;
      duration: number;
    }
    
    const animationState: AnimState = {
      type: 'idle',
      elapsed: 0,
      duration: 1.0,
    };

    let prevAction = actionRef.current;

    const checkActionTrigger = () => {
      const currentAction = actionRef.current;
      if (currentAction !== prevAction) {
        if (currentAction !== 'idle') {
          animationState.type = currentAction;
          animationState.elapsed = 0;
          if (currentAction === 'jump') animationState.duration = 0.65;
          else if (currentAction === 'spin') animationState.duration = 0.65;
          else if (currentAction === 'wag') animationState.duration = 1.0;
        }
        prevAction = currentAction;
      }
    };

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      checkActionTrigger();

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      
      // Reset defaults
      modelGroup.position.set(0, 0, 0);
      modelGroup.rotation.set(0, 0, 0);
      modelGroup.scale.set(1, 1, 1);

      if (animationState.type !== 'idle') {
        animationState.elapsed += delta;
        const progress = Math.min(1, animationState.elapsed / animationState.duration);
        
        if (animationState.type === 'jump') {
          // Jump arc (sine wave height) with squash and stretch scaling
          const jumpHeight = Math.sin(progress * Math.PI) * 0.75;
          modelGroup.position.y = jumpHeight;
          
          // Squash when launching/landing, stretch in mid-air
          const stretch = 1 + Math.sin(progress * Math.PI * 2) * 0.08;
          const squash = 1 - Math.sin(progress * Math.PI * 2) * 0.04;
          modelGroup.scale.set(squash, stretch, squash);
        } else if (animationState.type === 'spin') {
          // 360 spin
          modelGroup.rotation.y = progress * Math.PI * 2;
        } else if (animationState.type === 'wag') {
          // Playful body wiggle (since model is solid GLB, wiggle whole dog back & forth)
          modelGroup.rotation.y = Math.sin(animationState.elapsed * 30) * 0.28;
          modelGroup.position.x = Math.sin(animationState.elapsed * 30) * 0.06;
        }

        if (progress >= 1) {
          animationState.type = 'idle';
        }
      } else {
        // Idle breathing (gentle scale Y) + micro-movement
        const breathing = 1.0 + Math.sin(time * 2.5) * 0.012;
        modelGroup.scale.set(1.0, breathing, 1.0);
        // Gentle looking around rotation
        modelGroup.rotation.y = Math.sin(time * 0.8) * 0.05;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      
      if (loadedScene) {
        (loadedScene as THREE.Group).traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => mat.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      }
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-stone-100/10 rounded-2xl overflow-hidden border border-stone-200/40">
      <div ref={containerRef} className="w-full h-full animate-fade-in" />
      
      {/* Sleek Glassmorphic Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md flex flex-col items-center justify-center z-30 transition-all duration-500">
          <div className="flex flex-col items-center max-w-[200px] w-full text-center space-y-4">
            {/* Spinning Loader */}
            <div className="w-10 h-10 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin" />
            <div className="space-y-1 w-full">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Loading 3D Model</p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E87A5D] transition-all duration-300 rounded-full" 
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-[10px] text-stone-400 font-mono">{loadingProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30 p-4 text-center">
          <span className="text-xl">⚠️</span>
          <p className="text-xs font-bold text-white uppercase mt-2">Could not load 3D model</p>
          <p className="text-[10px] text-stone-400 mt-1 max-w-[240px]">Verify pug_3d.glb exists in public folder.</p>
        </div>
      )}
    </div>
  );
}
