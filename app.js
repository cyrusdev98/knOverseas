// navscroll
(function(){
  const nav = document.querySelector('nav');
  const sent = document.getElementById('top-sentinel');

  sent.style.position = 'absolute';
  sent.style.top = '0';
  sent.style.left = '0';
  sent.style.width = '1px';
  sent.style.height = '1px';

  const io = new IntersectionObserver((entries) => {
    const atTop = entries[0].isIntersecting;
    nav.classList.toggle('scrolled', !atTop);
  }, { rootMargin: '0px', threshold: 0 });

  io.observe(sent);
})();





// mobile menu toggle
(function(){
  const nav = document.querySelector('nav');
  const btn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('navitems');

  if(!btn) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open);
    document.body.classList.toggle('no-scroll', open);
  });

  // close when a menu link is clicked
  menu.addEventListener('click', (e) => {
    if(e.target.closest('a')){
      nav.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });
})();



// service card

document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.service-card-div'));

  // Set first card as active on load
  if (cards.length) cards[0].classList.add('active');

  // Clicking any card opens it and closes the rest
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Helpful on mobile: bring opened card into view
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, false);
  });
});







//carousel

(function () {
  const section = document.querySelector('#popularc');
  const track   = section.querySelector('#city-carousel');
  const prevBtn = section.querySelector('.pc-arrow.prev');
  const nextBtn = section.querySelector('.pc-arrow.next');

  const SPEED = 2600;              // autoplay period
  let timer = null;

  // keep pristine markup for clean rebuilds
  if (!track.dataset.original) track.dataset.original = track.innerHTML;

  let N = 0, pv = 5, index = 0, step = 0;

  const perView = () => +getComputedStyle(section).getPropertyValue('--perView') || 5;
  const gap     = () => parseFloat(getComputedStyle(track).gap) || 0;

  const setTrans = on => track.style.transition = on ? 'transform .35s ease' : 'none';
  const apply    = () => track.style.transform = `translate3d(${-index * step}px,0,0)`;

  function measure(){
    const first = track.querySelector('.carousel-card');
    step = (first ? first.offsetWidth : 0) + gap();
  }

  // jump with forced reflow -> removes flick when looping
  function jump(to){
    setTrans(false);
    index = to;
    apply();
    void track.offsetHeight;       // force reflow to commit the jump
    setTrans(true);
  }

  function build(){
    track.innerHTML = track.dataset.original;
    const originals = Array.from(track.children);
    N  = originals.length;
    pv = perView();

    // clones on both sides
    for (let i = N - pv; i < N; i++) track.insertBefore(originals[i].cloneNode(true), track.firstChild).dataset.clone = '1';
    for (let i = 0; i < pv; i++)     track.appendChild(originals[i].cloneNode(true)).dataset.clone = '1';

    measure();
    jump(pv);                       // start at first REAL card
  }

  function next(){ index += 1; apply(); }
  function prev(){ index -= 1; apply(); }

  // seamless wrap without blink
  track.addEventListener('transitionend', () => {
    if (index >= pv + N)      jump(pv);          // from right clones -> first real
    else if (index < pv)      jump(pv + N - 1);  // from left clones  -> last real
  });

  function start(){ stop(); timer = setInterval(next, SPEED); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  nextBtn.addEventListener('click', () => { next(); start(); });
  prevBtn.addEventListener('click', () => { prev(); start(); });
  section.addEventListener('mouseenter', stop);
  section.addEventListener('mouseleave', start);

  // build only after images load (correct widths)
  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  const ready = () => { build(); start(); };
  if (!imgs.length) ready();
  imgs.forEach(img => img.complete
    ? (++loaded === imgs.length && ready())
    : img.addEventListener('load', () => { if (++loaded === imgs.length) ready(); })
  );

  // rebuild on breakpoint (perView) change
  let lastPV = perView();
  window.addEventListener('resize', () => {
    const nowPV = perView();
    if (nowPV !== lastPV){ lastPV = nowPV; build(); start(); }
    else { measure(); jump(index); }
  });
})();





//reviews


(function(){
  const viewport = document.getElementById('reviewsViewport');
  const track    = document.getElementById('reviewsTrack');
  const items    = Array.from(track.children);

  const getPerView = () =>
    Math.max(1, parseInt(getComputedStyle(viewport).getPropertyValue('--perView')) || 4);

  let pageIndex = 0;
  let pageStarts = [];

  function computePageStarts(){
    // compute the exact left offset of the first card in each page
    const pv = getPerView();
    const totalPages = Math.ceil(items.length / pv);
    pageStarts = new Array(totalPages).fill(0).map((_, p) => {
      const firstIndex = p * pv;
      const el = items[firstIndex];
      return el ? el.offsetLeft : 0;
    });
  }

  function goToPage(i){
    if (pageStarts.length === 0) return;
    const total = pageStarts.length;
    pageIndex = ((i % total) + total) % total;  // safe wrap
    const x = pageStarts[pageIndex];
    track.style.transform = `translateX(-${x}px)`;
  }

  // autoplay
  let timer = null;
  function start(){ stop(); timer = setInterval(()=> goToPage(pageIndex + 1), 3500); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  function init(){
    computePageStarts();
    goToPage(pageIndex);
  }

  // recalc on resize & after fonts render
  window.addEventListener('resize', init);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  }

  viewport.addEventListener('mouseenter', stop);
  viewport.addEventListener('mouseleave', start);

  init();
  start();
})();








(function(){
  const fabWrap  = document.getElementById('chat-fab');
  const toggle   = document.getElementById('fabToggle');
  const menu     = document.getElementById('fabMenu');
  const OPEN_CLS = 'open';

  function setOpen(open){
    fabWrap.classList.toggle(OPEN_CLS, open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    // swap icon: comments <-> xmark
    const icon = toggle.querySelector('i');
    if(open){
      icon.classList.remove('fa-comments');
      icon.classList.add('fa-xmark');
    }else{
      icon.classList.add('fa-comments');
      icon.classList.remove('fa-xmark');
    }
  }

  toggle.addEventListener('click', () => {
    setOpen(!fabWrap.classList.contains(OPEN_CLS));
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!fabWrap.contains(e.target)) setOpen(false);
  });

  // close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();