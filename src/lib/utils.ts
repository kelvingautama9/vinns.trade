import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Currency } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency): string {
    if (isNaN(amount)) amount = 0;
    
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: currency,
    };

    if (currency === 'IDR') {
        options.minimumFractionDigits = 0;
        options.maximumFractionDigits = 0;
    } else { // USD
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 2;
    }
    
    const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
    
    return new Intl.NumberFormat(locale, options).format(amount);
}
  
export function parseCurrency(value: string, currency: Currency): number {
  if (typeof value !== 'string') return 0;
  
  // Remove currency symbols, spaces, and grouping separators.
  let cleanValue = value
    .replace(/^(Rp|\$)\s*/, '')
    .trim();

  if (currency === 'IDR') {
    // In 'id-ID' locale, '.' is a grouping separator.
    cleanValue = cleanValue.replace(/\./g, '');
  } else { // USD
    // In 'en-US' locale, ',' is a grouping separator.
    cleanValue = cleanValue.replace(/,/g, '');
  }

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}
