export const timestampToTimePassed = (ms) => {
  const diff = Date.now() - ms;
  // check if we are looking at
  if (diff < 60000) {
    return `${(diff / 1000).toFixed(0)} sec`;
  } else if (diff < 3600000) {
    return `${(diff / 600000).toFixed(0)} min`;
  } else if (diff < 86400000) {
    return `${(diff / 3600000).toFixed(0)} h`;
  } else {
    return `${(diff / 86400000).toFixed(0)} d`;
  }
};
