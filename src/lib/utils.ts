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
  
export function parseCurrency(formattedAmount: string): number {
    if (!formattedAmount || typeof formattedAmount !== 'string') return 0;
    
    // Remove currency symbols and other non-numeric characters, but keep ',' and '.'
    // This is a simplified approach. A more robust solution might be needed for i18n
    const cleaned = formattedAmount.toString().replace(/[^0-9,.]/g, '');

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');

    let numberString;

    // This logic handles both '1.234,56' (IDR) and '1,234.56' (USD) style formats
    if (lastComma > lastDot) {
        // Comma is the decimal separator, so remove dots and replace comma
        numberString = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
        // Dot is the decimal separator, so just remove commas
        numberString = cleaned.replace(/,/g, '');
    }
    
    const parsed = parseFloat(numberString);
    return isNaN(parsed) ? 0 : parsed;
}
