import { AmortizationTable } from "@/src/types";

export const calculateAmortizationTable = (
  loanAmount: number,
  interestRate: number,
  loanTermMonth: number
): AmortizationTable[] => {
  const monthlyInterestRate = interestRate / 1200; // Convert annual rate to monthly rate
  const numPayments = loanTermMonth; // Convert loan term to number of payments
  let balance = loanAmount;
  let monthlyPayment = 0;
  let amortizationTable: AmortizationTable[] = [];

  // Calculate the monthly payment using the formula
  const numerator =
    monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments);
  const denominator = Math.pow(1 + monthlyInterestRate, numPayments) - 1;
  monthlyPayment = loanAmount * (numerator / denominator);

  // Loop through each month and calculate the payment details
  for (let i = 1; i <= numPayments; i++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = balance - principalPayment;

    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + i);

    const payment: AmortizationTable = {
      paymentNumber: i,
      paymentDate: paymentDate,
      balance: balance,
      principalPayment: principalPayment,
      interestPayment: interestPayment,
      totalPayment: monthlyPayment,
    };
    amortizationTable.push(payment);
  }
  return amortizationTable;
}

export const calculateMonthlyPayment = (
  loanAmount: number,
  interestRate: number,
  loanTermMonth: number
) => {
    return calculateAmortizationTable(loanAmount, interestRate, loanTermMonth)[0].totalPayment;
//   const monthlyInterestRate = interestRate / 12 / 100;
//   const numPayments = loanTermMonth;
//   const denominator =
//     (1 - Math.pow(1 + monthlyInterestRate, -numPayments)) / monthlyInterestRate;
//   const principal = loanAmount / denominator;
//   const total = principal * numPayments;
//   const interest = total - loanAmount;

//   console.log(`${loanAmount} / ${interestRate} / ${loanTermMonth}`);
//   console.log(`${principal} / ${interest}`);

//   return {
//     principal,
//     interest,
//     total,
//   };
};
