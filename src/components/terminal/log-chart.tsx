
'use client';

import React from 'react';

export function LogChart() {
  return (
    <div className="w-full h-full bg-[#030508] relative overflow-hidden group">
      <div className="terminal-header">
        <span>BTC/USDT LOGARITHMIC PERSPECTIVE</span>
        <div className="flex gap-4">
          <span className="text-muted-foreground">O: 63,401</span>
          <span className="text-primary">H: 64,120</span>
          <span className="text-destructive">L: 63,200</span>
          <span className="text-white">C: 63,842</span>
        </div>
      </div>
      
      <div className="h-full flex items-center justify-center p-8 opacity-40">
        <svg viewBox="0 0 800 300" className="w-full h-full">
          <path d="M0,250 Q100,240 200,180 T400,150 T600,80 T800,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
          <path d="M0,280 Q150,270 300,200 T600,150 T800,100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" className="text-accent" />
          
          {/* Mock Grid */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="#1a2535" strokeWidth="1" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="#1a2535" strokeWidth="1" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="#1a2535" strokeWidth="1" />
          <line x1="0" y1="200" x2="800" y2="200" stroke="#1a2535" strokeWidth="1" />
          
          <text x="750" y="45" className="text-[10px] fill-muted-foreground font-mono">100k</text>
          <text x="750" y="95" className="text-[10px] fill-muted-foreground font-mono">50k</text>
          <text x="750" y="145" className="text-[10px] fill-muted-foreground font-mono">25k</text>
          <text x="750" y="195" className="text-[10px] fill-muted-foreground font-mono">10k</text>
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-black/80 border border-primary/50 px-4 py-2 text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">
          TradingView Widget Loading (Logarithmic Scale)
        </div>
      </div>
    </div>
  );
}
