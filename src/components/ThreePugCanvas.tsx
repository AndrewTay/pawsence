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
    controls.minDistance = 1.8;
    controls.maxDistance = 5.5;
    controls.target.set(0, 0.8, 0);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.3); // soft ambient light
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; // double resolution shadows
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Warm Rim Light for professional studio edge glow
    const rimLight = new THREE.DirectionalLight(0xfff3e0, 1.6);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);


    // Shadow Receiver Ground Plane
    const floorGeo = new THREE.PlaneGeometry(8, 8);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.005;
    floor.receiveShadow = true;
    scene.add(floor);

    // Soft Contact Shadow Plane (additional baseline glow shadow)
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(28, 22, 18, 0.24)');
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

    // MODEL GROUPS
    const pugGroup = new THREE.Group();
    scene.add(pugGroup);

    // Materials (High quality standard materials)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0xe5c39b, // warmer, organic beige fur
      roughness: 0.9,  // velvety texture
      metalness: 0.0
    });
    const darkBrownMat = new THREE.MeshStandardMaterial({ 
      color: 0x3a2518, // deep rich chocolate brown
      roughness: 0.85,
      metalness: 0.0
    });
    const blackMat = new THREE.MeshStandardMaterial({ 
      color: 0x161616, 
      roughness: 0.5, // satin snout and nose
      metalness: 0.1
    });
    const glossyEyeMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      roughness: 0.05, // highly reflective eyes
      metalness: 0.1
    });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // eye highlights
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xff94a6,
      roughness: 0.6
    });
    const collarMat = new THREE.MeshStandardMaterial({ 
      color: 0x3182ce, // vibrant blue leather look
      roughness: 0.3,
      metalness: 0.1
    });
    const tagMat = new THREE.MeshStandardMaterial({ 
      color: 0xeab308, 
      roughness: 0.1,
      metalness: 0.95 // gold metallic look
    });

    // 1. Chubby Torso & Chest (smooth capsule + broad chest sphere)
    const bodyGeom = new THREE.CapsuleGeometry(0.52, 0.72, 32, 64);
    bodyGeom.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.75, -0.05); // shifted back slightly for chest
    body.castShadow = true;
    body.receiveShadow = true;
    pugGroup.add(body);

    const chestGeom = new THREE.SphereGeometry(0.56, 32, 32);
    const chest = new THREE.Mesh(chestGeom, bodyMat);
    chest.scale.set(1.05, 0.95, 1.15);
    chest.position.set(0, 0.85, 0.22);
    chest.castShadow = true;
    chest.receiveShadow = true;
    pugGroup.add(chest);

    // Chubby neck skin rolls/folds
    const neckRoll1Geom = new THREE.TorusGeometry(0.48, 0.08, 16, 48);
    const neckRoll1 = new THREE.Mesh(neckRoll1Geom, bodyMat);
    neckRoll1.position.set(0, 1.05, 0.28);
    neckRoll1.rotation.x = Math.PI / 2 + 0.2;
    neckRoll1.scale.set(1.05, 0.9, 0.8);
    neckRoll1.castShadow = true;
    pugGroup.add(neckRoll1);

    const neckRoll2Geom = new THREE.TorusGeometry(0.44, 0.06, 16, 48);
    const neckRoll2 = new THREE.Mesh(neckRoll2Geom, bodyMat);
    neckRoll2.position.set(0, 1.15, 0.32);
    neckRoll2.rotation.x = Math.PI / 2 + 0.2;
    neckRoll2.scale.set(1.05, 0.9, 0.8);
    neckRoll2.castShadow = true;
    pugGroup.add(neckRoll2);

    // 2. Head Group (All facial features move with the head)
    const head = new THREE.Group();
    head.position.set(0, 1.34, 0.42);
    pugGroup.add(head);

    // Skull Mesh
    const headGeom = new THREE.SphereGeometry(0.56, 32, 32);
    const headMesh = new THREE.Mesh(headGeom, bodyMat);
    headMesh.scale.set(1.05, 0.98, 1.02); // squashed round head
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    head.add(headMesh);

    // 3. Snout & Chubby Jowls & Chin
    const snoutGroup = new THREE.Group();
    snoutGroup.position.set(0, -0.09, 0.46);
    head.add(snoutGroup);

    // Rounded muzzle sphere
    const muzzleGeom = new THREE.SphereGeometry(0.24, 32, 32);
    const muzzle = new THREE.Mesh(muzzleGeom, darkBrownMat);
    muzzle.scale.set(1.2, 0.8, 0.9);
    muzzle.castShadow = true;
    snoutGroup.add(muzzle);

    // Left chubby jowl
    const leftJowl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), darkBrownMat);
    leftJowl.position.set(-0.11, -0.04, 0.05);
    leftJowl.scale.set(1, 1, 0.85);
    leftJowl.castShadow = true;
    snoutGroup.add(leftJowl);

    // Right chubby jowl
    const rightJowl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 32), darkBrownMat);
    rightJowl.position.set(0.11, -0.04, 0.05);
    rightJowl.scale.set(1, 1, 0.85);
    rightJowl.castShadow = true;
    snoutGroup.add(rightJowl);

    // Chin (Beige lower jaw)
    const chin = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), bodyMat);
    chin.position.set(0, -0.12, 0.02);
    chin.scale.set(1.1, 0.8, 0.8);
    chin.castShadow = true;
    snoutGroup.add(chin);

    // Nose Button & Nostrils (satin black)
    const noseGroup = new THREE.Group();
    noseGroup.position.set(0, -0.02, 0.6);
    head.add(noseGroup);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), blackMat);
    nose.scale.set(1.3, 0.8, 0.9);
    nose.castShadow = true;
    noseGroup.add(nose);

    const leftNostril = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), glossyEyeMat);
    leftNostril.position.set(-0.028, -0.01, 0.045);
    noseGroup.add(leftNostril);

    const rightNostril = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), glossyEyeMat);
    rightNostril.position.set(0.028, -0.01, 0.045);
    noseGroup.add(rightNostril);

    // Pink Tongue
    const tongueGeom = new THREE.SphereGeometry(0.07, 16, 16);
    tongueGeom.scale(1, 0.4, 1.3);
    const tongue = new THREE.Mesh(tongueGeom, pinkMat);
    tongue.position.set(0, -0.2, 0.52);
    tongue.rotation.x = 0.1;
    tongue.castShadow = true;
    head.add(tongue);

    // 4. Multiple Forehead Wrinkle Folds (characteristic W-wrinkle pattern)
    const wrinkleGroup = new THREE.Group();
    wrinkleGroup.position.set(0, 0.08, 0.46);
    head.add(wrinkleGroup);

    const wrinkle1 = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 12, 24, Math.PI * 0.8), darkBrownMat);
    wrinkle1.scale.set(1, 0.5, 1);
    wrinkle1.rotation.set(0.25, 0, -Math.PI / 2);
    wrinkleGroup.add(wrinkle1);

    const wrinkle2 = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 12, 24, Math.PI * 0.8), darkBrownMat);
    wrinkle2.position.set(0, 0.12, -0.03);
    wrinkle2.scale.set(1, 0.5, 1);
    wrinkle2.rotation.set(0.25, 0, -Math.PI / 2);
    wrinkleGroup.add(wrinkle2);

    const wrinkle3 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 12, 24, Math.PI * 0.6), darkBrownMat);
    wrinkle3.position.set(0, 0.22, -0.08);
    wrinkle3.scale.set(1, 0.5, 1);
    wrinkle3.rotation.set(0.25, 0, -Math.PI / 2);
    wrinkleGroup.add(wrinkle3);

    // Eyebrows (expressive cylinders)
    const leftEyebrow = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 8, 16), darkBrownMat);
    leftEyebrow.position.set(-0.22, 0.22, 0.42);
    leftEyebrow.rotation.set(0.1, 0.2, 0.35);
    leftEyebrow.castShadow = true;
    head.add(leftEyebrow);

    const rightEyebrow = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 8, 16), darkBrownMat);
    rightEyebrow.position.set(0.22, 0.22, 0.42);
    rightEyebrow.rotation.set(0.1, -0.2, -0.35);
    rightEyebrow.castShadow = true;
    head.add(rightEyebrow);

    // 5. Large Glossy Eyes with 3D Eyelids
    const eyeGeom = new THREE.SphereGeometry(0.11, 32, 32);

    // Left Eye Group
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.25, 0.08, 0.43);
    head.add(leftEyeGroup);

    const leftEye = new THREE.Mesh(eyeGeom, glossyEyeMat);
    leftEye.castShadow = true;
    leftEyeGroup.add(leftEye);

    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), whiteMat);
    leftPupil.position.set(-0.03, 0.04, 0.09);
    leftEyeGroup.add(leftPupil);

    const leftSubPupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), whiteMat);
    leftSubPupil.position.set(0.05, -0.04, 0.09);
    leftEyeGroup.add(leftSubPupil);

    // Left Eyelids
    const leftUpperLid = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 8, 24, Math.PI), bodyMat);
    leftUpperLid.position.set(0, 0, 0.02);
    leftUpperLid.rotation.set(-0.2, 0.2, 0.1);
    leftEyeGroup.add(leftUpperLid);

    const leftLowerLid = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.02, 8, 24, Math.PI), bodyMat);
    leftLowerLid.position.set(0, 0, 0.02);
    leftLowerLid.rotation.set(2.8, 0.2, 0.1);
    leftEyeGroup.add(leftLowerLid);

    // Right Eye Group
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.25, 0.08, 0.43);
    head.add(rightEyeGroup);

    const rightEye = new THREE.Mesh(eyeGeom, glossyEyeMat);
    rightEye.castShadow = true;
    rightEyeGroup.add(rightEye);

    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), whiteMat);
    rightPupil.position.set(-0.03, 0.04, 0.09); // same light source direction
    rightEyeGroup.add(rightPupil);

    const rightSubPupil = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), whiteMat);
    rightSubPupil.position.set(0.05, -0.04, 0.09);
    rightEyeGroup.add(rightSubPupil);

    // Right Eyelids
    const rightUpperLid = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 8, 24, Math.PI), bodyMat);
    rightUpperLid.position.set(0, 0, 0.02);
    rightUpperLid.rotation.set(-0.2, -0.2, -0.1);
    rightEyeGroup.add(rightUpperLid);

    const rightLowerLid = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.02, 8, 24, Math.PI), bodyMat);
    rightLowerLid.position.set(0, 0, 0.02);
    rightLowerLid.rotation.set(2.8, -0.2, -0.1);
    rightEyeGroup.add(rightLowerLid);

    // 6. Floppy button ears (multi-mesh for realistic folding)
    const leftEarGroup = new THREE.Group();
    leftEarGroup.position.set(-0.52, 0.12, 0.0);
    head.add(leftEarGroup);

    const leftEarBase = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), darkBrownMat);
    leftEarBase.position.set(0, 0.1, 0);
    leftEarGroup.add(leftEarBase);

    const leftEarFlap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), darkBrownMat);
    leftEarFlap.position.set(-0.02, -0.04, 0.08);
    leftEarFlap.scale.set(0.8, 1.3, 0.5);
    leftEarFlap.rotation.set(0.3, 0.15, 0.4);
    leftEarFlap.castShadow = true;
    leftEarGroup.add(leftEarFlap);

    const rightEarGroup = new THREE.Group();
    rightEarGroup.position.set(0.52, 0.12, 0.0);
    head.add(rightEarGroup);

    const rightEarBase = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), darkBrownMat);
    rightEarBase.position.set(0, 0.1, 0);
    rightEarGroup.add(rightEarBase);

    const rightEarFlap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 32), darkBrownMat);
    rightEarFlap.position.set(0.02, -0.04, 0.08);
    rightEarFlap.scale.set(0.8, 1.3, 0.5);
    rightEarFlap.rotation.set(0.3, -0.15, -0.4);
    rightEarFlap.castShadow = true;
    rightEarGroup.add(rightEarFlap);

    // 7. Blue Torus Collar with Gold Bone Tag
    const collarGeom = new THREE.TorusGeometry(0.44, 0.05, 16, 48);
    const collar = new THREE.Mesh(collarGeom, collarMat);
    collar.position.set(0, 1.05, 0.26);
    collar.rotation.x = Math.PI / 2 + 0.25;
    collar.scale.set(1.05, 0.9, 0.8);
    collar.castShadow = true;
    collar.receiveShadow = true;
    pugGroup.add(collar);

    const tagGroup = new THREE.Group();
    tagGroup.position.set(0, 0.92, 0.65);
    pugGroup.add(tagGroup);

    // Tag connector ring
    const tagRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 16), tagMat);
    tagRing.position.set(0, 0.04, -0.02);
    tagRing.rotation.y = Math.PI / 4;
    tagGroup.add(tagRing);

    // 3D Bone shape tag
    const tagCenter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.02), tagMat);
    tagCenter.castShadow = true;
    tagGroup.add(tagCenter);

    // Bone corner lobes
    const lobeGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.024, 16);
    lobeGeom.rotateX(Math.PI / 2);

    const lobeLF = new THREE.Mesh(lobeGeom, tagMat);
    lobeLF.position.set(-0.06, 0.03, 0);
    lobeLF.castShadow = true;
    tagGroup.add(lobeLF);

    const lobeLB = new THREE.Mesh(lobeGeom, tagMat);
    lobeLB.position.set(-0.06, -0.03, 0);
    lobeLB.castShadow = true;
    tagGroup.add(lobeLB);

    const lobeRF = new THREE.Mesh(lobeGeom, tagMat);
    lobeRF.position.set(0.06, 0.03, 0);
    lobeRF.castShadow = true;
    tagGroup.add(lobeRF);

    const lobeRB = new THREE.Mesh(lobeGeom, tagMat);
    lobeRB.position.set(0.06, -0.03, 0);
    lobeRB.castShadow = true;
    tagGroup.add(lobeRB);

    // 8. Chubby Organic Legs & Paws & Toes
    const legGeom = new THREE.CapsuleGeometry(0.11, 0.32, 16, 32);
    const toeGeom = new THREE.CapsuleGeometry(0.03, 0.06, 8, 16);
    toeGeom.rotateX(Math.PI / 2);

    // Front Left Leg Group
    const leftFrontLegGroup = new THREE.Group();
    leftFrontLegGroup.position.set(-0.28, 0.24, 0.4);
    pugGroup.add(leftFrontLegGroup);

    const leftFrontLeg = new THREE.Mesh(legGeom, bodyMat);
    leftFrontLeg.castShadow = true;
    leftFrontLeg.receiveShadow = true;
    leftFrontLegGroup.add(leftFrontLeg);

    const leftFrontPaw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bodyMat);
    leftFrontPaw.position.set(0, -0.16, 0.05);
    leftFrontPaw.scale.set(1.1, 0.7, 1.35);
    leftFrontPaw.castShadow = true;
    leftFrontLegGroup.add(leftFrontPaw);

    // Toes
    const leftFrontToe1 = new THREE.Mesh(toeGeom, bodyMat);
    leftFrontToe1.position.set(-0.06, -0.18, 0.12);
    leftFrontToe1.rotation.y = 0.2;
    leftFrontToe1.castShadow = true;
    leftFrontLegGroup.add(leftFrontToe1);

    const leftFrontToe2 = new THREE.Mesh(toeGeom, bodyMat);
    leftFrontToe2.position.set(0, -0.18, 0.14);
    leftFrontToe2.castShadow = true;
    leftFrontLegGroup.add(leftFrontToe2);

    const leftFrontToe3 = new THREE.Mesh(toeGeom, bodyMat);
    leftFrontToe3.position.set(0.06, -0.18, 0.12);
    leftFrontToe3.rotation.y = -0.2;
    leftFrontToe3.castShadow = true;
    leftFrontLegGroup.add(leftFrontToe3);

    // Front Right Leg Group
    const rightFrontLegGroup = new THREE.Group();
    rightFrontLegGroup.position.set(0.28, 0.24, 0.4);
    pugGroup.add(rightFrontLegGroup);

    const rightFrontLeg = new THREE.Mesh(legGeom, bodyMat);
    rightFrontLeg.castShadow = true;
    rightFrontLeg.receiveShadow = true;
    rightFrontLegGroup.add(rightFrontLeg);

    const rightFrontPaw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bodyMat);
    rightFrontPaw.position.set(0, -0.16, 0.05);
    rightFrontPaw.scale.set(1.1, 0.7, 1.35);
    rightFrontPaw.castShadow = true;
    rightFrontLegGroup.add(rightFrontPaw);

    // Toes
    const rightFrontToe1 = new THREE.Mesh(toeGeom, bodyMat);
    rightFrontToe1.position.set(-0.06, -0.18, 0.12);
    rightFrontToe1.rotation.y = 0.2;
    rightFrontToe1.castShadow = true;
    rightFrontLegGroup.add(rightFrontToe1);

    const rightFrontToe2 = new THREE.Mesh(toeGeom, bodyMat);
    rightFrontToe2.position.set(0, -0.18, 0.14);
    rightFrontToe2.castShadow = true;
    rightFrontLegGroup.add(rightFrontToe2);

    const rightFrontToe3 = new THREE.Mesh(toeGeom, bodyMat);
    rightFrontToe3.position.set(0.06, -0.18, 0.12);
    rightFrontToe3.rotation.y = -0.2;
    rightFrontToe3.castShadow = true;
    rightFrontLegGroup.add(rightFrontToe3);

    // Back Left Leg Group (named leftThigh to preserve animation variable references!)
    const leftThigh = new THREE.Group();
    leftThigh.position.set(-0.35, 0.55, -0.28);
    pugGroup.add(leftThigh);

    const leftThighMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), bodyMat);
    leftThighMesh.scale.set(0.8, 1.1, 1.1);
    leftThighMesh.castShadow = true;
    leftThigh.add(leftThighMesh);

    const leftBackLeg = new THREE.Mesh(legGeom, bodyMat);
    leftBackLeg.position.set(0.05, -0.33, -0.04);
    leftBackLeg.castShadow = true;
    leftBackLeg.receiveShadow = true;
    leftThigh.add(leftBackLeg);

    const leftBackPaw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bodyMat);
    leftBackPaw.position.set(0.05, -0.49, 0.01);
    leftBackPaw.scale.set(1.1, 0.7, 1.35);
    leftBackPaw.castShadow = true;
    leftThigh.add(leftBackPaw);

    // Toes
    const leftBackToe1 = new THREE.Mesh(toeGeom, bodyMat);
    leftBackToe1.position.set(-0.01, -0.51, 0.08);
    leftBackToe1.rotation.y = 0.2;
    leftBackToe1.castShadow = true;
    leftThigh.add(leftBackToe1);

    const leftBackToe2 = new THREE.Mesh(toeGeom, bodyMat);
    leftBackToe2.position.set(0.05, -0.51, 0.1);
    leftBackToe2.castShadow = true;
    leftThigh.add(leftBackToe2);

    const leftBackToe3 = new THREE.Mesh(toeGeom, bodyMat);
    leftBackToe3.position.set(0.11, -0.51, 0.08);
    leftBackToe3.rotation.y = -0.2;
    leftBackToe3.castShadow = true;
    leftThigh.add(leftBackToe3);

    // Back Right Leg Group (named rightThigh to preserve animation variable references!)
    const rightThigh = new THREE.Group();
    rightThigh.position.set(0.35, 0.55, -0.28);
    pugGroup.add(rightThigh);

    const rightThighMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), bodyMat);
    rightThighMesh.scale.set(0.8, 1.1, 1.1);
    rightThighMesh.castShadow = true;
    rightThigh.add(rightThighMesh);

    const rightBackLeg = new THREE.Mesh(legGeom, bodyMat);
    rightBackLeg.position.set(-0.05, -0.33, -0.04);
    rightBackLeg.castShadow = true;
    rightBackLeg.receiveShadow = true;
    rightThigh.add(rightBackLeg);

    const rightBackPaw = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bodyMat);
    rightBackPaw.position.set(-0.05, -0.49, 0.01);
    rightBackPaw.scale.set(1.1, 0.7, 1.35);
    rightBackPaw.castShadow = true;
    rightThigh.add(rightBackPaw);

    // Toes
    const rightBackToe1 = new THREE.Mesh(toeGeom, bodyMat);
    rightBackToe1.position.set(-0.11, -0.51, 0.08);
    rightBackToe1.rotation.y = 0.2;
    rightBackToe1.castShadow = true;
    rightThigh.add(rightBackToe1);

    const rightBackToe2 = new THREE.Mesh(toeGeom, bodyMat);
    rightBackToe2.position.set(-0.05, -0.51, 0.1);
    rightBackToe2.castShadow = true;
    rightThigh.add(rightBackToe2);

    const rightBackToe3 = new THREE.Mesh(toeGeom, bodyMat);
    rightBackToe3.position.set(0.01, -0.51, 0.08);
    rightBackToe3.rotation.y = -0.2;
    rightBackToe3.castShadow = true;
    rightThigh.add(rightBackToe3);

    // 9. Curly Corkscrew Tail (12-segment tapered spiral)
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.9, -0.8);
    pugGroup.add(tailGroup);

    const numTailSegments = 12;
    for (let i = 0; i < numTailSegments; i++) {
      const t = i / (numTailSegments - 1);
      const radius = 0.08 * (1 - t * 0.55); // tapers down to 0.036
      const angle = t * Math.PI * 1.75; // tight curly curl
      const spiralRadius = 0.12 * (1 - t * 0.3);
      
      const segment = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), bodyMat);
      // offset in X with `t * 0.06` to curl slightly to the side (very pug-like!)
      const x = Math.sin(angle * 1.5) * 0.04 + t * 0.06;
      const y = Math.sin(angle) * spiralRadius;
      const z = -Math.cos(angle) * spiralRadius;
      
      segment.position.set(x, y + 0.08, z);
      segment.castShadow = true;
      tailGroup.add(segment);
    }

    // 10. Orange Ceramic Food Bowl (Hollow with rim, kibbles and biscuit bone)
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(0, 0.08, 1.05);
    pugGroup.add(bowlGroup);
    
    // Outer shell
    const bowlOuterGeom = new THREE.CylinderGeometry(0.3, 0.34, 0.16, 32);
    const bowlMatObj = new THREE.MeshStandardMaterial({ 
      color: 0xdd6b20, 
      roughness: 0.4 
    });
    const bowlOuterReal = new THREE.Mesh(bowlOuterGeom, bowlMatObj);
    bowlOuterReal.castShadow = true;
    bowlOuterReal.receiveShadow = true;
    bowlGroup.add(bowlOuterReal);

    // Thick rounded lip
    const bowlRimGeom = new THREE.TorusGeometry(0.29, 0.035, 16, 32);
    const bowlRim = new THREE.Mesh(bowlRimGeom, bowlMatObj);
    bowlRim.rotation.x = Math.PI / 2;
    bowlRim.position.y = 0.08;
    bowlRim.castShadow = true;
    bowlRim.receiveShadow = true;
    bowlGroup.add(bowlRim);

    // 30 Faceted Dodecahedron Kibbles piled up
    const kibbleGeom = new THREE.DodecahedronGeometry(0.032);
    const kibbleMat = new THREE.MeshStandardMaterial({ 
      color: 0x563820,
      roughness: 0.9
    });
    for (let i = 0; i < 30; i++) {
      const kibble = new THREE.Mesh(kibbleGeom, kibbleMat);
      const r = Math.random() * 0.21;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      // pile higher in the center
      const y = 0.02 + (1 - r / 0.21) * 0.06 + Math.random() * 0.025;
      kibble.position.set(x, y, z);
      kibble.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      kibble.castShadow = true;
      kibble.receiveShadow = true;
      bowlGroup.add(kibble);
    }

    // Small dog bone biscuit on top of the food
    const biscuitMat = new THREE.MeshStandardMaterial({
      color: 0xe5a97c,
      roughness: 0.8
    });
    const biscuitGroup = new THREE.Group();
    biscuitGroup.position.set(0.02, 0.125, 0.02);
    biscuitGroup.rotation.set(0.2, 0.5, 0.1);
    bowlGroup.add(biscuitGroup);

    const biscuitCenter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.02), biscuitMat);
    biscuitCenter.castShadow = true;
    biscuitGroup.add(biscuitCenter);

    const biscuitLobeGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.022, 12);
    biscuitLobeGeom.rotateX(Math.PI / 2);

    const biscuitLF = new THREE.Mesh(biscuitLobeGeom, biscuitMat);
    biscuitLF.position.set(-0.06, 0.02, 0);
    biscuitLF.castShadow = true;
    biscuitGroup.add(biscuitLF);

    const biscuitLB = new THREE.Mesh(biscuitLobeGeom, biscuitMat);
    biscuitLB.position.set(-0.06, -0.02, 0);
    biscuitLB.castShadow = true;
    biscuitGroup.add(biscuitLB);

    const biscuitRF = new THREE.Mesh(biscuitLobeGeom, biscuitMat);
    biscuitRF.position.set(0.06, 0.02, 0);
    biscuitRF.castShadow = true;
    biscuitGroup.add(biscuitRF);

    const biscuitRB = new THREE.Mesh(biscuitLobeGeom, biscuitMat);
    biscuitRB.position.set(0.06, -0.02, 0);
    biscuitRB.castShadow = true;
    biscuitGroup.add(biscuitRB);


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
      leftThigh.position.y = 0.55;
      rightThigh.position.y = 0.55;

      if (animationState.type !== 'idle') {
        animationState.elapsed += delta;
        const progress = Math.min(1, animationState.elapsed / animationState.duration);
        
        if (animationState.type === 'jump') {
          // Jump arc
          const jumpY = Math.sin(progress * Math.PI) * 0.75;
          const squashStretch = 1 + Math.sin(progress * Math.PI * 2) * 0.08;
          pugGroup.position.y = jumpY;
          body.scale.set(1, 0.76 * squashStretch, 1.32);
          head.position.y = 1.34 + (squashStretch - 1) * 0.2;
          leftThigh.position.y = 0.55 + (squashStretch - 1) * 0.1;
          rightThigh.position.y = 0.55 + (squashStretch - 1) * 0.1;
        } else if (animationState.type === 'spin') {
          // Spin 360
          pugGroup.rotation.y = progress * Math.PI * 2;
        } else if (animationState.type === 'wag') {
          // Rapid tail wag
          tailGroup.rotation.y = Math.sin(animationState.elapsed * 45) * 0.6;
        }

        if (progress >= 1) {
          animationState.type = 'idle';
        }
      } else {
        // Idle gentle breathing + tail sway
        tailGroup.rotation.y = Math.sin(time * 3.5) * 0.12;
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
