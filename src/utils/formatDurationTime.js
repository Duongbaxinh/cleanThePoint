export function formatDuration(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

export function countUp(durationMs, stepMs = 50, onTick, onComplete) {
  let elapsed = 0;
  const intervalId = setInterval(() => {
    elapsed += stepMs;
    onTick(elapsed);
    if (elapsed >= durationMs) {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, stepMs);
  return () => clearInterval(intervalId);
}

export function countDown(durationMs = 3000, stepMs = 100) {
  let remaining = durationMs;
  const intervalId = setInterval(() => {
    remaining -= stepMs;
    if (remaining <= 0) {
      clearInterval(intervalId);
    }
  }, stepMs);
  return () => clearInterval(intervalId);
}
