import BigNumber from "bignumber.js";

export const formatDisplayedBalance = (balance: string | number | BigNumber, decimalsDigits: number): string => {
  // will always display user balance rounded down
  const balanceBigNumber = new BigNumber(balance);
  let balanceNumber
  if (balanceBigNumber.gt(balanceBigNumber.toFixed(decimalsDigits))) {
    balanceNumber = balanceBigNumber.toFixed(decimalsDigits || 2, 1)
  } else {
    balanceNumber = balanceBigNumber.toFixed(2, 1)
  }
  return balanceNumber;
}