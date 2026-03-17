import { type Currency } from '@/types';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
  
export function parseCurrency(formattedAmount: string): number {
    if (!formattedAmount || typeof formattedAmount !== 'string') return 0;
    
    // Remove currency symbols and non-digit characters except for comma and period
    const cleaned = formattedAmount.toString().replace(/[^0-9,.]/g, '');

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');

    let numberString;

    // Determine if comma is decimal separator (e.g., European style like IDR)
    if (lastComma > lastDot) {
        // Replace all dots (thousands separators) and change comma to dot (decimal)
        numberString = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
        // Assume dot is decimal separator (e.g., US style)
        // Remove all commas (thousands separators)
        numberString = cleaned.replace(/,/g, '');
    }
    
    const parsed = parseFloat(numberString);
    return isNaN(parsed) ? 0 : parsed;
}
