export class InputManager {
    constructor() {
      this.keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
        jump: false
      };
  
      this.mouse = {
        sensitivity: 0.002,
        movementX: 0,
        movementY: 0
      };
  
      this.initEventListeners();
    }
  
    initEventListeners() {
      // Keyboard events
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
      window.addEventListener('keyup', this.handleKeyUp.bind(this));
  
      // Mouse events
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('click', this.handleMouseClick.bind(this));
    }
  
    handleKeyDown(event) {
      switch(event.code) {
        case 'KeyW': this.keys.forward = true; break;
        case 'KeyS': this.keys.backward = true; break;
        case 'KeyA': this.keys.left = true; break;
        case 'KeyD': this.keys.right = true; break;
        case 'ShiftLeft': this.keys.sprint = true; break;
        case 'Space': this.keys.jump = true; break;
      }
    }
  
    handleKeyUp(event) {
      // Mirror key down logic but set to false
    }
  
    handleMouseMove(event) {
      this.mouse.movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      this.mouse.movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    }
  
    handleMouseClick() {
      // Pointer lock for FPS-style control
      if (!document.pointerLockElement) {
        const canvas = document.querySelector('canvas');
        canvas.requestPointerLock();
      }
    }
  
    reset() {
      this.mouse.movementX = 0;
      this.mouse.movementY = 0;
    }
  }