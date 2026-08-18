(function(){
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) root.classList.add('dark');

  // theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      root.classList.toggle('dark');
    });
  }


  // mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    document.querySelectorAll('[data-nav-mobile]').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // scrollspy
  const navLinks = document.querySelectorAll('[data-nav]');
  // Note: I included 'stack' in this array to cover your new Tech Stack section!
  const sections = ['about', 'stack', 'experience', 'projects', 'certifications']
    .map(id => document.getElementById(id))
    .filter(Boolean); // Safely ignores sections that don't exist on the current page

  if (sections.length > 0) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  // hero load-in
  window.requestAnimationFrame(() => {
    document.querySelectorAll('[data-hero-el]').forEach((el, i) => {
      el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
      el.style.transitionDelay = (i * 90) + 'ms';
      requestAnimationFrame(() => {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // hero frame draw-in
  const frameRect = document.getElementById('frameRect');
  if (frameRect) {
    const len = frameRect.getTotalLength ? frameRect.getTotalLength() : 1800;
    frameRect.style.strokeDasharray = len;
    frameRect.style.strokeDashoffset = len;
    frameRect.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1)';
    setTimeout(() => { frameRect.style.strokeDashoffset = 0; }, 200);
  }

  // hero mouse parallax
  const heroWrap = document.getElementById('heroFrameWrap');
  const photoLayer = document.getElementById('heroPhotoLayer');
  const frameLayer = document.getElementById('heroFrameSvg');
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroWrap && !reduceMotion) {
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth) - 0.5;
      targetY = (e.clientY / window.innerHeight) - 0.5;
    });
    function raf(){
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (photoLayer) photoLayer.style.transform = `translate(${curX * 10}px, ${curY * 10}px)`;
      if (frameLayer) frameLayer.style.transform = `translate(${curX * 5}px, ${curY * 5}px)`;
      requestAnimationFrame(raf);
    }
    raf();
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal-frame');
  if (revealEls.length > 0) {
    const groups = {};
    revealEls.forEach(el => {
      const parent = el.parentElement;
      const key = parent ? (parent.id || parent.className) : 'root';
      groups[key] = groups[key] || [];
      groups[key].push(el);
    });
    
    Object.values(groups).forEach(group => {
      group.forEach((el, i) => {
        const delay = (i % 6) * 90 + 'ms';
        el.querySelectorAll(':scope > div').forEach(child => {
          child.style.transitionDelay = delay;
        });
      });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }
})();