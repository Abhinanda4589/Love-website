/* ============================================
   PARTICLE-SYSTEM.JS — Multi-mode Canvas Engine
   Cinematic atmospheres: dust, stars, snow, embers, etc.
   ============================================ */

class ParticleSystem {
  constructor(canvasId = 'particle-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.prepend(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mode = 'dust';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isMobile = window.innerWidth < 768;
    this.isRunning = false;
    this.animationId = null;
    this.mouse = { x: -1000, y: -1000, active: false };

    // Reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse / Touch tracking for subtle interactivity
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.active = true;
      }
    }, { passive: true });

    // Interactive snowflake click detection
    this.canvas.addEventListener('click', (e) => this.handleClick(e));

    this.setMode('dust');
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.createParticles();
  }

  getParticleCount() {
    if (this.reducedMotion) return 15;
    const baseCounts = {
      dust: this.isMobile ? 25 : 55,
      stars: this.isMobile ? 40 : 85,
      golden: this.isMobile ? 30 : 65,
      rain: this.isMobile ? 50 : 110,
      heartbeat: this.isMobile ? 20 : 40,
      warmth: this.isMobile ? 25 : 50,
      snow: this.isMobile ? 45 : 100,
      embers: this.isMobile ? 35 : 75,
      bubbles: this.isMobile ? 20 : 40,
      dawn: this.isMobile ? 25 : 55
    };
    return baseCounts[this.mode] || (this.isMobile ? 30 : 60);
  }

  setMode(newMode) {
    if (this.mode === newMode && this.particles.length > 0) return;
    this.mode = newMode;
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    const count = this.getParticleCount();

    for (let i = 0; i < count; i++) {
      this.particles.push(this.generateParticle(true));
    }
  }

  generateParticle(randomY = false) {
    const p = {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : (this.mode === 'embers' || this.mode === 'dawn' ? this.height + 10 : -10),
      size: 1,
      vx: 0,
      vy: 0,
      alpha: Math.random() * 0.5 + 0.2,
      maxAlpha: Math.random() * 0.6 + 0.3,
      color: '#ffffff',
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulse: Math.random() * Math.PI * 2,
      depth: Math.random() * 0.8 + 0.2,
      isInteractiveSnowflake: false,
      word: null
    };

    switch (this.mode) {
      case 'dust':
        p.size = Math.random() * 2 + 0.8;
        p.vx = (Math.random() - 0.5) * 0.3;
        p.vy = (Math.random() - 0.5) * 0.3;
        p.color = '240, 230, 220';
        p.alpha = Math.random() * 0.3 + 0.1;
        break;

      case 'stars':
        p.size = Math.random() * 2.2 + 0.8;
        p.vx = (Math.random() - 0.5) * 0.08;
        p.vy = (Math.random() - 0.5) * 0.08;
        p.color = Math.random() > 0.3 ? '220, 230, 255' : '255, 235, 210';
        p.alpha = Math.random() * 0.8 + 0.2;
        break;

      case 'golden':
        p.size = Math.random() * 3.5 + 1.2;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = -Math.random() * 0.6 - 0.2;
        p.color = Math.random() > 0.5 ? '212, 165, 116' : '232, 201, 160';
        p.alpha = Math.random() * 0.5 + 0.2;
        break;

      case 'rain':
        p.size = Math.random() * 1.5 + 1;
        p.vx = -0.3;
        p.vy = Math.random() * 4 + 3;
        p.color = '160, 180, 210';
        p.alpha = Math.random() * 0.3 + 0.1;
        p.length = Math.random() * 12 + 6;
        break;

      case 'heartbeat':
        p.size = Math.random() * 4 + 1.5;
        p.vx = (Math.random() - 0.5) * 0.2;
        p.vy = (Math.random() - 0.5) * 0.2;
        p.color = '196, 112, 126';
        p.alpha = Math.random() * 0.4 + 0.1;
        break;

      case 'warmth':
        p.size = Math.random() * 4 + 1.5;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = -Math.random() * 0.5 - 0.2;
        p.color = Math.random() > 0.5 ? '212, 165, 116' : '212, 145, 156';
        p.alpha = Math.random() * 0.5 + 0.2;
        break;

      case 'snow':
        p.size = Math.random() * 3.2 + 1.2;
        p.vx = Math.sin(Math.random() * 10) * 0.4;
        p.vy = Math.random() * 1.2 + 0.6;
        p.color = '255, 255, 255';
        p.alpha = Math.random() * 0.7 + 0.3;
        p.swaySpeed = Math.random() * 0.02 + 0.01;
        p.swayDistance = Math.random() * 1.5 + 0.5;

        // ~8% of snowflakes are interactive with secret romantic words
        if (Math.random() < 0.08) {
          p.isInteractiveSnowflake = true;
          p.size = Math.max(p.size, 3.5);
          const words = ['Love', 'Warmth', 'Forever', 'April 5', 'Dudu', 'Bubu', 'Always'];
          p.word = words[Math.floor(Math.random() * words.length)];
        }
        break;

      case 'embers':
        p.size = Math.random() * 3 + 1;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.vy = -Math.random() * 1.8 - 0.6;
        p.color = Math.random() > 0.4 ? '230, 90, 40' : '255, 170, 50';
        p.alpha = Math.random() * 0.8 + 0.2;
        break;

      case 'bubbles':
        p.size = Math.random() * 6 + 3;
        p.vx = (Math.random() - 0.5) * 0.5;
        p.vy = -Math.random() * 0.7 - 0.3;
        p.color = Math.random() > 0.5 ? '212, 165, 116' : '196, 112, 126';
        p.alpha = Math.random() * 0.35 + 0.15;
        break;

      case 'dawn':
        p.size = Math.random() * 3.5 + 1.5;
        p.vx = (Math.random() - 0.5) * 0.3;
        p.vy = -Math.random() * 0.5 - 0.2;
        p.color = Math.random() > 0.5 ? '245, 190, 140' : '240, 220, 200';
        p.alpha = Math.random() * 0.45 + 0.15;
        break;
    }

    return p;
  }

  handleClick(e) {
    if (this.mode !== 'snow') return;
    const clickX = e.clientX;
    const clickY = e.clientY;

    // Check if clicked near an interactive snowflake
    for (let p of this.particles) {
      if (p.isInteractiveSnowflake) {
        const dist = Math.hypot(p.x - clickX, p.y - clickY);
        if (dist < 35) {
          this.triggerSnowflakeDissolve(p);
          break;
        }
      }
    }
  }

  triggerSnowflakeDissolve(particle) {
    const word = particle.word || 'Love ♡';
    const popup = document.createElement('div');
    popup.className = 'snowflake-word-popup';
    popup.textContent = word;
    popup.style.position = 'fixed';
    popup.style.left = `${particle.x}px`;
    popup.style.top = `${particle.y}px`;
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.fontFamily = 'var(--font-serif)';
    popup.style.fontSize = '1.2rem';
    popup.style.color = 'var(--color-rose-soft)';
    popup.style.textShadow = '0 0 12px rgba(212, 145, 156, 0.8)';
    popup.style.pointerEvents = 'none';
    popup.style.zIndex = '9999';
    popup.style.animation = 'floatUpFade 1.6s ease-out forwards';

    document.body.appendChild(popup);

    // Reset this particle
    particle.isInteractiveSnowflake = false;
    particle.alpha = 0;

    setTimeout(() => popup.remove(), 1600);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  tick() {
    if (!this.isRunning) return;

    this.update();
    this.render();

    this.animationId = requestAnimationFrame(() => this.tick());
  }

  update() {
    const w = this.width;
    const h = this.height;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.pulse += p.pulseSpeed;

      // Mouse gentle repelling or attraction
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100 && dist > 5) {
          const force = (100 - dist) / 100 * 0.4;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      if (this.mode === 'snow') {
        p.x += Math.sin(p.pulse) * p.swayDistance + p.vx;
        p.y += p.vy;
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }

      // Boundary check & recycling
      if (this.mode === 'rain') {
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
      } else if (this.mode === 'embers' || this.mode === 'dawn' || this.mode === 'golden' || this.mode === 'warmth' || this.mode === 'bubbles') {
        if (p.y < -20) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
      } else if (this.mode === 'snow') {
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
      } else {
        // Ambient bounce / wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Stars connecting lines effect
    if (this.mode === 'stars' && !this.reducedMotion) {
      this.renderStarConnections();
    }

    // Render individual particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alphaPulse = Math.sin(p.pulse) * 0.2 + 0.8;
      const currentAlpha = Math.min(1, Math.max(0.05, p.alpha * alphaPulse));

      this.ctx.save();

      if (this.mode === 'rain') {
        this.ctx.strokeStyle = `rgba(${p.color}, ${currentAlpha})`;
        this.ctx.lineWidth = p.size;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.vx * 3, p.y + p.length);
        this.ctx.stroke();
      } else if (this.mode === 'bubbles') {
        // Hollow ring bubble
        this.ctx.strokeStyle = `rgba(${p.color}, ${currentAlpha})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.stroke();

        // Little highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Glowing round particle
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        grad.addColorStop(0, `rgba(${p.color}, ${currentAlpha})`);
        grad.addColorStop(0.5, `rgba(${p.color}, ${currentAlpha * 0.4})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Special glow for interactive snowflakes
        if (p.isInteractiveSnowflake) {
          this.ctx.strokeStyle = `rgba(212, 145, 156, ${Math.sin(p.pulse * 2) * 0.4 + 0.5})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      this.ctx.restore();
    }
  }

  renderStarConnections() {
    const maxDist = this.isMobile ? 70 : 110;
    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          this.ctx.strokeStyle = `rgba(220, 230, 255, ${alpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }
}

window.ParticleSystem = ParticleSystem;
