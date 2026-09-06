/* ============================================
   ANIMATIONS.JS — Scroll Reveals & Counter Logic
   Manages element visibility, counters, and reveals
   ============================================ */

class AnimationController {
  constructor() {
    this.observer = null;
    this.counterAnimated = new Set();
    this.init();
  }

  init() {
    this.setupScrollReveals();
    this.setupCounters();
    this.setupProgressBars();
  }

  setupScrollReveals() {
    const revealElements = document.querySelectorAll('.anim-hidden, .anim-hidden-scale');
    if (!revealElements.length) return;

    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.classList.contains('anim-hidden')) {
            el.classList.add('anim-visible');
          }
          if (el.classList.contains('anim-hidden-scale')) {
            el.classList.add('anim-visible-scale');
          }

          // Check if it's a progress bar or counter inside
          const counter = el.querySelector('.counter-number');
          if (counter && !this.counterAnimated.has(counter)) {
            this.animateCounter(counter);
          }

          const pbar = el.querySelector('.progress-bar__fill');
          if (pbar) {
            const targetWidth = pbar.dataset.targetWidth || '100%';
            pbar.style.width = targetWidth;
          }

          // Once revealed, unobserve if not needed to retrigger
          this.observer.unobserve(el);
        }
      });
    }, options);

    revealElements.forEach((el) => this.observer.observe(el));
  }

  setupCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.counterAnimated.has(entry.target)) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => counterObserver.observe(c));
  }

  animateCounter(el) {
    this.counterAnimated.add(el);
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;

    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(updateCount);
  }

  setupProgressBars() {
    const pbars = document.querySelectorAll('.progress-bar__fill');
    const pbObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetW = fill.dataset.targetWidth || '100%';
          fill.style.width = targetW;
          pbObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.2 });

    pbars.forEach((p) => pbObserver.observe(p));
  }
}

window.AnimationController = AnimationController;
