export const numberInputOnWheelPreventChange = (e: any) => {
  // Prevent the input value change
  e.target.blur();

  // Prevent the page/container scrolling
  e.stopPropagation();

  // Refocus immediately, on the next tick (after the current function is done)
  setTimeout(() => {
    e.target.focus();
  }, 0);
};

export const formatter = new Intl.NumberFormat("id");

export function formatRupiah(amount: number) {
  if (amount >= 1_000_000_000) {
    return `Rp ${Math.floor(amount / 1_000_000_000)}m`;
  } else if (amount >= 1_000_000) {
    return `Rp ${Math.floor(amount / 1_000_000)}jt`;
  } else if (amount >= 1_000) {
    return `Rp ${Math.floor(amount / 1_000)}rb`;
  } else {
    return `Rp ${amount}`;
  }
}

export function calculatePercentage(part: number, total: number) {
  if (total === 0) {
    return 0;
  }
  return Math.floor((part / total) * 100);
}

export function formatNumberToIndonesian(number: number) {
  if (number >= 1_000_000_000) {
    return (number / 1_000_000_000).toFixed(1) + " Miliar";
  } else if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + " Juta";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + " Ribu";
  } else if (number >= 100) {
    return (number / 100).toFixed(1) + " Ratus";
  } else {
    return number.toString();
  }
}
