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
import type { RiskRewardInput } from '@/types';
import { Loader2 } from 'lucide-react';
import { formatRupiah, parseRupiah } from '@/lib/utils';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  capital: z.string().refine(val => parseRupiah(val) > 0, {message: "Capital must be greater than 0"}),
  riskPerTrade: z.coerce.number().min(0.1).max(100),
  winRate: z.coerce.number().min(0).max(100),
  targetProfit: z.string().optional(),
  rrTarget: z.string().optional(),
}).refine(data => {
    return !!data.targetProfit || !!data.rrTarget;
}, {
    message: "Either Target Profit or R:R Target must be provided.",
    path: ["targetProfit"], 
}).refine(data => {
    return !(data.targetProfit && data.rrTarget);
}, {
    message: "Cannot provide both Target Profit and R:R Target. The logic is reverse-engineered.",
    path: ["rrTarget"],
});


type RiskRewardFormProps = {
  onCalculate: (data: RiskRewardInput) => void;
  isLoading: boolean;
};

export function RiskRewardForm({ onCalculate, isLoading }: RiskRewardFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capital: 'Rp 100.000.000',
      riskPerTrade: 1,
      winRate: 50,
      targetProfit: '',
      rrTarget: '2',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        capital: parseRupiah(values.capital),
        riskPerTrade: values.riskPerTrade,
        winRate: values.winRate,
        targetProfit: values.targetProfit ? parseRupiah(values.targetProfit) : undefined,
        rrTarget: values.rrTarget ? parseFloat(values.rrTarget) : undefined,
    });
  }

  const handleRupiahChange = (field: "capital" | "targetProfit") => (e: React.ChangeEvent<HTMLInputElement>) => {
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
                name="capital"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Capital (Modal)</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("capital")} onBlur={field.onBlur}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="targetProfit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Target Profit (Optional)</FormLabel>
                    <FormControl>
                        <Input 
                            {...field} 
                            value={field.value ?? ''}
                            onChange={handleRupiahChange("targetProfit")} 
                            onBlur={field.onBlur}
                            placeholder="e.g., Rp 5.000.000"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rrTarget"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>R:R Target (e.g., 2 for 1:2)</FormLabel>
                    <FormControl>
                         <Input 
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder="e.g., 2.5"
                            step="0.1"
                        />
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

          <FormField
            control={form.control}
            name="winRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Win Rate (%)</FormLabel>
                 <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      min={1}
                      max={99}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="w-24 text-center"
                    min={1}
                    max={99}
                    step={1}
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
              Calculating Expectancy...
            </>
          ) : (
            'Calculate'
          )}
        </Button>
      </form>
    </Form>
  );
}
