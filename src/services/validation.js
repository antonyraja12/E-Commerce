export const removeSpaceAndSpecialChar = (event) => {
  if (!event.key.match(/[a-zA-Z0-9_,]/)) {
    event.preventDefault();
    return false;
  }
};
export const onlyNumber = (event) => {
  if (!event.key.match(/[0-9_,]/) || !event.key === "Backspace") {
    event.preventDefault();

    return false;
  }
};
