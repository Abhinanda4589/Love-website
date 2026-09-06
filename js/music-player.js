/* ============================================
   MUSIC-PLAYER.JS — Audio Controller & SFX Engine
   Background song with volume ducking & Web Audio SFX
   ============================================ */

class MusicPlayer {
  constructor(audioSrc = 'assets/music/oda-lage.mp3') {
    this.sources = [
      audioSrc,
      'assets/music/oda-lage.mp3',
      'assets/music/oda-lage.webm',
      'memories/oda-lage.mp3',
      'memories/oda-lage.webm',
      'memories/vidssave.com Oda Lage _ 4K Full Video _ Bou Buttu Bhuta _ Babushaan, Archita, Subhashree _ Raja 2025 _ BF _ SM 256kbps.webm'
    ];
    this.currentSourceIndex = 0;

    this.audio = new Audio();
    this.audio.src = encodeURI(this.sources[this.currentSourceIndex]);
    this.audio.loop = true;
    this.audio.preload = 'auto';

    this.isPlaying = false;
    this.isMuted = false;
    this.hasAudioFile = true;
    this.targetVolume = 0.6;
    this.currentVolume = 0.6;
    this.audioCtx = null;

    // DOM Elements
    this.playerEl = document.querySelector('.music-player');
    this.playBtn = document.querySelector('.music-player__btn--play');
    this.progressFill = document.querySelector('.music-player__progress-fill');
    this.progressTrack = document.querySelector('.music-player__progress');
    this.labelEl = document.querySelector('.music-player__label');

    this.init();
  }

  init() {
    this.audio.volume = 0.5;

    this.audio.addEventListener('timeupdate', () => this.updateProgress());

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio error on source:', this.sources[this.currentSourceIndex]);
      // Try next fallback source if available
      if (this.currentSourceIndex < this.sources.length - 1) {
        this.currentSourceIndex++;
        console.log('Trying fallback audio source:', this.sources[this.currentSourceIndex]);
        this.audio.src = encodeURI(this.sources[this.currentSourceIndex]);
        this.audio.load();
        if (this.isPlaying) {
          this.audio.play().catch(err => console.log('Autoplay deferred:', err));
        }
      } else {
        this.hasAudioFile = false;
        if (this.labelEl) this.labelEl.textContent = 'Oda Lage';
      }
    });

    this.audio.addEventListener('canplay', () => {
      this.hasAudioFile = true;
      if (this.labelEl) this.labelEl.textContent = 'Oda Lage ♪';
    });

    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    if (this.progressTrack) {
      this.progressTrack.addEventListener('click', (e) => {
        if (!this.audio.duration) return;
        const rect = this.progressTrack.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
      });
    }

    // Connect any on-page play buttons (e.g. Chapter 09 Oda Lage card button)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.play-oda-lage-btn');
      if (btn) {
        e.stopPropagation();
        this.toggle();
      }
    });
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  play() {
    this.getAudioContext();
    this.isPlaying = true;

    if (this.playerEl) {
      this.playerEl.classList.add('visible');
    }
    this.updatePlayBtnIcon();

    // Ensure volume is audible
    if (this.audio.volume < 0.1) {
      this.audio.volume = 0.5;
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.hasAudioFile = true;
        this.fadeIn(this.targetVolume, 1200);
      }).catch((err) => {
        console.warn('Playback request was prevented by browser policy or error:', err);
        // Retry with next fallback source if first failed
        if (this.currentSourceIndex < this.sources.length - 1) {
          this.currentSourceIndex++;
          this.audio.src = encodeURI(this.sources[this.currentSourceIndex]);
          this.audio.load();
          this.audio.play().then(() => {
            this.hasAudioFile = true;
            this.fadeIn(this.targetVolume, 1200);
          }).catch(() => {
            this.isPlaying = false;
            this.updatePlayBtnIcon();
          });
        } else {
          this.isPlaying = false;
          this.updatePlayBtnIcon();
        }
      });
    }
  }

  pause() {
    this.isPlaying = false;
    this.audio.pause();
    this.updatePlayBtnIcon();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume, duration = 1000) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    this.fadeTo(this.targetVolume, duration);
  }

  fadeIn(targetVol = 0.6, duration = 1200) {
    this.fadeTo(targetVol, duration);
  }

  fadeTo(targetVol, duration = 1000) {
    const startVol = this.audio.volume;
    const diff = targetVol - startVol;
    const steps = 15;
    const stepTime = duration / steps;
    let currentStep = 0;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      try {
        this.audio.volume = Math.max(0, Math.min(1, startVol + diff * progress));
      } catch (e) {}

      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        try {
          this.audio.volume = targetVol;
        } catch (e) {}
      }
    }, stepTime);
  }

  boostForOdaLage(isOdaLage) {
    if (isOdaLage) {
      this.setVolume(0.9, 1200);
    } else {
      this.setVolume(0.6, 1200);
    }
  }

  updateProgress() {
    if (!this.audio.duration || !this.progressFill) return;
    const pct = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressFill.style.width = `${pct}%`;
  }

  updatePlayBtnIcon() {
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying ? '❚❚' : '▶';
    }
    const pageBtns = document.querySelectorAll('.play-oda-lage-btn');
    pageBtns.forEach(b => {
      b.innerHTML = this.isPlaying ? '❚❚ PAUSE MUSIC' : '▶ PLAY ODA LAGE';
    });
  }

  /* --- Web Audio API Romantic Synthesized Sound Effects --- */

  playLockClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playCardBurn() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  }

  playChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch (e) {}
  }

  playPop() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }
}

window.MusicPlayer = MusicPlayer;
