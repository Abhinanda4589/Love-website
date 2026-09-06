/* ============================================
   INTERACTIONS.JS — Mini-games & Easter Eggs
   Lock, card burn, medicine modal, Easter eggs
   ============================================ */

class InteractionController {
  constructor() {
    this.heartClickCount = 0;
    this.nunnuClickCount = 0;
    this.chutuClickCount = 0;

    this.init();
  }

  init() {
    this.setupLockScreen();
    this.setupMusicIntro();
    this.setupSwornBrotherInteraction();
    this.setupNicknameReveals();
    this.setupBurningCards();
    this.setupFutureMemories();
    this.setupEasterEggs();
    this.setupHugButton();
    this.setupImageLightbox();
  }

  /* --- 1. Lock Screen Mini-Game --- */
  setupLockScreen() {
    const lockScreen = document.querySelector('.lock-screen');
    const lockIcon = document.querySelector('.lock-screen__lock');
    const keyIcon = document.querySelector('.lock-screen__key');
    const burst = document.querySelector('.lock-screen__burst');
    const fallbackBtn = document.querySelector('#unlock-fallback-btn');
    const musicIntro = document.querySelector('.music-intro');

    if (!lockScreen || !keyIcon) return;

    let unlocked = false;

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;

      // SFX
      if (window.musicPlayer) {
        window.musicPlayer.playLockClick();
      }

      // Animate Key & Lock
      keyIcon.classList.add('moving');
      if (lockIcon) lockIcon.classList.add('shaking');

      setTimeout(() => {
        if (burst) burst.classList.add('active');
        if (lockIcon) lockIcon.textContent = '🔓';

        setTimeout(() => {
          lockScreen.classList.add('hidden');
          if (musicIntro) {
            musicIntro.classList.add('visible');
          }
        }, 800);
      }, 500);
    };

