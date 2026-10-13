export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const inrSp = (n: number) => inr(n).replace('₹', '₹ ');
export const inr2 = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pctOff = (mrp: number, price: number) => Math.round((1 - price / mrp) * 100);
