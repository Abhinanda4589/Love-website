/* ============================================
   SCROLL-MANAGER.JS — Chapter Intersection & Progress
   Monitors scroll, updates timeline and environment
   ============================================ */

class ScrollManager {
  constructor() {
    this.chapters = Array.from(document.querySelectorAll('.chapter'));
    this.timelineContainer = document.querySelector('.timeline-progress');
    this.mobileProgress = document.querySelector('.mobile-progress');
    this.currentChapterIndex = -1;
    this.currentChapterId = null;

    this.init();
  }

  init() {
    if (!this.chapters.length) return;

    this.buildTimelineDots();
    this.setupObserver();
    this.setupScrollListener();
  }

  buildTimelineDots() {
    if (!this.timelineContainer) return;
    this.timelineContainer.innerHTML = '';

    this.chapters.forEach((chapter, index) => {
      const dot = document.createElement('button');
      dot.className = 'timeline-progress__dot';
      dot.setAttribute('aria-label', `Go to chapter ${index + 1}`);
      dot.dataset.index = index;

      dot.addEventListener('click', () => {
        chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      this.timelineContainer.appendChild(dot);
    });
  }

  setupObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapterEl = entry.target;
          const chapterId = chapterEl.id;
          const index = this.chapters.indexOf(chapterEl);

          if (index !== -1 && index !== this.currentChapterIndex) {
            this.onChapterEnter(chapterId, index);
          }
        }
      });
    }, observerOptions);

    this.chapters.forEach((chapter) => observer.observe(chapter));
  }

  onChapterEnter(chapterId, index) {
    this.currentChapterIndex = index;
    this.currentChapterId = chapterId;

    // 1. Notify environment engine
    if (window.environmentEngine) {
      window.environmentEngine.transitionToChapter(chapterId);
    }

    // 2. Update desktop timeline dots
    if (this.timelineContainer) {
      const dots = this.timelineContainer.querySelectorAll('.timeline-progress__dot');
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // 3. Update mobile progress
    if (this.mobileProgress) {
      const total = this.chapters.length;
      const current = String(index + 1).padStart(2, '0');
      const totalStr = String(total).padStart(2, '0');
      this.mobileProgress.textContent = `${current} / ${totalStr}`;
    }

    // 4. Oda Lage music boost in ch09
    if (window.musicPlayer) {
      if (chapterId === 'ch09') {
        window.musicPlayer.boostForOdaLage(true);
      } else {
        window.musicPlayer.boostForOdaLage(false);
      }
    }
  }

  setupScrollListener() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.checkTimelineVisibility();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  checkTimelineVisibility() {
    const lockScreen = document.querySelector('.lock-screen');
    const isLocked = lockScreen && !lockScreen.classList.contains('hidden');

    if (isLocked) {
      if (this.timelineContainer) this.timelineContainer.classList.remove('visible');
      if (this.mobileProgress) this.mobileProgress.classList.remove('visible');
    } else {
      if (this.timelineContainer) this.timelineContainer.classList.add('visible');
      if (this.mobileProgress) this.mobileProgress.classList.add('visible');
    }
  }
}

window.ScrollManager = ScrollManager;
