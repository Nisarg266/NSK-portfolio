(() => {
  if (window.__nskSingleOpenInstalledV2) return;
  window.__nskSingleOpenInstalledV2 = true;

  const groupSelector = '[data-framer-name^="Item "]';
  const openSelector = '.framer-kCkdh[data-framer-name="Desktop Open"], .framer-KHGvc[data-framer-name="Open"]';
  const closedSelector = '.framer-kCkdh[data-framer-name="Desktop Close"], .framer-KHGvc[data-framer-name="Closed"]';
  let preferredGroup = null;
  let correcting = false;
  let correctionTimer = 0;

  const groups = () => [...document.querySelectorAll(groupSelector)].filter(group =>
    group.querySelector('.framer-kCkdh, .framer-KHGvc')
  );
  const openCard = group => group && [...group.querySelectorAll(openSelector)].find(card => card.getClientRects().length);
  const visibleOpenCards = () => [...document.querySelectorAll(openSelector)].filter(card => card.getClientRects().length);

  function userLikeClick(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const eventInit = {
      bubbles: true, cancelable: true, view: window,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', isPrimary: true
    };
    element.dispatchEvent(new PointerEvent('pointerdown', eventInit));
    element.dispatchEvent(new MouseEvent('mousedown', eventInit));
    element.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0 }));
    element.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
    element.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
  }

  function enforceSingleOpen(keepGroup) {
    if (correcting) return;
    const opened = visibleOpenCards();
    if (opened.length < 2) return;
    const keep = openCard(keepGroup) || opened[0];
    const extras = opened.filter(card => card !== keep);
    if (!extras.length) return;
    correcting = true;
    extras.forEach(card => {
      const group = card.closest(groupSelector);
      const target = group?.querySelector('.framer-kCkdh, .framer-KHGvc');
      userLikeClick(target);
    });
    clearTimeout(correctionTimer);
    correctionTimer = setTimeout(() => {
      correcting = false;
      const remaining = visibleOpenCards();
      if (remaining.length > 1) enforceSingleOpen(keepGroup);
    }, 350);
  }

  document.addEventListener('click', event => {
    if (correcting) return;
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const clickedCard = target?.closest('.framer-kCkdh, .framer-KHGvc');
    const clickedGroup = clickedCard?.closest(groupSelector);
    if (!clickedGroup) return;
    preferredGroup = clickedGroup;
    setTimeout(() => enforceSingleOpen(clickedGroup), 120);
  }, true);

  const observer = new MutationObserver(() => {
    if (correcting) return;
    const opened = visibleOpenCards();
    if (opened.length > 1) enforceSingleOpen(preferredGroup || opened[0].closest(groupSelector));
  });
  observer.observe(document.documentElement, {
    subtree: true, attributes: true,
    attributeFilter: ['data-framer-name', 'class', 'style']
  });

  let tries = 0;
  function setInitialCard() {
    const first = groups()[0];
    if (!first) {
      if (++tries < 50) setTimeout(setInitialCard, 100);
      return;
    }
    preferredGroup = first;
    const opened = openCard(first);
    if (opened) {
      enforceSingleOpen(first);
      return;
    }
    const closed = [...first.querySelectorAll(closedSelector)].find(card => card.getClientRects().length);
    if (closed) userLikeClick(closed);
    if (++tries < 50) setTimeout(() => {
      const firstOpen = openCard(first);
      if (firstOpen) enforceSingleOpen(first);
      else setInitialCard();
    }, 180);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setInitialCard, { once: true });
  else setInitialCard();
})();
