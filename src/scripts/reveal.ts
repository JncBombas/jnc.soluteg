/**
 * reveal.ts
 * Sistema de animações de scroll por Intersection Observer.
 *
 * Uso nos templates:
 *   data-reveal           → fade + translateY (padrão)
 *   data-reveal="left"    → fade + translateX
 *   data-reveal="scale"   → fade + scale
 *   style="--reveal-delay: 150ms"  → delay escalonado
 *
 * Respeita prefers-reduced-motion: todos os elementos são
 * revelados imediatamente sem transição quando a preferência
 * por movimento reduzido estiver ativa.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) return;

  /* Sem animação: revela tudo imediatamente */
  if (reducedMotion) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.classList.add('is-revealed');
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '-32px 0px',
    }
  );

  targets.forEach((el) => observer.observe(el));
})();
