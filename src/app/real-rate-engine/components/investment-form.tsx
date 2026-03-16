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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { InvestmentInput } from '@/types';
import { Loader2 } from 'lucide-react';
import { cn, formatRupiah, parseRupiah } from '@/lib/utils';

const formSchema = z.object({
  currentSavings: z.string().refine(val => parseRupiah(val) >= 0, {message: "Must be a positive number"}),
  monthlySavings: z.string().refine(val => parseRupiah(val) >= 0, {message: "Must be a positive number"}),
  targetAmount: z.string().refine(val => parseRupiah(val) > 0, {message: "Must be a positive number"}),
  expectedReturnRate: z.coerce.number().min(0).max(100),
  inflationRate: z.coerce.number().min(0).max(100),
  timeHorizonYears: z.coerce.number().min(1).max(100),
  annuityType: z.enum(['ordinary', 'due']),
});

type InvestmentFormProps = {
  onCalculate: (data: InvestmentInput) => void;
  isLoading: boolean;
};

export function InvestmentForm({ onCalculate, isLoading }: InvestmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentSavings: 'Rp 10,000,000',
      monthlySavings: 'Rp 1,000,000',
      targetAmount: 'Rp 1,000,000,000',
      expectedReturnRate: 8,
      inflationRate: 5,
      timeHorizonYears: 10,
      annuityType: 'ordinary',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        ...values,
        currentSavings: parseRupiah(values.currentSavings),
        monthlySavings: parseRupiah(values.monthlySavings),
        targetAmount: parseRupiah(values.targetAmount),
    });
  }

  const handleRupiahChange = (field: "currentSavings" | "monthlySavings" | "targetAmount") => (e: React.ChangeEvent<HTMLInputElement>) => {
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
                name="currentSavings"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Savings</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("currentSavings")} onBlur={field.onBlur}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="monthlySavings"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monthly Savings</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("monthlySavings")} onBlur={field.onBlur} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Financial Goal (Target)</FormLabel>
                    <FormControl>
                        <Input {...field} onChange={handleRupiahChange("targetAmount")} onBlur={field.onBlur} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

          <FormField
            control={form.control}
            name="expectedReturnRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Annual Return (%)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      min={0}
                      max={30}
                      step={0.5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="w-20 text-center"
                    min={0}
                    max={30}
                    step={0.5}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inflationRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Inflation Rate (%)</FormLabel>
                 <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      min={0}
                      max={20}
                      step={0.5}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="w-20 text-center"
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeHorizonYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Horizon (Years)</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <Slider
                      min={1}
                      max={50}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="w-20 text-center"
                    min={1}
                    max={50}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annuityType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Deposit Timing</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ordinary" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        End of month (Ordinary Annuity)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="due" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Start of month (Annuity Due)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
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
            'Calculate Growth'
          )}
        </Button>
      </form>
    </Form>
  );
}
