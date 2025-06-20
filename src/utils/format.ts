import { Currency } from '../types/wallet';

export function formatCurrency(amount: string, currency: Currency): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '0.00';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'ETH' ? 'USD' : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  return formatter.format(numAmount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
} 