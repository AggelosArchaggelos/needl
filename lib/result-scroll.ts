// One calm, bounded movement with zero velocity at both ends.
export function animateResultScroll(from: number, to: number, write: (value: number) => void) {
 let frame = 0;
 let start: number | null = null;
 const tick = (time: number) => {
  start ??= time;
  const progress = Math.min(1, (time - start) / 1200);
  const eased = (1 - Math.cos(Math.PI * progress)) / 2;
  write(from + (to - from) * eased);
  if (progress < 1) frame = requestAnimationFrame(tick);
 };
 frame = requestAnimationFrame(tick);
 return () => cancelAnimationFrame(frame);
}
