export const currencyFormatter = (data) => {
  return ((data.amount * 100) / 100).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};

export const isEmpty = (obj) =>
  obj === null || obj === undefined || obj.length === 0;

export const truncateText = (text, length) => {
  return text?.length > length ? text.substring(0, length) + "..." : text;
};

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return user._id;
  }
  return null;
};
