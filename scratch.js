  (function() {
    var isInEditor = !!document.querySelector('[data-gjs-type]') || document.body.classList.contains('gjs-dashed');

    // 1. Initialize core UI immediately (Reveal animations)
    const initUI = () => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add('in'));
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
      
      // Failsafe: if intersection observer fails or user scrolls too fast, ensure elements appear
      setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')), 1500);

      const nav = document.querySelector('.nav');
      if (nav) {
        window.addEventListener('scroll', () => {
          nav.classList.toggle('scrolled', window.scrollY > 20);
          document.getElementById('toTop')?.classList.toggle('show', window.scrollY > 400);
        });
      }
    };
    initUI();

    // 2. Initialize Swiper independently
    const initSwiper = () => {
      if (typeof Swiper !== 'undefined') {
        let dSwiper, rSwiper;
        if(document.querySelector('.dest-swiper')) {
          dSwiper = new Swiper('.dest-swiper', {
            wrapperClass: 'dest-grid',
            slideClass: 'dest',
            slidesPerView: 1.2, spaceBetween: 20, loop: !isInEditor,
            navigation: { nextEl: '.dest-next', prevEl: '.dest-prev' },
            breakpoints: { 640: { slidesPerView: 2.2 }, 900: { slidesPerView: 3.2 }, 1200: { slidesPerView: 4 } }
          });
        }
        if(document.querySelector('.reviews-swiper')) {
          rSwiper = new Swiper('.reviews-swiper', {
            wrapperClass: 'reviews-wrapper',
            slideClass: 'rev-slide',
            slidesPerView: 1, spaceBetween: 30, loop: !isInEditor,
            pagination: { el: '.swiper-pagination', clickable: true },
            autoHeight: true
          });
        }
    
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((m) => {
            if (m.attributeName === 'class' && m.target && m.target.classList) {
              if (m.target.classList.contains('gjs-selected')) {
                const isNext = m.target.closest('.dest-next') || m.target.classList.contains('dest-next');
                const isPrev = m.target.closest('.dest-prev') || m.target.classList.contains('dest-prev');
                
                if (isNext && dSwiper) dSwiper.slideNext();
                if (isPrev && dSwiper) dSwiper.slidePrev();
              }
            }
          });
        });
        observer.observe(document.body, { attributes: true, subtree: true });
      }
    };
    
    if (!document.getElementById('swiper-js-travel3')) {
      let s = document.createElement('script');
      s.id = 'swiper-js-travel3';
      s.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      s.onload = initSwiper;
      document.head.appendChild(s);
    } else {
      setTimeout(initSwiper, 500);
    }

    // 3. Form validations
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM') {
        e.target.setAttribute('novalidate', 'true');
        var isValid = true;
        var inputs = e.target.querySelectorAll('input:not([type="submit"]):not([type="hidden"]):not([type="button"]), textarea, select');
        inputs.forEach(function(input) {
          if (!input.value.trim() && input.hasAttribute('required')) isValid = false;
        });
        if (!isValid || isInEditor) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }, true);
  })();
