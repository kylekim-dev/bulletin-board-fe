import { isNullOrEmpty } from "@/src/helpers/commonHelper";

const currencyPattern = /\s|\_|\(|\)|\-|\$|\%|\,/g;

export const toFloat = (val: string | null) => {
  if (val === null || val === undefined) {
    return null;
  }
  const convertedValue: number = parseFloat(
    val.replace(currencyPattern, "")
  );

  return convertedValue;
};

export const toInteger = (val: string | null) => {
  val = val + "";

  if (isNullOrEmpty(val)) {
    return null;
  }
  const convertedValue: number = parseInt(
    val.replace(currencyPattern, "")
  );

  return convertedValue;
};

export const toCurrency = (val: any | null) => {
  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  val = val ?? 0;

  return formatter.format(val);
};

export const toPercent = (val: any | null) => {
  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  val = (val ?? 0) / 100.00;

  return formatter.format(val);
};
