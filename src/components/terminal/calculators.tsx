'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';

export function TerminalCalculators() {
  const [activeEngine, setActiveEngine] = useState('trading');

  const engines = [
    { id: 'trading', label: 'TRADING PLAN' },
    { id: 'pension', label: 'PENSION ENGINE' },
    { id: 'fire', label: 'FIRE NUM ANALYZER' },
    { id: 'kelly', label: 'KELLY OPTIMAL' },
    { id: 'risk', label: 'PORTFOLIO RISK' }
  ];

  return (
    <div className="p-4 grid grid-cols-12 gap-4 h-full bg-black">
      <div className="col-span-12 lg:col-span-2 space-y-1">
        <div className="text-[10px] font-bold text-muted-foreground mb-4 px-2 tracking-widest border-b border-border pb-1">ANALYST SUITE V4.0</div>
        {engines.map(e => (
          <button 
            key={e.id}
            onClick={() => setActiveEngine(e.id)}
            className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase transition-all ${activeEngine === e.id ? 'bg-primary text-black' : 'hover:bg-muted text-muted-foreground'}`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="col-span-12 lg:col-span-10 border border-border bg-card p-6 overflow-y-auto relative">
        <div className="absolute top-2 right-4 text-[9px] text-muted-foreground font-bold uppercase">Engine Status: <span className="text-primary">ONLINE</span></div>
        
        {activeEngine === 'trading' && <TradingPlanCalculator />}
        {activeEngine === 'pension' && <PensionCalculator />}
        {activeEngine === 'fire' && <FIRECalculator />}
        {activeEngine === 'kelly' && <KellyCalculator />}
        {activeEngine === 'risk' && <RiskCalculator />}
      </div>
    </div>
  );
}

function TradingPlanCalculator() {
  const [account, setAccount] = useState(100000000);
  const [position, setPosition] = useState(10000000);
  const [entry, setEntry] = useState(50000);
  const [sl, setSl] = useState(48000);
  const [tp, setTp] = useState(56000);

  const units = position / entry;
  const risk = (entry - sl) * units;
  const reward = (tp - entry) * units;
  const rr = reward / risk;
  const riskPct = (risk / account) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="terminal-header"><span className="text-primary">STRATEGIC TRADING PLANNER</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase font-bold">Total Capital (IDR)</Label>
              <input type="number" value={account} onChange={e => setAccount(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase font-bold">Position Value (IDR)</Label>
              <input type="number" value={position} onChange={e => setPosition(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase font-bold">Entry Price</Label>
              <input type="number" value={entry} onChange={e => setEntry(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase font-bold">Stop Loss</Label>
              <input type="number" value={sl} onChange={e => setSl(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-muted-foreground uppercase font-bold">Take Profit</Label>
              <input type="number" value={tp} onChange={e => setTp(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
        </div>

        <div className="bg-black/60 border border-border p-6 grid grid-cols-2 gap-6">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Execution Units</span>
            <span className="text-2xl font-black text-primary tracking-tighter">{units.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Reward/Risk Ratio</span>
            <span className={`text-2xl font-black tracking-tighter ${rr >= 2 ? 'text-primary' : 'text-destructive'}`}>1 : {rr.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Risk Exposure</span>
            <span className="text-lg font-bold text-destructive">Rp {risk.toLocaleString()}</span>
            <span className="text-[9px] text-muted-foreground block">({riskPct.toFixed(2)}% of Portfolio)</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Profit Target</span>
            <span className="text-lg font-bold text-primary">Rp {reward.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-accent/10 border border-accent/20 p-4">
        <div className="text-[9px] font-black text-accent uppercase mb-2">Hedge Fund Smart Rec:</div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {rr < 2 ? "WARNING: Setup efficiency is below institutional standards (R:R < 2.0). RECOMMENDATION: Tighten stop loss or identify higher liquidity targets." : "OPTIMAL: Setup meets professional risk parameters. Ensure diversification score remains > 0.70."}
        </p>
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

  const years = retAge - age;
  const months = years * 12;
  const r = (returns / 100) / 12;
  const fv = (savings * Math.pow(1 + r, months)) + (monthly * (Math.pow(1 + r, months) - 1) / r);
  const realFv = fv / Math.pow(1 + (inflation / 100), years);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="terminal-header"><span className="text-primary">PENSION CORPUS ANALYZER</span></div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Horizon Params (Current / Target)</Label>
            <div className="flex gap-2">
              <input type="number" value={age} onChange={e => setAge(+e.target.value)} className="terminal-input w-1/2" />
              <input type="number" value={retAge} onChange={e => setRetAge(+e.target.value)} className="terminal-input w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase font-bold">Monthly Inflow (Rp)</Label>
            <input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="terminal-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Expected Yield (%)</Label>
              <input type="number" value={returns} onChange={e => setReturns(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] text-muted-foreground uppercase font-bold">Inflation (%)</Label>
              <input type="number" value={inflation} onChange={e => setInflation(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-border p-4 flex flex-col justify-center items-center text-center">
          <span className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Projected Corpus (Nominal)</span>
          <span className="text-3xl font-black text-primary tracking-tighter">Rp {Math.round(fv).toLocaleString('id-ID')}</span>
          
          <div className="mt-6 w-full border-t border-border pt-4">
            <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Purchasing Power (Real)</span>
            <span className="text-xl font-black text-accent tracking-tighter">Rp {Math.round(realFv).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FIRECalculator() { return <div className="text-muted-foreground text-xs uppercase font-bold p-10 text-center animate-pulse">FIRE Engine Initializing... [v4.0]</div>; }
function KellyCalculator() { return <div className="text-muted-foreground text-xs uppercase font-bold p-10 text-center animate-pulse">Kelly Criterion Engine Initializing...</div>; }
function RiskCalculator() { return <div className="text-muted-foreground text-xs uppercase font-bold p-10 text-center animate-pulse">Risk Metric Engine Initializing...</div>; }
