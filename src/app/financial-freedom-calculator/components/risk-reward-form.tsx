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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const formSchema = z.object({
  capital: z.string().refine(val => parseRupiah(val) > 0, {message: "Capital must be greater than 0"}),
  riskPerTrade: z.coerce.number().min(0.1).max(100),
  winRate: z.coerce.number().min(0).max(100),
  riskRewardRatio: z.coerce.number({invalid_type_error: "R:R Ratio is required."}).min(0.1, {message: "R:R ratio must be at least 0.1."}),
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
      riskRewardRatio: 2,
    },
  });

  const traderProfiles = [
      { name: 'Retail Beginner', value: 45, description: 'Struggles with consistency (sub-50% WR).' },
      { name: 'Fair Game (Baseline)', value: 50, description: 'A 50/50 break-even starting point.' },
      { name: 'Professional Trader', value: 58, description: 'Disciplined with a consistent edge (55-60% WR).' },
      { name: 'Institutional System', value: 35, description: 'Low WR (30-40%), but very high R:R.' },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    onCalculate({
        capital: parseRupiah(values.capital),
        riskPerTrade: values.riskPerTrade,
        winRate: values.winRate,
        riskRewardRatio: values.riskRewardRatio,
    });
  }

  const handleRupiahChange = (field: "capital") => (e: React.ChangeEvent<HTMLInputElement>) => {
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
                name="riskRewardRatio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Risk:Reward Ratio (e.g., 2 for 1:2)</FormLabel>
                    <FormControl>
                         <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
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

          <FormField
            control={form.control}
            name="winRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Projected Win Rate (%)</FormLabel>
                <Select
                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    value={String(field.value)}
                >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a profile to set a win rate..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {traderProfiles.map((profile) => (
                          <SelectItem key={profile.name} value={String(profile.value)}>
                            <div>
                               <p className="font-semibold">{profile.name} ({profile.value}%)</p>
                               <p className="text-xs text-muted-foreground">{profile.description}</p>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex items-center gap-4 pt-2">
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
                    value={field.value}
                    onChange={e => {
                        const value = e.target.value;
                        field.onChange(value === '' ? '' : Number(value));
                    }}
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
            'Validate Strategy'
          )}
        </Button>
      </form>
    </Form>
  );
}
