// Canvas confetti when a spend milestone unlocks in the cart drawer.
export function confetti(cv: HTMLCanvasElement | null) {
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const w = (cv.width = cv.clientWidth);
  const h = (cv.height = cv.clientHeight);
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const colors = ['#5F259F', '#C8E616', '#15b79e', '#ffdc07', '#eb6738', '#6fa8ff'];
  const ps = Array.from({ length: 70 }, () => ({
    x: w * (0.2 + Math.random() * 0.6),
    y: h * 0.2,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 9 - 2,
    s: 4 + Math.random() * 5,
    r: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.4,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now();
  const frame = (now: number) => {
    const k = (now - t0) / 1700;
    ctx.clearRect(0, 0, w, h);
    if (k >= 1) return;
    ps.forEach(p => {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = 1 - k * k;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    });
    requestAnimationFrame(frame);
  };
  frame(t0);
}
