'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { PositionSizingInput, Currency } from '@/types';
import { Loader2 } from 'lucide-react';
import { formatCurrency, parseCurrency } from '@/lib/utils';
import { useEffect } from 'react';

const parsePlainNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
};

const formSchema = z.object({
  accountBalance: z.string(),
  positionValue: z.string(),
  entryPrice: z.string().refine(val => parsePlainNumber(val) >= 0, {message: "Entry Price must be a positive number"}),
  takeProfitPrice: z.string().refine(val => parsePlainNumber(val) >= 0, {message: "Take Profit must be a positive number"}),
  stopLossPrice: z.string().refine(val => parsePlainNumber(val) >= 0, {message: "Stop Loss must be a positive number"}),
}).refine(data => {
    const entry = parsePlainNumber(data.entryPrice);
    const sl = parsePlainNumber(data.stopLossPrice);
    if (entry > 0 && sl > 0) {
        return entry > sl;
    }
    return true;
}, {
    message: "Stop Loss must be below Entry Price for a long trade.",
    path: ["stopLossPrice"],
}).refine(data => {
    const entry = parsePlainNumber(data.entryPrice);
    const tp = parsePlainNumber(data.takeProfitPrice);
     if (entry > 0 && tp > 0) {
        return tp > entry;
    }
    return true;
}, {
    message: "Take Profit must be above Entry Price for a long trade.",
    path: ["takeProfitPrice"],
});

type PositionSizingFormProps = {
  onCalculate: (data: PositionSizingInput) => void;
  isLoading: boolean;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export function RiskRewardForm({ onCalculate, isLoading, currency, setCurrency }: PositionSizingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountBalance: formatCurrency(0, currency),
      positionValue: formatCurrency(0, currency),
      entryPrice: '0',
      takeProfitPrice: '0',
      stopLossPrice: '0',
    },
    mode: 'onChange',
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        accountBalance: parseCurrency(values.accountBalance, currency),
        positionValue: parseCurrency(values.positionValue, currency),
        entryPrice: parsePlainNumber(values.entryPrice),
        stopLossPrice: parsePlainNumber(values.stopLossPrice),
        takeProfitPrice: parsePlainNumber(values.takeProfitPrice),
    });
  }

  const handleCurrencyInput = (field: "accountBalance" | "positionValue", value: string) => {
    form.setValue(field, value, { shouldValidate: true });
  };
  
  const handleNumberInput = (field: "entryPrice" | "takeProfitPrice" | "stopLossPrice", value: string) => {
    const numValue = value.replace(/[^0-9.]/g, '');
    form.setValue(field, numValue, { shouldValidate: true });
  }

  const handleBlur = (field: "accountBalance" | "positionValue") => (e: React.FocusEvent<HTMLInputElement>) => {
    const numValue = parseCurrency(e.target.value, currency);
    form.setValue(field, formatCurrency(numValue, currency), { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <FormItem>
              <FormLabel>Currency</FormLabel>
               <p className="text-xs text-muted-foreground -mt-1.5">Select the currency for your calculations.</p>
              <RadioGroup
                defaultValue={currency}
                onValueChange={(value: string) => setCurrency(value as Currency)}
                className="flex items-center space-x-4 pt-2"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="IDR" id="idr" />
                  </FormControl>
                  <FormLabel htmlFor='idr' className="font-normal">IDR</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="USD" id="usd" />
                  </FormControl>
                  <FormLabel htmlFor='usd' className="font-normal">USD</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>

            <FormField
                control={form.control}
                name="accountBalance"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Balance</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The total capital in your trading account.</p>
                        <FormControl>
                            <Input {...field} onChange={(e) => handleCurrencyInput("accountBalance", e.target.value)} onBlur={handleBlur("accountBalance")} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="positionValue"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Position Value</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The total nominal value of the asset you want to buy.</p>
                        <FormControl>
                            <Input {...field} onChange={(e) => handleCurrencyInput("positionValue", e.target.value)} onBlur={handleBlur("positionValue")} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Entry Price (EP)</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The price at which you plan to open your position.</p>
                        <FormControl>
                            <Input type="text" {...field} onChange={(e) => handleNumberInput("entryPrice", e.target.value)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="takeProfitPrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Profit (TP)</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The price at which you plan to close for a profit.</p>
                        <FormControl>
                            <Input type="text" {...field} onChange={(e) => handleNumberInput("takeProfitPrice", e.target.value)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="stopLossPrice"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Target Cut Loss (CL)</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The price at which you will exit to prevent further losses.</p>
                        <FormControl>
                            <Input type="text" {...field} onChange={(e) => handleNumberInput("stopLossPrice", e.target.value)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate Position'
          )}
        </Button>
      </form>
    </Form>
  );
}
