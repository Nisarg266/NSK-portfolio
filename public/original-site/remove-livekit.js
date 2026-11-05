(() => {
  const removeLiveKitCard = () => {
    const titleMatches = [...document.querySelectorAll('body *')].filter(node =>
      node.children.length === 0
        && node.textContent.replace(/\s+/g, ' ').trim().toLowerCase() === 'livekit meeting'
    );

    titleMatches.forEach(node => {
      const card = node.closest('.framer-a9tyv1-container')
        || node.closest('[data-framer-name^="Item "]')
        || node.closest('a');
      if (card && card !== document.body && card !== document.documentElement) card.remove();
    });
  };

  removeLiveKitCard();
  const observer = new MutationObserver(removeLiveKitCard);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', removeLiveKitCard, { once: true });
})();
