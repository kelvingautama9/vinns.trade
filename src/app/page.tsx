
'use client';

import React, { useState, useEffect } from 'react';
import { TerminalHeader } from '@/components/terminal/header';
import { MarketWatch } from '@/components/terminal/market-watch';
import { SignalFeed } from '@/components/terminal/signal-feed';
import { TerminalCalculators } from '@/components/terminal/calculators';
import { TradingJournal } from '@/components/terminal/trading-journal';
import { LogChart } from '@/components/terminal/log-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TerminalDashboard() {
  const [activeTab, setActiveTab] = useState('terminal');

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <TerminalHeader />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <Tabs defaultValue="terminal" className="flex-1 flex flex-col w-full h-full" onValueChange={setActiveTab}>
          <div className="bg-black/50 border-b border-border flex items-center px-4">
            <TabsList className="bg-transparent h-10 gap-1">
              <TabsTrigger value="terminal" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-none rounded-none text-[10px] uppercase font-bold px-4">
                <span className="mr-2">01</span> Terminal
              </TabsTrigger>
              <TabsTrigger value="calculators" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent border-none rounded-none text-[10px] uppercase font-bold px-4">
                <span className="mr-2">02</span> Analysts
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 border-none rounded-none text-[10px] uppercase font-bold px-4">
                <span className="mr-2">03</span> Journal
              </TabsTrigger>
              <TabsTrigger value="local" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 border-none rounded-none text-[10px] uppercase font-bold px-4">
                <span className="mr-2">04</span> Local Engine
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="terminal" className="m-0 h-full">
              <div className="grid grid-cols-12 h-full gap-px bg-border">
                <div className="col-span-12 lg:col-span-3 h-full">
                  <MarketWatch />
                </div>
                <div className="col-span-12 lg:col-span-6 flex flex-col h-full bg-background">
                  <div className="h-1/2 border-b border-border">
                    <LogChart />
                  </div>
                  <div className="h-1/2 overflow-hidden">
                    <SignalFeed />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-card">
                  <div className="p-4 space-y-4">
                    <div className="terminal-header"><span className="text-amber-500">MARKET INTEL</span></div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed space-y-2">
                      <p className="border-l-2 border-primary pl-2">HEDGE FUND VIEW: Accumulation detected in Large-Cap Crypto. High liquidity zones identified at $62.5k.</p>
                      <p className="border-l-2 border-accent pl-2">MACRO ALERT: US PCE data expected to drive volatility. Adjust position sizes by -25% for news event.</p>
                      <p className="border-l-2 border-destructive pl-2">RISK ADVISORY: Diversification score low. High correlation across current holdings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculators" className="m-0 h-full overflow-y-auto">
              <TerminalCalculators />
            </TabsContent>

            <TabsContent value="journal" className="m-0 h-full overflow-y-auto p-4">
              <TradingJournal />
            </TabsContent>

            <TabsContent value="local" className="m-0 h-full overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl bg-muted p-8 border border-accent/20">
                <h2 className="text-2xl font-bold text-accent mb-4 uppercase tracking-tighter">Running Full Version (Python Flask)</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  GitHub Pages serves this terminal as a static interface. To use the full SMC Engine with dedicated Telegram alerts and multi-timeframe deep scanning, please pull the source code to your local machine.
                </p>
                <code className="bg-black p-4 text-primary text-xs block text-left mb-6 font-mono">
                  git clone https://github.com/vinnstrade/vinns.trade.git<br/>
                  cd vinns.trade/python-engine<br/>
                  pip install -r requirements.txt<br/>
                  python main.py
                </code>
                <div className="flex gap-4 justify-center">
                  <div className="text-[10px] font-bold p-2 border border-primary text-primary uppercase">API: Connected (Client)</div>
                  <div className="text-[10px] font-bold p-2 border border-accent text-accent uppercase">Engine: Virtualized</div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <footer className="h-6 bg-black border-t border-border flex items-center px-4 justify-between text-[10px] font-bold">
        <div className="flex gap-4">
          <span className="text-primary">SYSTEM: ONLINE</span>
          <span className="text-accent">VERSION: 3.2.0-ULTRA</span>
          <span className="text-muted-foreground">USER: GUEST_INVESTOR</span>
        </div>
        <div className="flex gap-4">
          <span className="text-blue-400 uppercase">Latency: 42ms</span>
          <span className="text-purple-400 uppercase">Market Structure Engine: ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
