'use client';

import React, { useState, useEffect } from 'react';

type MarketData = {
  p: string;
  c: string;
  up: boolean;
  cat: 'CRYPTO' | 'EQUITY' | 'INDEX' | 'FX';
};

export function MarketWatch() {
  const [prices, setPrices] = useState<Record<string, MarketData>>({
    'S&P 500': { p: '5,214.30', c: '+0.45', up: true, cat: 'INDEX' },
    'NASDAQ': { p: '16,420.15', c: '+0.82', up: true, cat: 'INDEX' },
    'USD/IDR': { p: '15,842.00', c: '+0.12', up: false, cat: 'FX' },
    'GOLD': { p: '2,345.10', c: '-0.25', up: false, cat: 'FX' },
    'NVDA': { p: '894.20', c: '+2.14', up: true, cat: 'EQUITY' },
    'AAPL': { p: '172.10', c: '+0.15', up: true, cat: 'EQUITY' },
    'TSLA': { p: '168.30', c: '-1.45', up: false, cat: 'EQUITY' },
    'MSTR': { p: '1,450.00', c: '+3.40', up: true, cat: 'EQUITY' },
  });

  useEffect(() => {
    const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'];
    
    const updatePrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await res.json();
        const newPrices: any = { ...prices };
        
        data.filter((item: any) => cryptoSymbols.includes(item.symbol)).forEach((item: any) => {
          const sym = item.symbol.replace('USDT', '');
          newPrices[sym] = {
            p: parseFloat(item.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
            c: parseFloat(item.priceChangePercent).toFixed(2),
            up: parseFloat(item.priceChangePercent) >= 0,
            cat: 'CRYPTO'
          };
        });

        // Drift for stocks
        Object.keys(newPrices).forEach(key => {
          if (newPrices[key].cat !== 'CRYPTO') {
            const current = parseFloat(newPrices[key].p.replace(/,/g, ''));
            const jitter = (Math.random() - 0.5) * (current * 0.0002);
            newPrices[key].p = (current + jitter).toLocaleString(undefined, { minimumFractionDigits: 2 });
          }
        });

        setPrices(newPrices);
      } catch (e) {}
    };

    updatePrices();
    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black border-r border-border">
      <div className="terminal-header">
        <span>GLOBAL MONITOR</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {Object.entries(prices).sort((a,b) => b[1].cat.localeCompare(a[1].cat)).map(([symbol, data]) => (
          <div key={symbol} className="px-2 py-1.5 border-b border-white/5 hover:bg-white/5 transition-colors cursor-default flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-tighter text-[#FFB000]">{symbol}</span>
              <span className="text-[8px] text-muted-foreground uppercase">{data.cat}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-white font-mono">{data.p}</span>
              <span className={`text-[9px] font-black ${data.up ? 'text-[#0088FF]' : 'text-[#FF3B30]'}`}>
                {data.up ? '+' : ''}{data.c}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}