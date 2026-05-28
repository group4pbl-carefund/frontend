export const formatRupiah = (value) => {
  const num = Number(value) || 0;
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} Miliar`;
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)} Juta`;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

export const formatRupiahFull = (value) => {
  const num = Number(value) || 0;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

export const formatDate = (date, variant = 'long') => {
  if (!date) return '-';
  const d = new Date(date);
  const variants = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    dayMonth: { day: 'numeric', month: 'long' },
    withTime: { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
  };
  return d.toLocaleDateString('id-ID', variants[variant] || variants.long);
};
