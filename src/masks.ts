
import createNumberMask from "text-mask-addons/dist/createNumberMask";

export const currencyMask = createNumberMask({
  prefix: "$",
  suffix: "",
  allowDecimal: true,
  decimalLimit: 2,
  integerLimit: 10,
  allowNegative: true,
});

export const percentageMask = createNumberMask({
  prefix: "",
  suffix: "%",
  allowDecimal: true,
  decimalLimit: 2,
  integerLimit: 3,
  allowNegative: true,
});

export const creditMask = [
  /\d/,
  /\d/,
  /\d/,
];

export const telMask = [
  "(",
  /[1-9]/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

// export const pointMask = createNumberMask({
//     prefix: "",
//     suffix: "%",
//     allowDecimal: true,
//     decimalLimit: 6,
//     integerLimit: 3,
//     allowNegative: true,
//   });

export const pointMask = [
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];