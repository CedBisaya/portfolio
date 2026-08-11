(function(){
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) root.classList.add('dark');

  // theme toggle — Tailwind's dark: variant handles all the visual changes
  document.getElementById('themeToggle').addEventListener('click', () => {
    root.classList.toggle('dark');
  });

  // nav scroll state + progress bar
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 8);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.querySelectorAll('[data-nav-mobile]').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // scrollspy
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = ['about','experience','projects','certifications']
    .map(id => document.getElementById(id));

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
  sections.forEach(s => s && spy.observe(s));

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

  // scroll reveal — staggers corner-bracket groups, then flips the shared
  // 'in-view' class Tailwind's group-[.in-view]: variants respond to
  const revealEls = document.querySelectorAll('.reveal-frame');
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
      // Only stagger the content div's fade-in — corner brackets (spans) must
      // react to hover instantly with zero delay.
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
})();