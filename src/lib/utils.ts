import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
}
  
export function parseRupiah(formattedAmount: string): number {
    if (!formattedAmount || typeof formattedAmount !== 'string') return 0;
    const numberString = formattedAmount.replace(/[^0-9,]/g, '').replace(',', '.');
    const parsed = parseFloat(numberString);
    return isNaN(parsed) ? 0 : parsed;
}
