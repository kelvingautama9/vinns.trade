
'use client';

import React, { useState, useEffect } from 'react';

export function TerminalHeader() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tickers = [
    { s: 'BTC/USDT', p: '63,842.20', c: '+2.4%', up: true },
    { s: 'ETH/USDT', p: '3,142.15', c: '+1.8%', up: true },
    { s: 'SOL/USDT', p: '145.30', c: '-0.5%', up: false },
    { s: 'BNB/USDT', p: '582.40', c: '+0.2%', up: true },
    { s: 'XRP/USDT', p: '0.52', c: '-1.1%', up: false },
  ];

  return (
    <header className="bg-black h-11 flex items-center border-b border-border relative overflow-hidden shrink-0">
      <div className="bg-primary h-full px-4 flex items-center font-black tracking-tighter text-black text-sm italic z-10 skew-x-[-12deg] -ml-2">
        VINNS.TRADE
      </div>
      
      <div className="flex-1 flex items-center overflow-hidden h-full whitespace-nowrap">
        <div className="flex animate-marquee">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="inline-flex items-center mx-6 text-[10px] font-bold">
              <span className="text-muted-foreground mr-2">{t.s}</span>
              <span className="mr-2">{t.p}</span>
              <span className={t.up ? 'text-primary' : 'text-destructive'}>
                {t.up ? '▲' : '▼'} {t.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full border-l border-border px-4 flex items-center gap-6 bg-black z-10">
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-muted-foreground font-bold leading-none">TIME (UTC)</span>
          <span className="text-[11px] font-bold text-accent leading-none mt-1">{time}</span>
        </div>
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-muted-foreground font-bold leading-none">SERVER</span>
          <span className="text-[11px] font-bold text-primary leading-none mt-1 uppercase">HK-PROD-01</span>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
}