    keyIcon.addEventListener('click', unlock);
    if (fallbackBtn) fallbackBtn.addEventListener('click', unlock);
  }

  /* --- 2. Music Intro Screen --- */
  setupMusicIntro() {
    const musicIntro = document.querySelector('.music-intro');
    const startBtn = document.querySelector('#begin-story-btn');

    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
      if (window.musicPlayer) {
        window.musicPlayer.play();
      }

      if (musicIntro) {
        musicIntro.classList.remove('visible');
        musicIntro.classList.add('hidden');
      }

      // Scroll to Chapter 01
      const ch01 = document.getElementById('ch01');
      if (ch01) {
        ch01.scrollIntoView({ behavior: 'smooth' });
      }

      // Reveal timeline and mobile progress
      const timeline = document.querySelector('.timeline-progress');
      const mobileProg = document.querySelector('.mobile-progress');
      if (timeline) timeline.classList.add('visible');
      if (mobileProg) mobileProg.classList.add('visible');
    });
  }

  /* --- 3. Sworn Brother Application Interaction --- */
  setupSwornBrotherInteraction() {
    const appUi = document.querySelector('.application-ui');
    if (!appUi) return;

    appUi.addEventListener('click', () => {
      if (window.musicPlayer) window.musicPlayer.playChime();
      const statusEl = appUi.querySelector('.application-ui__status');
      if (statusEl) {
        statusEl.textContent = 'LIFETIME APPROVED ❤️';
        statusEl.style.color = 'var(--color-rose)';
      }
    });
  }

  /* --- 4. Nickname Card Reveals --- */
  setupNicknameReveals() {
    const cards = document.querySelectorAll('.nickname-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        card.style.transform = 'scale(1.05)';
        if (window.musicPlayer) window.musicPlayer.playPop();
        setTimeout(() => {
          card.style.transform = 'scale(1)';
        }, 200);
      });
    });
  }

  /* --- 5. Burning Regret Cards --- */
  setupBurningCards() {
    const cards = document.querySelectorAll('.burning-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        if (card.classList.contains('burning') || card.classList.contains('burned')) return;

        card.classList.add('burning');
        if (window.musicPlayer) {
          window.musicPlayer.playCardBurn();
        }

        setTimeout(() => {
          card.classList.add('burned');
        }, 1400);
      });
    });
  }

  /* --- 7. Future Locked Memories --- */
  setupFutureMemories() {
    const memories = document.querySelectorAll('.future-memory');
    memories.forEach((mem) => {
      mem.addEventListener('click', () => {
        mem.classList.toggle('revealed');
        if (window.musicPlayer) {
          window.musicPlayer.playChime();
        }
      });
    });
  }

  /* --- 8. Easter Eggs --- */
  setupEasterEggs() {
    const secretModal = document.querySelector('#easter-egg-modal');
    const secretClose = document.querySelector('.easter-egg__close');

    if (secretClose && secretModal) {
      secretClose.addEventListener('click', () => {
        secretModal.classList.remove('visible');
      });
    }

    // A. Heart 5x click -> Secret confession
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('secret-heart-trigger') || e.target.closest('.secret-heart-trigger')) {
        this.heartClickCount++;
        if (this.heartClickCount >= 5) {
          this.heartClickCount = 0;
          this.triggerSecretModal();
        }
      }
    });

    // B. Nunnu clicks -> Popup
    const nunnuTriggers = document.querySelectorAll('.trigger-nunnu');
    nunnuTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.nunnuClickCount++;
        if (this.nunnuClickCount >= 3) {
          this.nunnuClickCount = 0;
          this.showToast('NUNNU DETECTED', 'Dudu has lost all remaining dignity. 😂');
        }
      });
    });

    // C. Chutu clicks -> Popup + sparkles
    const chutuTriggers = document.querySelectorAll('.trigger-chutu');
    chutuTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.chutuClickCount++;
        if (this.chutuClickCount >= 3) {
          this.chutuClickCount = 0;
          this.showToast('CHUTU MODE ACTIVATED', '✨💕 The cutest baby mode active!');
          if (window.musicPlayer) window.musicPlayer.playChime();
        }
      });
    });
  }

  triggerSecretModal() {
    const modal = document.querySelector('#easter-egg-modal');
    if (modal) {
      modal.classList.add('visible');
      if (window.musicPlayer) window.musicPlayer.playChime();
    }
  }

  showToast(title, text) {
    const toast = document.createElement('div');
    toast.className = 'notification visible';
    toast.style.position = 'fixed';
    toast.style.top = '2rem';
    toast.style.zIndex = '99999';
    toast.innerHTML = `
      <div class="notification__icon">✨</div>
      <div class="notification__title">${title}</div>
      <div class="notification__text">${text}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  /* --- 9. Hug Button in Ch 27 Secret Confession --- */
  setupHugButton() {
    const hugBtn = document.querySelector('#hug-reveal-btn');
    const hugText = document.querySelector('#hug-reveal-text');

    if (hugBtn && hugText) {
      hugBtn.addEventListener('click', () => {
        hugText.style.display = 'block';
        hugBtn.style.transform = 'scale(1.2)';
        if (window.musicPlayer) window.musicPlayer.playPop();
      });
    }
  }

  /* --- 10. Image Lightbox for High-Res View --- */
  setupImageLightbox() {
    const lightbox = document.querySelector('#image-lightbox-modal');
    const lightboxImg = document.querySelector('.image-lightbox__img');
    const lightboxCaption = document.querySelector('.image-lightbox__caption');
    const lightboxClose = document.querySelector('.image-lightbox__close');

    if (!lightbox || !lightboxImg) return;

    document.addEventListener('click', (e) => {
      const media = e.target.closest('.memory-card__media, .clickable-image');
      if (media) {
        const img = media.querySelector('img') || (media.tagName === 'IMG' ? media : null);
        if (img) {
          lightboxImg.src = img.src;
          const card = media.closest('.memory-card');
          const caption = card ? card.querySelector('.memory-card__caption') : null;
          if (lightboxCaption) {
            lightboxCaption.textContent = caption ? caption.textContent : img.alt || '';
          }
          lightbox.classList.add('visible');
          if (window.musicPlayer) window.musicPlayer.playPop();
        }
      }
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose || e.target.classList.contains('image-lightbox__close')) {
        lightbox.classList.remove('visible');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
        lightbox.classList.remove('visible');
      }
    });
  }
}

window.InteractionController = InteractionController;
