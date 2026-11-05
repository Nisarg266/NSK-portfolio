// The Framer router can replace exported links during hydration. Work always opens the local collection.
window.addEventListener('click', event => {
  const link = event.target.closest?.('[href]');
  if (!link || event.button !== 0) return;
  const url = new URL(link.getAttribute('href'), document.baseURI);
  if (url.origin !== location.origin && url.hostname !== 'nskstudietech.framer.website') return;
  if (!/(?:^|\/)(?:portfolios\/?|work\/index\.html)$/.test(url.pathname)) return;
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  location.assign('/original-site/work/index.html');
}, true);
