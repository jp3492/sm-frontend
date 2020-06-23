const listeners: any = [];

const handleClick = e => {
  console.log(e);

  Object.keys(listeners).forEach(query => {
    const outside = !e.target.closest(query);
    if (outside) {
      listeners[query](e);
      delete listeners[query];
      if (listeners.length === 0) {
        document.removeEventListener("click", handleClick);
      }
    }
  });
};

export const onClickOutside = (query, cb) => {
  if (listeners.length === 0) {
    document.addEventListener("click", handleClick);
  }
  listeners[query] = cb;
};