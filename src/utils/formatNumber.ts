export const formatNumber = (number: number, locale: string = "en-US") =>
  new Intl.NumberFormat(locale).format(number);
