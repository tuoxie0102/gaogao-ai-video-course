class SlidePresentation {
      constructor() {
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.currentSlide = 0;
        this.progressBar = document.getElementById('progressBar');
        this.navDots = document.getElementById('navDots');
        this.setupNavDots();
        this.setupIntersectionObserver();
        this.setupKeyboardNav();
        this.setupWheelNav();
        this.updateProgress();
      }
      setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.currentSlide = this.slides.indexOf(entry.target);
              this.updateProgress();
              this.updateDots();
            }
          });
        }, { threshold: 0.58 });
        this.slides.forEach(slide => observer.observe(slide));
      }
      setupNavDots() {
        this.slides.forEach((_, index) => {
          const dot = document.createElement('button');
          dot.className = 'nav-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
          dot.addEventListener('click', () => this.goToSlide(index));
          this.navDots.appendChild(dot);
        });
      }
      setupKeyboardNav() {
        document.addEventListener('keydown', (event) => {
          if (['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(event.key)) { event.preventDefault(); this.nextSlide(); }
          if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); this.prevSlide(); }
          if (event.key === 'Home') { event.preventDefault(); this.goToSlide(0); }
          if (event.key === 'End') { event.preventDefault(); this.goToSlide(this.slides.length - 1); }
        });
      }
      setupWheelNav() {
        let last = 0;
        document.addEventListener('wheel', (event) => {
          const now = Date.now();
          if (now - last < 550) return;
          if (Math.abs(event.deltaY) < 28) return;
          last = now;
          event.deltaY > 0 ? this.nextSlide() : this.prevSlide();
        }, { passive: true });
      }
      goToSlide(index) {
        const next = Math.max(0, Math.min(index, this.slides.length - 1));
        this.slides[next].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      nextSlide() { this.goToSlide(this.currentSlide + 1); }
      prevSlide() { this.goToSlide(this.currentSlide - 1); }
      updateProgress() { this.progressBar.style.width = `${((this.currentSlide + 1) / this.slides.length) * 100}%`; }
      updateDots() { Array.from(this.navDots.children).forEach((dot, i) => dot.classList.toggle('active', i === this.currentSlide)); }
    }
    document.addEventListener('DOMContentLoaded', () => {
      const deck = new SlidePresentation();
      const slideParam = new URLSearchParams(window.location.search).get('slide');
      if (slideParam) {
        const index = Number(slideParam) - 1;
        if (!Number.isNaN(index) && deck.slides[index]) {
          document.body.classList.add('preview-single');
          deck.slides[index].classList.add('preview-target', 'visible');
          deck.currentSlide = index;
          deck.updateProgress();
          deck.updateDots();
        }
      }
    });
