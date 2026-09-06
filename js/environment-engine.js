/* ============================================
   ENVIRONMENT-ENGINE.JS — Visual World Controller
   Handles cinematic atmospheric transformations
   ============================================ */

class EnvironmentEngine {
  constructor() {
    this.currentEnv = 'lock';
    this.overlay = document.getElementById('environment-overlay');
    this.body = document.body;

    // Mapping of chapter IDs to environment configurations
    this.chapterEnvironments = {
      'lock': { env: 'lock', particles: 'dust' },
      'music-intro': { env: 'lock', particles: 'dust' },
      'ch00': { env: 'lock', particles: 'dust' },
      'ch01': { env: 'night', particles: 'stars' },
      'ch02': { env: 'twilight', particles: 'golden' },
      'ch03': { env: 'amber', particles: 'golden' },
      'ch04': { env: 'cold', particles: 'rain' },
      'ch05': { env: 'void', particles: 'heartbeat' },
      'ch06': { env: 'warming', particles: 'warmth' },
      'ch07': { env: 'winter', particles: 'snow' },
      'ch08': { env: 'winter', particles: 'snow' },
      'ch09': { env: 'dreamy', particles: 'bubbles' },
      'ch10': { env: 'playful', particles: 'bubbles' },
      'ch11': { env: 'dashboard', particles: 'dust' },
      'ch12': { env: 'clean', particles: 'dust' },
      'ch13': { env: 'clean', particles: 'dust' },
      'ch14': { env: 'golden', particles: 'golden' },
      'ch18': { env: 'ember', particles: 'embers' },
      'ch19': { env: 'dark-peace', particles: 'dust' },
      'ch20': { env: 'playful', particles: 'bubbles' },
      'ch21': { env: 'golden', particles: 'golden' },
      'ch22': { env: 'minimal', particles: 'dust' },
      'ch23': { env: 'minimal', particles: 'dust' },
      'ch24': { env: 'dawn', particles: 'dawn' },
      'ch25': { env: 'dawn', particles: 'dawn' },
      'ch26': { env: 'golden', particles: 'warmth' },
      'ch27': { env: 'final', particles: 'stars' }
    };

    this.init();
  }

  init() {
    this.setEnvironment('lock');

    // Pause heavy canvas operations when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (window.particleSystem) window.particleSystem.pause();
      } else {
        if (window.particleSystem) window.particleSystem.resume();
      }
    });
  }

  setEnvironment(envName) {
    if (this.currentEnv === envName && this.body.getAttribute('data-environment') === envName) {
      return;
    }

    this.currentEnv = envName;
    this.body.setAttribute('data-environment', envName);

    // Update overlay if present for subtle crossfade
    if (this.overlay) {
      this.overlay.style.opacity = '0.7';
      setTimeout(() => {
        if (this.overlay) this.overlay.style.opacity = '0';
      }, 500);
    }
  }

  transitionToChapter(chapterId) {
    const config = this.chapterEnvironments[chapterId];
    if (!config) return;

    this.setEnvironment(config.env);

    if (window.particleSystem && typeof window.particleSystem.setMode === 'function') {
      window.particleSystem.setMode(config.particles);
    }
  }
}

window.EnvironmentEngine = EnvironmentEngine;
