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
import { Loader2, Info } from 'lucide-react';
import { formatCurrency, parseCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const parsePlainNumber = (value: string | number): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const parsed = parseFloat(value.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
};

const formSchema = z.object({
  accountBalance: z.string(),
  positionValue: z.string(),
  entryPrice: z.string().refine(val => parsePlainNumber(val) > 0, {message: "Entry Price must be a positive number"}),
  takeProfitPrice: z.string().refine(val => parsePlainNumber(val) > 0, {message: "Take Profit must be a positive number"}),
  stopLossPrice: z.string().refine(val => parsePlainNumber(val) > 0, {message: "Stop Loss must be a positive number"}),
}).refine(data => {
    const entry = parsePlainNumber(data.entryPrice);
    const sl = parsePlainNumber(data.stopLossPrice);
    if (entry > 0 && sl > 0) return entry > sl;
    return true;
}, {
    message: "Stop Loss must be below Entry Price.",
    path: ["stopLossPrice"],
}).refine(data => {
    const entry = parsePlainNumber(data.entryPrice);
    const tp = parsePlainNumber(data.takeProfitPrice);
    if (entry > 0 && tp > 0) return tp > entry;
    return true;
}, {
    message: "Take Profit must be above Entry Price.",
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
      accountBalance: '0',
      positionValue: '0',
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

  const handleCurrencyBlur = (field: "accountBalance" | "positionValue") => (e: React.FocusEvent<HTMLInputElement>) => {
    const numValue = parseCurrency(e.target.value, currency);
    form.setValue(field, formatCurrency(numValue, currency), { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Currency</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>Pilih mata uang yang digunakan untuk saldo dan nilai transaksi.</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup
                defaultValue={currency}
                onValueChange={(value: string) => {
                  setCurrency(value as Currency);
                  form.setValue("accountBalance", formatCurrency(parseCurrency(form.getValues("accountBalance"), currency), value as Currency));
                  form.setValue("positionValue", formatCurrency(parseCurrency(form.getValues("positionValue"), value as Currency), value as Currency));
                }}
                className="flex items-center space-x-4 pt-2"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl><RadioGroupItem value="IDR" id="idr" /></FormControl>
                  <FormLabel htmlFor='idr' className="font-normal">IDR</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl><RadioGroupItem value="USD" id="usd" /></FormControl>
                  <FormLabel htmlFor='usd' className="font-normal">USD</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>

            <FormField
                control={form.control}
                name="accountBalance"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormLabel>Account Balance</FormLabel>
                            <span className="text-xs text-muted-foreground">Total saldo di wallet/akun Anda.</span>
                        </div>
                        <FormControl>
                            <Input {...field} placeholder="Contoh: 10.000.000" onBlur={handleCurrencyBlur("accountBalance")} />
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
                        <div className="flex items-center gap-2">
                            <FormLabel>Position Value (Margin)</FormLabel>
                            <span className="text-xs text-muted-foreground">Berapa rupiah/dollar yang ingin Anda belanjakan?</span>
                        </div>
                        <FormControl>
                            <Input {...field} placeholder="Contoh: 1.000.000" onBlur={handleCurrencyBlur("positionValue")} />
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
                        <div className="flex items-center gap-2">
                            <FormLabel>Entry Price</FormLabel>
                            <span className="text-xs text-muted-foreground">Harga saat Anda membeli aset.</span>
                        </div>
                        <FormControl>
                            <Input type="text" {...field} placeholder="Contoh: 72000" />
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
                        <div className="flex items-center gap-2">
                            <FormLabel>Target Profit (TP)</FormLabel>
                            <span className="text-xs text-muted-foreground">Harga jual saat untung.</span>
                        </div>
                        <FormControl>
                            <Input type="text" {...field} placeholder="Contoh: 100000" />
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
                        <div className="flex items-center gap-2">
                            <FormLabel>Stop Loss (CL)</FormLabel>
                            <span className="text-xs text-muted-foreground">Harga jual saat rugi (cut loss).</span>
                        </div>
                        <FormControl>
                            <Input type="text" {...field} placeholder="Contoh: 65000" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Calculating...</>
          ) : (
            'Calculate Risk & Reward'
          )}
        </Button>
      </form>
    </Form>
  );
}