
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