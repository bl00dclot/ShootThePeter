import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Player } from './player';
import { PerformanceMonitor } from '../systems/performance-monitor';
import { InputValidator } from '../systems/input-validator';




class ShootThePeterGame {
  constructor() {
    this.player = new Player(this.scene, this.world, this.camera);
    this.clock = new THREE.Clock();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.world = null;

    this.initScene();
    this.initPhysics();
    this.initPlayer();

    this.setupDebuggingTools();


    this.animate();
    
    this.performanceMonitor = new PerformanceMonitor();
  }

  
  
  initScene() {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(this.renderer.domElement);

    // Ground Plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x999999,
      wireframe: true  // Optional: show grid lines
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;  // Rotate to horizontal
    this.scene.add(groundMesh);

    // Axis Helpers
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    // Player Visualization
    this.playerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0000,  // Bright red for visibility
        transparent: true,
        opacity: 0.7
      })
    );
    this.scene.add(this.playerMesh);
  }

  
  
  
  initPhysics() {
    // Initialize Cannon.js physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
  }

  initPlayer() {
    this.player = new Player(this.scene, this.world, this.camera);
  }

  setupDebuggingTools() {
    // Performance Monitoring
    this.performanceMonitor = new PerformanceMonitor();

    // Input Validation
    this.inputValidator = new InputValidator(this.player.inputManager);

    // Debugging Mode Toggle
    this.debugMode = {
      enabled: true,
      performanceMonitoring: true,
      inputValidation: true,
      consoleLogging: true
    };

    // Run initial validation tests
    if (this.debugMode.inputValidation) {
      this.runDebugTests();
    }
  };

  runDebugTests() {
    console.group('Initial Debugging Tests');
    
    // Movement Key Test
    console.log('Movement Keys Test:');
    this.inputValidator.testMovementKeys();

    // Mouse Sensitivity Test
    console.log('Mouse Sensitivity Test:');
    this.inputValidator.testMouseSensitivity();

    // Jump Mechanics Test
    console.log('Jump Mechanics Test:');
    const jumpTestResult = this.inputValidator.testJumpMechanic(this.player);
    console.log('Jump Test Passed:', jumpTestResult);

    console.groupEnd();
  }

  animate() {
    // Performance monitoring start
    if (this.debugMode.performanceMonitoring) {
      this.performanceMonitor.beginFrame();
    }


    this.performanceMonitor.beginFrame();



    // Update player mesh position to match physics body
    if (this.player && this.playerMesh) {
      this.playerMesh.position.copy(this.player.body.position);
    }



    requestAnimationFrame(this.animate.bind(this));
    
    const deltaTime = this.clock.getDelta();

    // Update physics
    this.world.step(1/60);
    this.player.update(deltaTime);

     // Update player
     if (this.player) {
      this.player.update(deltaTime);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
    
    // Performance monitoring end
    if (this.debugMode.performanceMonitoring) {
      this.performanceMonitor.endFrame();
    }
  }
}

export default new ShootThePeterGame();
