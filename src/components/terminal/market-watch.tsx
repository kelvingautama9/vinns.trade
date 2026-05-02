
'use client';

import React, { useState, useEffect } from 'react';

export function MarketWatch() {
  const [prices, setPrices] = useState<Record<string, {p: string, c: string, up: boolean}>>({});

  useEffect(() => {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT', 'MATICUSDT'];
    
    const updatePrices = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await res.json();
        const newPrices: any = {};
        
        data.filter((item: any) => symbols.includes(item.symbol)).forEach((item: any) => {
          newPrices[item.symbol] = {
            p: parseFloat(item.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }),
            c: parseFloat(item.priceChangePercent).toFixed(2),
            up: parseFloat(item.priceChangePercent) >= 0
          };
        });
        setPrices(newPrices);
      } catch (e) {}
    };

    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black border-r border-border">
      <div className="terminal-header">
        <span>MARKET WATCH / BINANCE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {Object.entries(prices).map(([symbol, data]) => (
          <div key={symbol} className="p-2 border-b border-border/30 hover:bg-muted transition-colors cursor-pointer flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-tighter group-hover:text-accent">{symbol.replace('USDT', '')}</span>
              <span className="text-[8px] text-muted-foreground font-bold uppercase">Crypto/USDT</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold">{data.p}</span>
              <span className={`text-[9px] font-black ${data.up ? 'text-primary' : 'text-destructive'}`}>
                {data.up ? '+' : ''}{data.c}%
              </span>
            </div>
          </div>
        ))}
        {Object.keys(prices).length === 0 && (
          <div className="p-8 text-center text-[10px] font-bold text-muted-foreground animate-pulse">CONNECTING TO BINANCE DATAHUB...</div>
        )}
      </div>
    </div>
  );
}
