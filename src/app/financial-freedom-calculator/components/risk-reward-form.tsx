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

const formSchema = z.object({
  margin: z.string().refine(val => parseCurrency(val, 'IDR') >= 0 && parseCurrency(val, 'USD') >= 0, {message: "Margin must be a positive number"}),
  entryPrice: z.string().refine(val => parseCurrency(val, 'IDR') > 0 && parseCurrency(val, 'USD') > 0, {message: "Entry Price must be a positive number"}),
  takeProfitPrice: z.string().refine(val => parseCurrency(val, 'IDR') > 0 && parseCurrency(val, 'USD') > 0, {message: "Take Profit must be a positive number"}),
  stopLossPrice: z.string().refine(val => parseCurrency(val, 'IDR') > 0 && parseCurrency(val, 'USD') > 0, {message: "Stop Loss must be a positive number"}),
  maxRiskNominal: z.string().refine(val => parseCurrency(val, 'IDR') > 0 && parseCurrency(val, 'USD') > 0, {message: "Max Risk must be a positive number"}),
}).refine(data => parseCurrency(data.entryPrice, 'IDR') > parseCurrency(data.stopLossPrice, 'IDR') || parseCurrency(data.entryPrice, 'USD') > parseCurrency(data.stopLossPrice, 'USD'), {
    message: "Stop Loss must be below Entry Price for a long trade.",
    path: ["stopLossPrice"],
}).refine(data => parseCurrency(data.takeProfitPrice, 'IDR') > parseCurrency(data.entryPrice, 'IDR') || parseCurrency(data.takeProfitPrice, 'USD') > parseCurrency(data.entryPrice, 'USD'), {
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
      margin: 'Rp 0',
      entryPrice: 'Rp 0',
      takeProfitPrice: 'Rp 0',
      stopLossPrice: 'Rp 0',
      maxRiskNominal: 'Rp 0'
    },
  });

  const marginValue = parseCurrency(form.watch('margin'), currency);
  const maxRiskValue = parseCurrency(form.watch('maxRiskNominal'), currency);
  const riskPercent = marginValue > 0 ? (maxRiskValue / marginValue) * 100 : 0;

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        margin: parseCurrency(values.margin, currency),
        entryPrice: parseCurrency(values.entryPrice, currency),
        stopLossPrice: parseCurrency(values.stopLossPrice, currency),
        takeProfitPrice: parseCurrency(values.takeProfitPrice, currency),
        maxRiskNominal: parseCurrency(values.maxRiskNominal, currency),
    });
  }

  const handleCurrencyValueChange = (field: "margin" | "entryPrice" | "stopLossPrice" | "takeProfitPrice" | "maxRiskNominal") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = parseCurrency(value, currency);
    form.setValue(field, formatCurrency(numberValue, currency));
  }

  useEffect(() => {
    // Reformat all currency fields when currency changes
    const values = form.getValues();
    (Object.keys(values) as Array<keyof typeof values>).forEach(key => {
        const numValue = parseCurrency(values[key], currency === 'IDR' ? 'USD' : 'IDR'); // Parse with old currency
        form.setValue(key, formatCurrency(numValue, currency)); // Format with new currency
    });
  }, [currency, form]);


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
                name="margin"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Margin (Account Balance)</FormLabel>
                        <p className="text-xs text-muted-foreground -mt-1.5">The total capital in your trading account.</p>
                        <FormControl>
                            <Input {...field} onChange={handleCurrencyValueChange("margin")} onBlur={field.onBlur} />
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
                            <Input {...field} onChange={handleCurrencyValueChange("entryPrice")} onBlur={field.onBlur}/>
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
                            <Input {...field} onChange={handleCurrencyValueChange("takeProfitPrice")} onBlur={field.onBlur}/>
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
                            <Input {...field} onChange={handleCurrencyValueChange("stopLossPrice")} onBlur={field.onBlur}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="maxRiskNominal"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Max Risk per Trade</FormLabel>
                            {marginValue > 0 && (
                                <span className="text-xs font-medium text-muted-foreground">
                                    {riskPercent.toFixed(2)}% of Margin
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground -mt-1.5">The max amount of capital you are willing to lose on this trade.</p>
                        <FormControl>
                            <Input {...field} onChange={handleCurrencyValueChange("maxRiskNominal")} onBlur={field.onBlur}/>
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
