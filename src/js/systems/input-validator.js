export class InputValidator {
    constructor(inputManager) {
      this.inputManager = inputManager;
      this.testLogs = [];
    }
  
    testMovementKeys() {
      const movementTests = [
        { key: 'forward', expected: 'KeyW' },
        { key: 'backward', expected: 'KeyS' },
        { key: 'left', expected: 'KeyA' },
        { key: 'right', expected: 'KeyD' }
      ];
  
      movementTests.forEach(test => {
        const simulatedEvent = new KeyboardEvent('keydown', { code: test.expected });
        this.inputManager.handleKeyDown(simulatedEvent);
  
        const result = this.inputManager.keys[test.key];
        this.testLogs.push({
          key: test.key,
          passed: result,
          message: result ? 'Movement key works' : 'Movement key failed'
        });
      });
  
      console.table(this.testLogs);
    }
  
    testMouseSensitivity() {
      const initialSensitivity = this.inputManager.mouse.sensitivity;
      const testMovements = [
        { x: 100, y: 0 },
        { x: 0, y: 100 },
        { x: -100, y: -100 }
      ];
  
      testMovements.forEach(movement => {
        const simulatedEvent = {
          movementX: movement.x,
          movementY: movement.y
        };
  
        this.inputManager.handleMouseMove(simulatedEvent);
  
        console.log('Mouse Movement Test:', {
          inputX: this.inputManager.mouse.movementX,
          inputY: this.inputManager.mouse.movementY
        });
      });
    }
  
    testJumpMechanic(player) {
      const initialYPosition = player.body.position.y;
      
      // Simulate jump
      player.inputManager.keys.jump = true;
      player.update(0.016);  // Simulate one frame
  
      const jumpHeight = player.body.position.y - initialYPosition;
      
      console.log('Jump Test:', {
        initialPosition: initialYPosition,
        finalPosition: player.body.position.y,
        jumpHeight: jumpHeight
      });
  
      return jumpHeight > 0;
    }
  }