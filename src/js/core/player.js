import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { InputManager } from '../systems/input-manager';

export class Player {
  constructor(scene, world, camera) {
    this.scene = scene;
    this.world = world;
    this.camera = camera;
    this.inputManager = new InputManager();

    this.speed = {
      walk: 5,
      sprint: 10
    };

    this.jumpForce = 5;
    this.canJump = true;

    this.initPhysics();

    // Add debug logging configuration
    this.debugLogging = {
      position: true,
      velocity: true,
      inputStates: true,
      loggingInterval: 1000 // Log every 1 second
    };

    this.lastLogTime = 0;
  }

  initPhysics() {
    // Player capsule or box for physics
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5));
    this.body = new CANNON.Body({
      mass: 5,
      shape: playerShape,
      material: new CANNON.Material()
    });

    this.body.position.set(0, 2, 0);
    this.world.addBody(this.body);
  }

  logPlayerState(deltaTime) {
    const currentTime = Date.now();
    
    if (currentTime - this.lastLogTime >= this.debugLogging.loggingInterval) {
      // Position Tracking
      if (this.debugLogging.position) {
        console.group('Player Position');
        console.log('X:', this.body.position.x.toFixed(2));
        console.log('Y:', this.body.position.y.toFixed(2));
        console.log('Z:', this.body.position.z.toFixed(2));
        console.groupEnd();
      }

      // Velocity Tracking
      if (this.debugLogging.velocity) {
        console.group('Player Velocity');
        console.log('X Velocity:', this.body.velocity.x.toFixed(2));
        console.log('Y Velocity:', this.body.velocity.y.toFixed(2));
        console.log('Z Velocity:', this.body.velocity.z.toFixed(2));
        console.log('Total Speed:', this.body.velocity.length().toFixed(2));
        console.groupEnd();
      }

      // Input States Monitoring
      if (this.debugLogging.inputStates) {
        console.group('Input States');
        const { keys, mouse } = this.inputManager;
        Object.entries(keys).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log('Mouse Movement X:', mouse.movementX);
        console.log('Mouse Movement Y:', mouse.movementY);
        console.groupEnd();
      }

      this.lastLogTime = currentTime;
    }
  }


  update(deltaTime) {
    const { keys, mouse } = this.inputManager;
    const moveDirection = new CANNON.Vec3(0, 0, 0);

    // Movement logic
    if (keys.forward) moveDirection.z -= 1;
    if (keys.backward) moveDirection.z += 1;
    if (keys.left) moveDirection.x -= 1;
    if (keys.right) moveDirection.x += 1;

    // Normalize diagonal movement
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      const speed = keys.sprint ? this.speed.sprint : this.speed.walk;
      moveDirection.scale(speed);
    }

    // Apply movement relative to camera orientation
    const worldDirection = new CANNON.Quaternion();
    worldDirection.setFromEuler(0, this.camera.rotation.y, 0);
    moveDirection.applyQuaternion(worldDirection);

    this.body.velocity.x = moveDirection.x;
    this.body.velocity.z = moveDirection.z;

    // Jump logic
    if (keys.jump && this.canJump) {
      this.body.velocity.y = this.jumpForce;
      this.canJump = false;
    }

    // Camera follow player
    this.camera.position.copy(this.body.position);
    this.camera.position.y += 1.6; // Eye level

    // Mouse look
    this.camera.rotation.y -= mouse.movementX * this.inputManager.mouse.sensitivity;
    this.camera.rotation.x -= mouse.movementY * this.inputManager.mouse.sensitivity;

    this.inputManager.reset();

        // Add logging method
        this.logPlayerState(deltaTime);
  }
}