(() => {
  document.documentElement.classList.remove('no-js');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-nav');
  const progress = document.querySelector('.scroll-progress span');
  const glow = document.querySelector('.cursor-glow');
  let lastY = 0;

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (header) {
      header.classList.toggle('is-scrolled', y > 16);
      header.classList.toggle('header-hidden', y > lastY && y > 130 && !menu?.classList.contains('open'));
    }
    lastY = Math.max(0, y);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if (glow && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  }

  // Split only text nodes into accessible word spans.
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(/\s+/).map(word => `<span class="word" aria-hidden="true">${word}</span>`).join(' ');
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runAnimations = () => {
    if (reduced || !window.gsap) {
      document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
      return;
    }
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-title .word, .inner-hero h1 .word, .service-hero h1 .word, .contact-hero h1 .word', {
      yPercent:110, opacity:0, duration:1.05, stagger:.045, ease:'power4.out', delay:.15
    });
    gsap.from('.hero-intro, .hero-home .button-group, .inner-hero>div>p:last-child, .service-hero p:not(.eyebrow), .service-hero .button-group, .contact-copy>p:not(.eyebrow)', {
      y:24, opacity:0, duration:.8, stagger:.12, ease:'power3.out', delay:.55
    });
    gsap.fromTo('.hero-line', {strokeDasharray:1200, strokeDashoffset:1200}, {strokeDashoffset:0,duration:2.1,ease:'power2.inOut',stagger:.18,delay:.25});
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el,{opacity:1,y:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
    gsap.to('.hero-mark',{yPercent:10,ease:'none',scrollTrigger:{trigger:'.hero-home',start:'top top',end:'bottom top',scrub:true}});
    document.querySelectorAll('.work-card, .related-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        if (!matchMedia('(pointer:fine)').matches) return;
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-3;
        const ry=((e.clientX-r.left)/r.width-.5)*3;
        gsap.to(card,{rotateX:rx,rotateY:ry,transformPerspective:900,duration:.35,ease:'power2.out'});
      });
      card.addEventListener('pointerleave',()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.5,ease:'power2.out'}));
    });
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.12,y:(e.clientY-r.top-r.height/2)*.12,duration:.25})});
      btn.addEventListener('pointerleave',()=>gsap.to(btn,{x:0,y:0,duration:.45,ease:'elastic.out(1,.4)'}));
    });
  };
  if (document.readyState === 'complete') runAnimations(); else window.addEventListener('load', runAnimations, {once:true});

  const form = document.getElementById('callbackForm');
  if (form) {
    const params = new URLSearchParams(location.search);
    const requested = params.get('service');
    if (requested) {
      const select = form.querySelector('select[name="service"]');
      [...select.options].forEach(o => { if (o.value.toLowerCase().replace(/\s+/g,'-').replace(/&/g,'') === requested) o.selected = true; });
    }
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const button = form.querySelector('button[type="submit"]');
      const phone = form.phone.value.trim();
      if (!/^\d{10}$/.test(phone)) { status.textContent='Please enter a valid 10-digit mobile number.'; return; }
      status.textContent='Sending…'; button.disabled=true;
      try {
        const data = new URLSearchParams(new FormData(form));
        data.set('page', location.href);
        await fetch(form.dataset.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data});
        form.reset();
        status.textContent='Thank you. Your enquiry has been sent.';
      } catch (err) {
        status.textContent='The form could not be sent. Please call or use WhatsApp.';
      } finally { button.disabled=false; }
    });
  }
})();
