'use client';

import React, { useState, useEffect } from 'react';

export function TerminalHeader() {
  const [time, setTime] = useState('');
  const [tickers, setTickers] = useState([
    { s: 'BTC/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'ETH/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'NVDA', p: '894.20', c: '+2.1%', up: true },
    { s: 'NASDAQ', p: '16,420', c: '+0.8%', up: true },
    { s: 'GOLD', p: '2,345', c: '-0.2%', up: false },
  ]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);

    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await res.json();
        const crypto = data.filter((d: any) => ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'].includes(d.symbol));
        
        setTickers(prev => prev.map(t => {
          const match = crypto.find((c: any) => c.symbol === t.s.replace('/', ''));
          if (match) {
            return {
              ...t,
              p: parseFloat(match.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              c: (parseFloat(match.priceChangePercent) >= 0 ? '+' : '') + parseFloat(match.priceChangePercent).toFixed(2) + '%',
              up: parseFloat(match.priceChangePercent) >= 0
            };
          }
          // Jitter for synthetic assets
          const current = parseFloat(t.p.replace(/,/g, ''));
          const jitter = (Math.random() - 0.5) * (current * 0.0001);
          return { ...t, p: (current + jitter).toLocaleString(undefined, { minimumFractionDigits: 2 }) };
        }));
      } catch (e) {}
    };

    fetchPrices();
    const priceTimer = setInterval(fetchPrices, 3000);
    return () => { clearInterval(timer); clearInterval(priceTimer); };
  }, []);

  return (
    <header className="bg-black h-11 flex items-center border-b border-border relative overflow-hidden shrink-0">
      <div className="bg-[#FFB000] h-full px-4 flex items-center font-black tracking-tighter text-black text-xs italic z-10 skew-x-[-12deg] -ml-2">
        VINNS.TRADE
      </div>
      
      <div className="flex-1 flex items-center overflow-hidden h-full whitespace-nowrap">
        <div className="flex animate-marquee">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="inline-flex items-center mx-6 text-[10px] font-bold">
              <span className="text-muted-foreground mr-2">{t.s}</span>
              <span className="mr-2 text-white">{t.p}</span>
              <span className={t.up ? 'text-[#0088FF]' : 'text-[#FF3B30]'}>
                {t.up ? '▲' : '▼'} {t.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full border-l border-border px-4 flex items-center gap-6 bg-black z-10">
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-[#FFB000] font-bold leading-none">TIME (UTC)</span>
          <span className="text-[11px] font-bold text-white leading-none mt-1">{time}</span>
        </div>
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-[#0088FF] font-bold leading-none">SERVER</span>
          <span className="text-[11px] font-bold text-white leading-none mt-1 uppercase">PROD-ONLINE</span>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
}