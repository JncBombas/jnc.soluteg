/**
 * animations.ts
 * Animações globais da landing page:
 *   1. Parallax sutil no grid do hero (somente desktop, mousemove)
 *   2. Smooth scroll com offset de 80px para o header sticky
 *
 * O scroll reveal está em reveal.ts (importado separadamente).
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────
   1. PARALLAX NO GRID DO HERO
   Atualiza --para-x e --para-y no :root
   conforme o mouse se move (desktop ≥1024px).
   A propriedade é lida pelo CSS do hero::before.
───────────────────────────────────────── */
(function initParallax(): void {
  if (reducedMotion) return;
  if (typeof window === 'undefined') return;
  if (window.innerWidth < 1024) return;

  let rafId: ReturnType<typeof requestAnimationFrame> | null = null;
  let lastX = 0;
  let lastY = 0;

  function applyParallax(): void {
    document.documentElement.style.setProperty('--para-x', lastX.toFixed(2));
    document.documentElement.style.setProperty('--para-y', lastY.toFixed(2));
    rafId = null;
  }

  window.addEventListener('mousemove', (e: MouseEvent) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    // Translação máxima: ±12px
    lastX = ((e.clientX - cx) / cx) * 12;
    lastY = ((e.clientY - cy) / cy) * 12;

    if (rafId === null) {
      rafId = requestAnimationFrame(applyParallax);
    }
  }, { passive: true });

  // Reseta ao sair da janela
  window.addEventListener('mouseleave', () => {
    document.documentElement.style.setProperty('--para-x', '0');
    document.documentElement.style.setProperty('--para-y', '0');
  });
})();

/* ─────────────────────────────────────────
   2. SMOOTH SCROLL COM OFFSET
   Intercepta cliques em âncoras internas e
   aplica scroll suave com 80px de offset
   para compensar o header sticky.
───────────────────────────────────────── */
(function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e: MouseEvent) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({
        top,
        behavior: reducedMotion ? 'instant' : 'smooth',
      });

      // Foca no alvo para acessibilidade
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
