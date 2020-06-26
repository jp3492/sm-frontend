export const secondsToTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const [s, ms] = String(secs - minutes * 60).split(".");

  const seconds = s.length === 1 ? "0" + s : s;
  const miliseconds = ms ? String(ms).slice(0, 2) : 0;

  return `${minutes > 9 ? minutes : "0" + minutes}:${seconds}.${miliseconds}`;
};
