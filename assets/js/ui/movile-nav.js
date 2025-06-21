// assets/js/ui/mobile-nav.js

export function initMobileNav() {
  const mobileMain = document.querySelectorAll('.mobile-nav-main li');
  const mobileSubs = document.querySelectorAll('.mobile-nav-sub');

  function hideAllSubs() {
    mobileSubs.forEach(ul => ul.style.display = 'none');
  }

  mobileMain.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      mobileMain.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hideAllSubs();
      const subUl = document.querySelector(`.mobile-nav-sub.${btn.dataset.group}`);
      if (subUl) subUl.style.display = 'flex';
    });
  });

  document.querySelectorAll('.mobile-nav-sub li').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      const section = item.dataset.section;
      if (section) document.querySelector(`.nav-item[data-section="${section}"]`).click();
      hideAllSubs();
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.mobile-nav')) hideAllSubs();
  });
}
