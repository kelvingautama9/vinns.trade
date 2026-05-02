'use client';

import React, { useState } from 'react';
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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <TerminalHeader />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-black border-b border-border flex items-center px-4">
          <Tabs defaultValue="terminal" className="flex-1 flex flex-col w-full h-full" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-10 gap-0">
              <TabsTrigger value="terminal" className="data-[state=active]:bg-muted data-[state=active]:text-primary border-r border-border rounded-none text-[10px] uppercase font-bold px-6 h-full transition-none">
                <span className="mr-2 text-accent">1.0</span> MONITOR
              </TabsTrigger>
              <TabsTrigger value="calculators" className="data-[state=active]:bg-muted data-[state=active]:text-accent border-r border-border rounded-none text-[10px] uppercase font-bold px-6 h-full transition-none">
                <span className="mr-2 text-primary">2.0</span> ANALYSTS
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-muted data-[state=active]:text-blue-400 border-r border-border rounded-none text-[10px] uppercase font-bold px-6 h-full transition-none">
                <span className="mr-2 text-blue-500">3.0</span> JOURNAL
              </TabsTrigger>
              <TabsTrigger value="local" className="data-[state=active]:bg-muted data-[state=active]:text-purple-400 border-r border-border rounded-none text-[10px] uppercase font-bold px-6 h-full transition-none">
                <span className="mr-2 text-purple-500">4.0</span> ENGINE
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden h-[calc(100vh-100px)]">
              <TabsContent value="terminal" className="m-0 h-full">
                <div className="grid grid-cols-12 h-full gap-px bg-border">
                  <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
                    <MarketWatch />
                  </div>
                  <div className="col-span-12 lg:col-span-6 flex flex-col h-full bg-background overflow-hidden">
                    <div className="h-1/2 border-b border-border">
                      <LogChart />
                    </div>
                    <div className="h-1/2 overflow-hidden">
                      <SignalFeed />
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-card border-l border-border">
                    <div className="p-4 space-y-6">
                      <div className="terminal-header"><span className="text-accent">GLOBAL INTEL</span></div>
                      <div className="text-[11px] font-mono leading-relaxed space-y-4">
                        <div className="border-l-2 border-primary pl-3">
                          <span className="text-[9px] text-muted-foreground block mb-1">MACRO ADVISORY</span>
                          US PCE data printing higher than consensus. Adjust all US Equity exposures by -15%. Liquidity depth decreasing.
                        </div>
                        <div className="border-l-2 border-accent pl-3">
                          <span className="text-[9px] text-muted-foreground block mb-1">TECH SECTOR</span>
                          NVDA reaching institutional valuation extreme. Watch for CHoCH at $850 support level for reversal confirmation.
                        </div>
                        <div className="border-l-2 border-blue-500 pl-3">
                          <span className="text-[9px] text-muted-foreground block mb-1">FX DESK</span>
                          USD/IDR volatility increasing. Local bank intervention likely at 16,000. Hedge with USDT-perp if necessary.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calculators" className="m-0 h-full overflow-hidden">
                <TerminalCalculators />
              </TabsContent>

              <TabsContent value="journal" className="m-0 h-full overflow-y-auto p-4 bg-black">
                <TradingJournal />
              </TabsContent>

              <TabsContent value="local" className="m-0 h-full overflow-y-auto p-12 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl bg-card p-10 border border-primary/20 shadow-2xl">
                  <h2 className="text-3xl font-black text-primary mb-6 uppercase tracking-tighter italic">Vinnstrade Core Engine</h2>
                  <p className="text-sm text-muted-foreground mb-8 font-mono">
                    This web interface runs the Virtualized Engine. For full Institutional Tier performance (dedicated Telegram API, Multi-TF Scanning, and Python AI Integration), deploy the repository locally.
                  </p>
                  <code className="bg-black p-6 text-primary text-xs block text-left mb-8 font-mono border border-border">
                    git clone https://github.com/vinnstrade/vinns.trade.git<br/>
                    cd vinns.trade/python-engine<br/>
                    pip install -r requirements.txt<br/>
                    python main.py --mode production
                  </code>
                  <div className="flex gap-4 justify-center">
                    <div className="text-[10px] font-bold p-3 border border-primary text-primary uppercase bg-primary/5">Status: Connected</div>
                    <div className="text-[10px] font-bold p-3 border border-accent text-accent uppercase bg-accent/5">Mode: Hybrid</div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <footer className="h-6 bg-black border-t border-border flex items-center px-4 justify-between text-[9px] font-bold tracking-widest text-muted-foreground">
        <div className="flex gap-6">
          <span>SYSTEM: <span className="text-primary">ULTRA_ONLINE</span></span>
          <span>LATENCY: <span className="text-accent">22MS</span></span>
          <span>REGION: HK-HKG-01</span>
        </div>
        <div className="flex gap-6">
          <span>USER: <span className="text-white">GUEST_INVESTOR</span></span>
          <span className="text-primary">CORE_V4.0.0</span>
        </div>
      </footer>
    </div>
  );
}
