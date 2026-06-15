import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreePugCanvasProps {
  action: 'idle' | 'jump' | 'spin' | 'wag';
}

export default function ThreePugCanvas({ action }: ThreePugCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef(action);

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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.0);

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
    controls.minDistance = 2.0;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0.8, 0);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 1.4); // soft ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Soft Floor Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(28, 24, 20, 0.22)');
      gradient.addColorStop(1, 'rgba(28, 24, 20, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 64, 64);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // MODEL GROUPS
    const pugGroup = new THREE.Group();
    scene.add(pugGroup);

    // Materials
    const bodyMat = new THREE.MeshToonMaterial({ color: 0xe3c093 }); // warm beige
    const darkBrownMat = new THREE.MeshToonMaterial({ color: 0x3d2b1f }); // dark brown ears/muzzle
    const blackMat = new THREE.MeshToonMaterial({ color: 0x141414 }); // black eyes/nose
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // highlights
    const collarMat = new THREE.MeshToonMaterial({ color: 0x3182ce }); // blue collar
    const tagMat = new THREE.MeshBasicMaterial({ color: 0xd69e2e }); // gold tag

    // 1. Body
    const bodyGeom = new THREE.SphereGeometry(0.8, 32, 32);
    bodyGeom.scale(1, 0.76, 1.32); // egg shape
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.72;
    pugGroup.add(body);

    // 2. Head
    const headGeom = new THREE.SphereGeometry(0.62, 32, 32);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 1.34, 0.4);
    pugGroup.add(head);

    // 3. Muzzle (Snout)
    const muzzleGeom = new THREE.BoxGeometry(0.42, 0.28, 0.3);
    const muzzle = new THREE.Mesh(muzzleGeom, darkBrownMat);
    muzzle.position.set(0, 1.25, 0.88);
    pugGroup.add(muzzle);

    // 4. Nose
    const noseGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const nose = new THREE.Mesh(noseGeom, blackMat);
    nose.position.set(0, 1.32, 1.03);
    pugGroup.add(nose);

    // 5. Eyes
    const eyeGeom = new THREE.SphereGeometry(0.11, 16, 16);
    
    const leftEye = new THREE.Mesh(eyeGeom, blackMat);
    leftEye.position.set(-0.24, 1.42, 0.86);
    pugGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeom, blackMat);
    rightEye.position.set(0.24, 1.42, 0.86);
    pugGroup.add(rightEye);

    // Eye Highlights
    const pupilGeom = new THREE.SphereGeometry(0.04, 8, 8);
    
    const leftPupil = new THREE.Mesh(pupilGeom, whiteMat);
    leftPupil.position.set(-0.26, 1.46, 0.96);
    pugGroup.add(leftPupil);
    
    const rightPupil = new THREE.Mesh(pupilGeom, whiteMat);
    rightPupil.position.set(0.22, 1.46, 0.96);
    pugGroup.add(rightPupil);

    // 6. Ears
    const earGeom = new THREE.BoxGeometry(0.2, 0.35, 0.08);
    
    const leftEar = new THREE.Mesh(earGeom, darkBrownMat);
    leftEar.position.set(-0.55, 1.46, 0.4);
    leftEar.rotation.z = 0.3;
    leftEar.rotation.x = 0.2;
    pugGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeom, darkBrownMat);
    rightEar.position.set(0.55, 1.46, 0.4);
    rightEar.rotation.z = -0.3;
    rightEar.rotation.x = 0.2;
    pugGroup.add(rightEar);

    // 7. Collar
    const collarGeom = new THREE.CylinderGeometry(0.48, 0.52, 0.12, 24);
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 1.06, 0.32);
    collar.rotation.x = 0.25;
    pugGroup.add(collar);

    // Gold Tag
    const tagGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 16);
    tagGeom.rotateX(Math.PI / 2);
    const tag = new THREE.Mesh(tagGeom, tagMat);
    tag.position.set(0, 0.92, 0.64);
    pugGroup.add(tag);

    // 8. Legs
    const legGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
    
    const leftFrontLeg = new THREE.Mesh(legGeom, bodyMat);
    leftFrontLeg.position.set(-0.3, 0.25, 0.4);
    pugGroup.add(leftFrontLeg);

    const rightFrontLeg = new THREE.Mesh(legGeom, bodyMat);
    rightFrontLeg.position.set(0.3, 0.25, 0.4);
    pugGroup.add(rightFrontLeg);

    const leftBackLeg = new THREE.Mesh(legGeom, bodyMat);
    leftBackLeg.position.set(-0.3, 0.25, -0.4);
    pugGroup.add(leftBackLeg);

    const rightBackLeg = new THREE.Mesh(legGeom, bodyMat);
    rightBackLeg.position.set(0.3, 0.25, -0.4);
    pugGroup.add(rightBackLeg);

    // 9. Tail Group
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.9, -0.8);
    pugGroup.add(tailGroup);

    const tailGeom = new THREE.TorusGeometry(0.15, 0.05, 8, 24, Math.PI * 1.6);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.rotation.y = Math.PI / 2;
    tailGroup.add(tail);

    // 10. Bowl
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(0, 0.08, 1.05);
    
    const bowlOuterGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.16, 24);
    const bowlMatObj = new THREE.MeshToonMaterial({ color: 0xdd6b20 });
    const bowlOuterReal = new THREE.Mesh(bowlOuterGeom, bowlMatObj);
    bowlGroup.add(bowlOuterReal);

    // Kibbles
    const kibbleGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const kibbleMat = new THREE.MeshBasicMaterial({ color: 0x5c3d24 });
    for (let i = 0; i < 6; i++) {
      const kibble = new THREE.Mesh(kibbleGeom, kibbleMat);
      kibble.position.set((Math.random() - 0.5) * 0.16, 0.08, (Math.random() - 0.5) * 0.16);
      bowlGroup.add(kibble);
    }
    pugGroup.add(bowlGroup);

    // ANIMATION CONTROL LOOP
    const clock = new THREE.Clock();
    let animationState = {
      type: 'idle',
      elapsed: 0,
      duration: 1.0
    };

    let prevAction = action;

    const checkActionTrigger = () => {
      const currentAction = actionRef.current;
      if (currentAction !== prevAction) {
        if (currentAction !== 'idle') {
          animationState.type = currentAction;
          animationState.elapsed = 0;
          if (currentAction === 'jump') animationState.duration = 0.5;
          else if (currentAction === 'spin') animationState.duration = 0.5;
          else if (currentAction === 'wag') animationState.duration = 0.8;
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
      pugGroup.position.y = 0;
      pugGroup.rotation.y = 0;
      tailGroup.rotation.y = 0;
      body.scale.set(1, 0.76, 1.32);
      head.position.y = 1.34;

      if (animationState.type !== 'idle') {
        animationState.elapsed += delta;
        const progress = Math.min(1, animationState.elapsed / animationState.duration);
        
        if (animationState.type === 'jump') {
          // Jump arc
          const jumpY = Math.sin(progress * Math.PI) * 0.7;
          const squashStretch = 1 + Math.sin(progress * Math.PI * 2) * 0.08;
          pugGroup.position.y = jumpY;
          body.scale.set(1, 0.76 * squashStretch, 1.32);
          head.position.y = 1.34 + (squashStretch - 1) * 0.2;
        } else if (animationState.type === 'spin') {
          // Spin 360
          pugGroup.rotation.y = progress * Math.PI * 2;
        } else if (animationState.type === 'wag') {
          // Rapid tail wag
          tailGroup.rotation.y = Math.sin(animationState.elapsed * 45) * 0.55;
        }

        if (progress >= 1) {
          animationState.type = 'idle';
        }
      } else {
        // Idle gentle breathing + tail sway
        tailGroup.rotation.y = Math.sin(time * 3) * 0.1;
        const breath = 0.76 + Math.sin(time * 2.2) * 0.01;
        body.scale.set(1, breath, 1.32);
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full animate-fade-in" />;
}
