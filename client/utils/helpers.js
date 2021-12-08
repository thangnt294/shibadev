export const currencyFormatter = (data) => {
  return ((data.amount * 100) / 100).toLocaleString(data.currency, {
    style: "currency",
    currency: data.currency,
  });
};

export const isObjectEmpty = (obj) =>
  obj === null || obj === undefined || Object.keys(obj).length === 0;
