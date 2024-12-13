import Stats from 'stats.js';

export class PerformanceMonitor {
  constructor() {
    // Frame rate and memory usage stats
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    document.body.appendChild(this.stats.dom);

    // Browser Performance API markers
    this.setupPerformanceMarkers();
  }

  setupPerformanceMarkers() {
    performance.mark('gameStart');
    
    window.addEventListener('beforeunload', () => {
      performance.mark('gameEnd');
      performance.measure('gameSession', 'gameStart', 'gameEnd');
      
      const measures = performance.getEntriesByType('measure');
      measures.forEach(measure => {
        console.log(`Game Session Duration: ${measure.duration}ms`);
      });
    });
  }

  beginFrame() {
    this.stats.begin();
  }

  endFrame() {
    this.stats.end();
  }
}