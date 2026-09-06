/* ============================================
   APP.JS — Application Entry Point
   Initializes all core engines and lifecycle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Particle System (Canvas background)
  window.particleSystem = new ParticleSystem('particle-canvas');

  // 2. Environment Engine (Atmosphere & Theme controller)
  window.environmentEngine = new EnvironmentEngine();

  // 3. Music & SFX Controller
  window.musicPlayer = new MusicPlayer('assets/music/oda-lage.mp3');

  // 4. Scroll Manager & Intersection Observer
  window.scrollManager = new ScrollManager();

  // 5. Animation Controller (Text reveals, counters, progress bars)
  window.animationController = new AnimationController();

  // 6. Interaction Controller (Mini-games, lock, burns, easter eggs)
  window.interactionController = new InteractionController();

  console.log('✨ 17 Months of Us — Initialized with love.');
});
