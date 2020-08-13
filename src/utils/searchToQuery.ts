export const searchToQuery = (search) => {
  return search
    .split("?")[1]
    .split("&")
    .reduce((prev, curr) => {
      const [key, value] = curr.split("=");
      return {
        ...prev,
        [key]: value
      };
    }, {});
};
