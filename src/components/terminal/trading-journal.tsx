
'use client';

import React from 'react';

export function TradingJournal() {
  const entries = [
    { id: '1', date: '2024-05-20', pair: 'BTC/USDT', type: 'LONG', result: 'WIN', pnl: '+1,200', notes: 'BOS Confirmed at 62k support. Clean institutional order block fill.' },
    { id: '2', date: '2024-05-18', pair: 'ETH/USDT', type: 'SHORT', result: 'LOSS', pnl: '-450', notes: 'CHoCH fakeout. Stopped out on news spike. Bad risk timing.' },
    { id: '3', date: '2024-05-15', pair: 'SOL/USDT', type: 'LONG', result: 'WIN', pnl: '+890', notes: 'Swing low grab and reversal. Log chart showed massive hidden bullish divergence.' },
    { id: '4', date: '2024-05-10', pair: 'BNB/USDT', type: 'LONG', result: 'WIN', pnl: '+2,100', notes: 'Macro accumulation breakout. Held for 14 days.' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-primary italic tracking-tighter uppercase underline decoration-accent">Post-Trade Recaps / Diary</h2>
        <button className="bg-primary text-black px-4 py-1 text-[10px] font-bold uppercase hover:bg-accent transition-colors">Add New Post</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {entries.map(e => (
          <div key={e.id} className="bg-muted border border-border p-0 flex flex-col group hover:border-accent transition-all">
            <div className={`h-1 w-full ${e.result === 'WIN' ? 'bg-primary' : 'bg-destructive'}`}></div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[9px] text-muted-foreground font-bold block">{e.date}</span>
                  <span className="text-xs font-black tracking-tighter">{e.pair}</span>
                </div>
                <span className={`text-[9px] font-black px-1 ${e.type === 'LONG' ? 'text-primary' : 'text-blue-400'}`}>{e.type}</span>
              </div>
              
              <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold border border-border group-hover:border-primary/30 transition-all">
                Chart Screenshot
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold">Net P&L</span>
                  <span className={`text-xs font-bold ${e.result === 'WIN' ? 'text-primary' : 'text-destructive'}`}>{e.pnl} USD</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-3">
                  {e.notes}
                </p>
              </div>
            </div>
            <div className="mt-auto border-t border-border p-2 flex justify-between items-center bg-black/30">
               <span className={`text-[8px] font-bold ${e.result === 'WIN' ? 'text-primary' : 'text-destructive'} uppercase`}>{e.result}</span>
               <button className="text-[8px] text-accent font-bold uppercase hover:underline">View Intel →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
