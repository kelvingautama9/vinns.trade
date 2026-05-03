'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';

export function TerminalCalculators() {
  const [activeEngine, setActiveEngine] = useState('trading');

  const engines = [
    { id: 'trading', label: 'TRADING PLAN' },
    { id: 'pension', label: 'PENSION V4.0' },
    { id: 'fire', label: 'FIRE NUM GEN' },
    { id: 'kelly', label: 'KELLY OPTIMAL' },
    { id: 'risk', label: 'RISK MATRIX' }
  ];

  return (
    <div className="p-0 grid grid-cols-12 gap-0 h-full bg-black">
      <div className="col-span-12 lg:col-span-2 border-r border-border">
        <div className="terminal-header"><span className="text-white">ANALYST_CORE</span></div>
        <div className="flex flex-col">
          {engines.map(e => (
            <button 
              key={e.id}
              onClick={() => setActiveEngine(e.id)}
              className={`text-left px-3 py-3 text-[10px] font-bold uppercase transition-none border-b border-border ${activeEngine === e.id ? 'bg-[#FFB000] text-black' : 'hover:bg-white/5 text-muted-foreground'}`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-10 bg-black p-6 overflow-y-auto relative">
        <div className="absolute top-2 right-4 text-[9px] text-muted-foreground font-bold">STATUS: <span className="text-[#0088FF]">ACTIVE_KERNEL</span></div>
        
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
    <div className="space-y-6">
      <div className="text-[14px] font-black text-[#FFB000] border-b border-border pb-1 mb-6 uppercase tracking-widest">Strategic Position Modeler</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Portfolio Capital (IDR)</Label>
              <input type="number" value={account} onChange={e => setAccount(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Margin Value (IDR)</Label>
              <input type="number" value={position} onChange={e => setPosition(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Entry</Label>
              <input type="number" value={entry} onChange={e => setEntry(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Stop Loss</Label>
              <input type="number" value={sl} onChange={e => setSl(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-1">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Take Profit</Label>
              <input type="number" value={tp} onChange={e => setTp(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-border p-6 grid grid-cols-2 gap-8">
          <div>
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase block mb-1">Lot Size</span>
            <span className="text-3xl font-black text-white tracking-tighter">{units.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase block mb-1">R:R Ratio</span>
            <span className={`text-3xl font-black tracking-tighter ${rr >= 2 ? 'text-[#0088FF]' : 'text-[#FF3B30]'}`}>1 : {rr.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase block mb-1">Risk Exposure</span>
            <span className="text-xl font-bold text-[#FF3B30]">Rp {risk.toLocaleString()}</span>
            <span className="text-[9px] text-[#8E8E93] block">({riskPct.toFixed(2)}% of Portfolio)</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase block mb-1">Profit Target</span>
            <span className="text-xl font-bold text-[#0088FF]">Rp {reward.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-white/10 p-4 bg-white/5">
        <div className="text-[9px] font-black text-[#FFB000] uppercase mb-2">Quant Advisory:</div>
        <p className="text-[11px] text-white leading-relaxed font-mono">
          {rr < 2 ? "WARNING: Risk efficiency below institutional floor (2.0). Advise widening target or tightening stop." : "OPTIMAL: Risk parameters align with Tier-1 hedge fund standards."}
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
    <div className="space-y-6">
      <div className="text-[14px] font-black text-[#FFB000] border-b border-border pb-1 mb-6 uppercase tracking-widest">Pension Corpus Analyzer V4.0</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Age Params (Current / Target)</Label>
            <div className="flex gap-2">
              <input type="number" value={age} onChange={e => setAge(+e.target.value)} className="terminal-input w-1/2" />
              <input type="number" value={retAge} onChange={e => setRetAge(+e.target.value)} className="terminal-input w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Monthly Contribution (IDR)</Label>
            <input type="number" value={monthly} onChange={e => setMonthly(+e.target.value)} className="terminal-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Exp. Yield %</Label>
              <input type="number" value={returns} onChange={e => setReturns(+e.target.value)} className="terminal-input w-full" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] text-[#8E8E93] uppercase font-bold">Inflation %</Label>
              <input type="number" value={inflation} onChange={e => setInflation(+e.target.value)} className="terminal-input w-full" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-border p-6 flex flex-col justify-center items-center text-center">
          <span className="text-[9px] font-bold text-[#8E8E93] uppercase mb-1">Final Corpus (Nominal)</span>
          <span className="text-4xl font-black text-[#0088FF] tracking-tighter">Rp {Math.round(fv).toLocaleString('id-ID')}</span>
          
          <div className="mt-8 w-full border-t border-white/10 pt-6">
            <span className="text-[9px] font-bold text-[#8E8E93] uppercase block mb-1">Purchasing Power (Real)</span>
            <span className="text-2xl font-black text-[#FFB000] tracking-tighter">Rp {Math.round(realFv).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FIRECalculator() { return <div className="text-[#8E8E93] text-[10px] uppercase font-bold p-10 text-center">FIRE Engine Booting...</div>; }
function KellyCalculator() { return <div className="text-[#8E8E93] text-[10px] uppercase font-bold p-10 text-center">Kelly Optimization Kernel Loading...</div>; }
function RiskCalculator() { return <div className="text-[#8E8E93] text-[10px] uppercase font-bold p-10 text-center">Risk Metric Matrix Initializing...</div>; }