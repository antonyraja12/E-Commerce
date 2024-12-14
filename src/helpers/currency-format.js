function getLocaleCode(currencyCode) {
  const currencyCodeToLocale = {
    USD: "en-US",
    INR: "en-IN",
  };

  return currencyCodeToLocale[currencyCode] || "en-US";
}

export function formatCurrency(amount, currencyCode = "INR") {
  const localeCode = getLocaleCode(currencyCode);

  return amount.toLocaleString(localeCode, {
    style: "currency",
    currency: currencyCode,
  });
}
