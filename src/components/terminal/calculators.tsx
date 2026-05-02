
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function TerminalCalculators() {
  const [activeCalc, setActiveTab] = useState('pension');

  return (
    <div className="p-4 grid grid-cols-12 gap-4 h-full bg-black">
      <div className="col-span-12 lg:col-span-2 space-y-1">
        <div className="text-[10px] font-bold text-muted-foreground mb-2 px-2">ANALYST SUITE</div>
        {['pension', 'fire', 'trading', 'kelly', 'risk'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t)}
            className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase transition-all ${activeCalc === t ? 'bg-primary text-black' : 'hover:bg-muted text-muted-foreground'}`}
          >
            {t} ENGINE
          </button>
        ))}
      </div>

      <div className="col-span-12 lg:col-span-10 border border-border bg-card p-6 overflow-y-auto">
        {activeCalc === 'pension' && <PensionCalculator />}
        {activeCalc === 'fire' && <FireCalculator />}
        {activeCalc === 'trading' && <TradingPlanCalculator />}
      </div>
    </div>
  );
}

function PensionCalculator() {
  const [age, setAge] = useState(30);
  const [retAge, setRetAge] = useState(60);
  const [savings, setSavings] = useState(10000000);
  const [monthly, setMonthly] = useState(2000000);
  const [returns, setReturns] = useState(8);
  const [inflation, setInflation] = useState(4);

  const calculate = () => {
    const years = retAge - age;
    const months = years * 12;
    const r = (returns / 100) / 12;
    const fv = (savings * Math.pow(1 + r, months)) + (monthly * (Math.pow(1 + r, months) - 1) / r);
    const realFv = fv / Math.pow(1 + (inflation / 100), years);
    return { fv, realFv };
  };

  const { fv, realFv } = calculate();

  return (
    <div className="space-y-6">
      <div className="terminal-header"><span className="text-primary">PENSION CORPUS ANALYZER</span></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Horizon Params (Years)</Label>
            <div className="flex gap-2">
              <Input type="number" value={age} onChange={e => setAge(+e.target.value)} className="bg-black border-border h-8 text-[11px]" />
              <Input type="number" value={retAge} onChange={e => setRetAge(+e.target.value)} className="bg-black border-border h-8 text-[11px]" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Monthly Inflow (Rp)</Label>
            <Input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="bg-black border-border h-8 text-[11px]" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Expected Yield (%)</Label>
            <Input type="number" value={returns} onChange={e => setReturns(+e.target.value)} className="bg-black border-border h-8 text-[11px]" />
          </div>
        </div>

        <div className="bg-black/40 border border-border p-4 flex flex-col justify-center items-center text-center">
          <span className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Projected Corpus (Nominal)</span>
          <span className="text-3xl font-black text-primary tracking-tighter">Rp {Math.round(fv).toLocaleString('id-ID')}</span>
          
          <div className="mt-6 w-full border-t border-border pt-4">
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Purchasing Power (Inflation Adjusted)</span>
            <span className="text-xl font-black text-accent tracking-tighter">Rp {Math.round(realFv).toLocaleString('id-ID')}</span>
          </div>

          <div className="mt-6 bg-accent/10 border border-accent/20 p-3 w-full text-left">
            <div className="text-[9px] font-black text-accent uppercase mb-1">Hedge Fund Smart Rec:</div>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {realFv < 1000000000 ? "STRATEGY UNDERPERFORMING: Target not met. RECOMMENDATION: Increase monthly inflow by 25% or extend horizon by 5 years." : "STRATEGY ON TRACK: Maintain current asset allocation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FireCalculator() { return <div className="text-muted-foreground text-xs uppercase font-bold">FIRE Engine Initializing...</div>; }
function TradingPlanCalculator() { return <div className="text-muted-foreground text-xs uppercase font-bold">Trading Engine Initializing...</div>; }
