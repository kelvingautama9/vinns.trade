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
import { Slider } from '@/components/ui/slider';
import type { PositionSizingInput } from '@/types';
import { Loader2 } from 'lucide-react';
import { formatRupiah, parseRupiah } from '@/lib/utils';

const formSchema = z.object({
  totalCapital: z.string().refine(val => parseRupiah(val) > 0, {message: "Capital must be greater than 0"}),
  riskPerTrade: z.coerce.number().min(0.1).max(10),
  entryPrice: z.string().refine(val => parseRupiah(val) > 0, {message: "Entry Price must be a positive number"}),
  stopLossPrice: z.string().refine(val => parseRupiah(val) > 0, {message: "Stop Loss must be a positive number"}),
  takeProfitPrice: z.string().refine(val => parseRupiah(val) > 0, {message: "Take Profit must be a positive number"}),
}).refine(data => parseRupiah(data.entryPrice) > parseRupiah(data.stopLossPrice), {
    message: "Stop Loss must be below Entry Price",
    path: ["stopLossPrice"],
}).refine(data => parseRupiah(data.takeProfitPrice) > parseRupiah(data.entryPrice), {
    message: "Take Profit must be above Entry Price",
    path: ["takeProfitPrice"],
});

type PositionSizingFormProps = {
  onCalculate: (data: PositionSizingInput) => void;
  isLoading: boolean;
};

export function RiskRewardForm({ onCalculate, isLoading }: PositionSizingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCapital: 'Rp 100.000.000',
      riskPerTrade: 1,
      entryPrice: 'Rp 0',
      stopLossPrice: 'Rp 0',
      takeProfitPrice: 'Rp 0',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        totalCapital: parseRupiah(values.totalCapital),
        riskPerTrade: values.riskPerTrade,
        entryPrice: parseRupiah(values.entryPrice),
        stopLossPrice: parseRupiah(values.stopLossPrice),
        takeProfitPrice: parseRupiah(values.takeProfitPrice),
    });
  }

  const handleRupiahChange = (field: "totalCapital" | "entryPrice" | "stopLossPrice" | "takeProfitPrice") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberValue = parseRupiah(value);
    form.setValue(field, formatRupiah(numberValue));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="totalCapital"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Capital</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("totalCapital")} onBlur={field.onBlur}/>
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
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("entryPrice")} onBlur={field.onBlur}/>
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
                    <FormLabel>Stop Loss Price</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("stopLossPrice")} onBlur={field.onBlur}/>
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
                    <FormLabel>Take Profit Price</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("takeProfitPrice")} onBlur={field.onBlur}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

          <FormField
            control={form.control}
            name="riskPerTrade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Per Trade (%)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-24 text-center"
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                </div>
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
