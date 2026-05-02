
'use client';

import React, { useState, useEffect } from 'react';
import { SMCSignal } from '@/types/terminal';
import { detectMarketStructure } from '@/lib/smc-engine';

export function SignalFeed() {
  const [signals, setSignals] = useState<SMCSignal[]>([]);
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT'];

  useEffect(() => {
    const fetchAndScan = async () => {
      const newSignals: SMCSignal[] = [];
      
      for (const sym of symbols) {
        try {
          const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${sym}&interval=1h&limit=50`);
          const candles = await res.json();
          const signal = detectMarketStructure(sym.replace('USDT', '/USDT'), candles);
          if (signal) newSignals.push(signal);
        } catch (e) {}
      }
      
      if (newSignals.length > 0) {
        setSignals(prev => {
          const combined = [...newSignals, ...prev];
          return combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 50);
        });
      }
    };

    fetchAndScan();
    const interval = setInterval(fetchAndScan, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="terminal-header">
        <span>SMC LIVE FEED / ENGINE v3.0</span>
        <span className="text-primary flex items-center">
          <span className="animate-pulse mr-2">●</span> LIVE SCANNING
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-muted z-10">
            <tr className="text-[9px] text-muted-foreground font-bold uppercase">
              <th className="p-2 border-b border-border">Time</th>
              <th className="p-2 border-b border-border">Ticker</th>
              <th className="p-2 border-b border-border">Signal</th>
              <th className="p-2 border-b border-border">Price</th>
              <th className="p-2 border-b border-border">Strength</th>
              <th className="p-2 border-b border-border">Grade</th>
            </tr>
          </thead>
          <tbody className="text-[10px] font-bold">
            {signals.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse">WAITING FOR MARKET STRUCTURE SHIFT...</td></tr>
            ) : (
              signals.map((s) => (
                <tr key={s.id} className="border-b border-border/30 hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="p-2 text-muted-foreground">{s.time}</td>
                  <td className="p-2 text-accent">{s.ticker}</td>
                  <td className="p-2">
                    <span className={`px-1 py-0.5 ${s.type.includes('BULL') ? 'text-primary' : 'text-destructive'}`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="p-2">{s.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-2 h-2 ${i <= s.score ? (s.score === 3 ? 'bg-purple-500 shadow-[0_0_5px_purple]' : s.score === 2 ? 'bg-accent' : 'bg-blue-400') : 'bg-white/10'}`}></div>
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <span className={`text-[8px] px-1 py-0.5 rounded-sm ${s.quality === 'INSTITUTIONAL' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : s.quality === 'PROFESSIONAL' ? 'bg-accent/20 text-accent border border-accent/50' : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'}`}>
                      {s.quality}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
