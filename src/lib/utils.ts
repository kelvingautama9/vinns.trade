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
    
    // In the browser, this will work as expected.
    // In Node.js (during SSR), you might need to ensure the full ICU data is available.
    return new Intl.NumberFormat(locale, options).format(amount);
}
  
export function parseCurrency(formattedAmount: string, currency: Currency): number {
    if (!formattedAmount || typeof formattedAmount !== 'string') return 0;

    let numericString: string;

    if (currency === 'IDR') {
        // For IDR, dots are thousands separators, and there are no decimals by our formatter.
        // We just need to remove non-digit characters.
        numericString = formattedAmount.replace(/[^0-9]/g, '');
    } else { // USD
        // For USD, remove commas, but keep the dot. This assumes a single dot is the decimal separator.
        // This won't handle international formats well, but is fine for `en-US` locale.
        numericString = formattedAmount.replace(/,/g, '');
    }
    
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? 0 : parsed;
}
