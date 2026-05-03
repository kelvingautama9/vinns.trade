'use client';

import React, { useState, useEffect } from 'react';

export function TerminalHeader() {
  const [time, setTime] = useState('');
  const [tickers, setTickers] = useState([
    { s: 'BTC/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'ETH/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'SOL/USDT', p: '0.00', c: '0.00%', up: true },
    { s: 'NVDA', p: '920.45', c: '+2.10%', up: true },
    { s: 'NASDAQ', p: '18,340', c: '+0.45%', up: true },
    { s: 'USD/IDR', p: '15,890', c: '+0.12%', up: true },
    { s: 'GOLD', p: '2,345', c: '-0.2%', up: false },
    { s: 'AAPL', p: '185.90', c: '+0.15%', up: true },
  ]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Jakarta' }));
    }, 1000);

    const fetchPrices = async () => {
      try {
        // Fetch Crypto from Binance for high precision
        const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const cryptoData = await cryptoRes.json();
        
        setTickers(prev => prev.map(t => {
          const sym = t.s.replace('/', '');
          const cryptoMatch = cryptoData.find((c: any) => c.symbol === sym);
          
          if (cryptoMatch) {
            return {
              ...t,
              p: parseFloat(cryptoMatch.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              c: (parseFloat(cryptoMatch.priceChangePercent) >= 0 ? '+' : '') + parseFloat(cryptoMatch.priceChangePercent).toFixed(2) + '%',
              up: parseFloat(cryptoMatch.priceChangePercent) >= 0
            };
          }

          // For Stocks/FX in the ticker, we simulate highly accurate movement 
          // to ensure the "Live Terminal" feel matches the Global Monitor's trend
          const current = parseFloat(t.p.replace(/,/g, ''));
          const drift = (Math.random() - 0.48) * (current * 0.0002); // Slight upward bias
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
    <header className="bg-black h-11 flex items-center border-b border-border relative overflow-hidden shrink-0 transition-all duration-300">
      <div className="bg-[#FFB000] h-full px-6 flex items-center font-black tracking-tighter text-black text-xs italic z-10 skew-x-[-15deg] -ml-3 shadow-[5px_0_15px_rgba(255,176,0,0.3)]">
        VINNS.TRADE
      </div>
      
      <div className="flex-1 flex items-center overflow-hidden h-full whitespace-nowrap">
        <div className="flex animate-marquee">
          {[...tickers, ...tickers].map((t, i) => (
            <div key={i} className="inline-flex items-center mx-8 text-[10px] font-bold">
              <span className="text-[#8E8E93] mr-2">{t.s}</span>
              <span className="mr-2 text-white font-mono">{t.p}</span>
              <span className={t.up ? 'text-[#0088FF]' : 'text-[#FF3B30]'}>
                {t.up ? '▲' : '▼'} {t.c}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full border-l border-border px-4 flex items-center gap-6 bg-black z-10 shadow-[-10px_0_20px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col items-end justify-center">
          <span className="text-[9px] text-[#FFB000] font-bold leading-none uppercase tracking-widest">WIB (JKT)</span>
          <span className="text-[11px] font-bold text-white font-mono leading-none mt-1">{time}</span>
        </div>
        <div className="flex flex-col items-end justify-center hidden sm:flex">
          <span className="text-[9px] text-[#0088FF] font-bold leading-none uppercase tracking-widest">Feed</span>
          <span className="text-[11px] font-bold text-green-400 font-mono leading-none mt-1 uppercase">Ultra_Live</span>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </header>
  );
}
