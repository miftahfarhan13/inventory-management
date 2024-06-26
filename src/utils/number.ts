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
    throw new Error("Total value cannot be zero.");
  }
  return Math.floor((part / total) * 100);
}
