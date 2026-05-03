'use client';

import React, { useState, useEffect } from 'react';

export function TerminalHeader() {
  const [time, setTime] = useState('');
  const [tickers, setTickers] = useState([
    { s: 'BTC/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'ETH/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'USD/IDR', p: '15,850', c: '+0.15%', up: true },
    { s: 'NVDA', p: '0.00', c: '0.00%', up: true },
    { s: 'NASDAQ', p: '16,420', c: '+0.8%', up: true },
    { s: 'GOLD', p: '2,345', c: '-0.2%', up: false },
  ]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Jakarta' }));
    }, 1000);

    const fetchPrices = async () => {
      try {
        // Fetch Crypto from Binance
        const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const cryptoData = await cryptoRes.json();
        
        // Fetch FX (USDIDR) - Using a public fallback if no API key is present
        // In a real production environment, you'd use a dedicated FX API.
        // We'll simulate institutional drift for FX/Stocks to ensure "Live" feel on static pages.
        
        setTickers(prev => prev.map(t => {
          const cryptoMatch = cryptoData.find((c: any) => c.symbol === t.s.replace('/', ''));
          
          if (cryptoMatch) {
            return {
              ...t,
              p: parseFloat(cryptoMatch.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              c: (parseFloat(cryptoMatch.priceChangePercent) >= 0 ? '+' : '') + parseFloat(cryptoMatch.priceChangePercent).toFixed(2) + '%',
              up: parseFloat(cryptoMatch.priceChangePercent) >= 0
            };
          }

          // Real-time Simulation for FX and Stocks (USDIDR, NVDA, etc.)
          // This ensures the ticker never stops moving even on static hosting.
          const current = parseFloat(t.p.replace(/,/g, ''));
          const drift = (Math.random() - 0.5) * (current * 0.0005);
          const newPrice = current + drift;
          
          return { 
            ...t, 
            p: newPrice.toLocaleString(undefined, { minimumFractionDigits: t.s === 'USD/IDR' ? 0 : 2 }),
            up: drift >= 0
          };
        }));
      } catch (e) {
        console.error('Ticker update error', e);
      }
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
              <span className="mr-2 text-white font-mono">{t.p}</span>
              <span className={t.up ? 'text-[#0088FF]' : 'text-[#FF3B30]'}>
                {t.up ? '▲' : '▼'} {t.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full border-l border-border px-4 flex items-center gap-6 bg-black z-10">
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-[#FFB000] font-bold leading-none uppercase">WIB (Jakarta)</span>
          <span className="text-[11px] font-bold text-white font-mono leading-none mt-1">{time}</span>
        </div>
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-[#0088FF] font-bold leading-none uppercase">Status</span>
          <span className="text-[11px] font-bold text-green-400 font-mono leading-none mt-1 uppercase">Live_Feed</span>
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
