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
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-black text-white">
      <TerminalHeader />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-black border-b border-border flex items-center">
          <Tabs defaultValue="terminal" className="flex-1 flex flex-col w-full h-full">
            <TabsList className="bg-black h-9 p-0 gap-0 rounded-none border-b border-border w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="terminal" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-none">
                1.0 MONITOR
              </TabsTrigger>
              <TabsTrigger value="calculators" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-none">
                2.0 ANALYSTS
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-none">
                3.0 JOURNAL
              </TabsTrigger>
              <TabsTrigger value="engine" className="data-[state=active]:bg-[#333] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-none">
                4.0 ENGINE
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden h-[calc(100vh-80px)]">
              <TabsContent value="terminal" className="m-0 h-full">
                <div className="grid grid-cols-12 h-full gap-0">
                  <div className="col-span-12 lg:col-span-3 h-full overflow-hidden border-r border-border">
                    <MarketWatch />
                  </div>
                  <div className="col-span-12 lg:col-span-6 flex flex-col h-full overflow-hidden">
                    <div className="h-1/2 border-b border-border">
                      <LogChart />
                    </div>
                    <div className="h-1/2 overflow-hidden">
                      <SignalFeed />
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-3 h-full overflow-y-auto bg-black border-l border-border">
                    <div className="p-4 space-y-8">
                      <div>
                        <div className="terminal-header"><span className="text-[#FFB000]">GLOBAL INTEL</span></div>
                        <div className="text-[11px] font-mono leading-relaxed space-y-4 mt-4">
                          <div className="border-l-2 border-[#0088FF] pl-3">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">MACRO ADVISORY</span>
                            US PCE data printing higher than consensus. Adjust all US Equity exposures by -15%. Liquidity depth decreasing.
                          </div>
                          <div className="border-l-2 border-[#FFB000] pl-3">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">TECH SECTOR</span>
                            NVDA reaching institutional valuation extreme. Watch for CHoCH at $850 support level for reversal confirmation.
                          </div>
                          <div className="border-l-2 border-[#FF3B30] pl-3">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">FX DESK</span>
                            USD/IDR volatility increasing. Local bank intervention likely at 16,000. Hedge with USDT-perp if necessary.
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="terminal-header"><span className="text-[#FFB000]">SYSTEM_LOG</span></div>
                        <div className="text-[10px] font-mono space-y-1 mt-4 text-[#8E8E93]">
                          <div>[SYS] CORE_KERNEL_INIT... OK</div>
                          <div>[NET] BINANCE_API_WS... CONNECTED</div>
                          <div>[SIG] SMC_SCAN_ACTIVE... OK</div>
                          <div>[UI] TERMINAL_V4_LOADED... 100%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calculators" className="m-0 h-full overflow-hidden">
                <TerminalCalculators />
              </TabsContent>

              <TabsContent value="journal" className="m-0 h-full overflow-y-auto p-4">
                <TradingJournal />
              </TabsContent>

              <TabsContent value="engine" className="m-0 h-full overflow-y-auto p-12 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl border border-white/10 p-10">
                  <h2 className="text-3xl font-black text-[#FFB000] mb-6 uppercase tracking-tighter italic">Vinnstrade Engine Core</h2>
                  <p className="text-sm text-[#8E8E93] mb-8 font-mono">
                    This web interface runs the Virtualized Analyst Kernel. For full Institutional Tier performance (Dedicated Telegram API and Multi-TF Scanning), deploy the repository locally.
                  </p>
                  <code className="bg-white/5 p-6 text-[#0088FF] text-xs block text-left mb-8 font-mono border border-white/10">
                    git clone https://github.com/vinnstrade/vinns.trade.git<br/>
                    cd vinns.trade/python-engine<br/>
                    pip install -r requirements.txt<br/>
                    python main.py --mode production
                  </code>
                  <div className="flex gap-4 justify-center">
                    <div className="text-[10px] font-bold p-3 border border-[#0088FF] text-[#0088FF] uppercase">Status: Connected</div>
                    <div className="text-[10px] font-bold p-3 border border-[#FFB000] text-[#FFB000] uppercase">Mode: Hybrid_Analyst</div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <footer className="h-6 bg-black border-t border-border flex items-center px-4 justify-between text-[9px] font-bold tracking-widest text-[#8E8E93]">
        <div className="flex gap-6">
          <span>SYSTEM: <span className="text-[#0088FF]">ULTRA_ONLINE</span></span>
          <span>LATENCY: <span className="text-[#FFB000]">12MS</span></span>
        </div>
        <div className="flex gap-6">
          <span>USER: <span className="text-white">KELVIN_MASTER</span></span>
          <span className="text-[#0088FF]">V4.0.0_STABLE</span>
        </div>
      </footer>
    </div>
  );
}