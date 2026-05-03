'use client';

import React, { useState } from 'react';
import { TerminalHeader } from '@/components/terminal/header';
import { MarketWatch } from '@/components/terminal/market-watch';
import { SignalFeed } from '@/components/terminal/signal-feed';
import { TerminalCalculators } from '@/components/terminal/calculators';
import { TradingJournal } from '@/components/terminal/trading-journal';
import { LogChart } from '@/components/terminal/log-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function TerminalDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-black text-white selection:bg-[#FFB000] selection:text-black font-mono">
      <TerminalHeader />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-black border-b border-border flex items-center">
          <Tabs defaultValue="terminal" className="flex-1 flex flex-col w-full h-full">
            <TabsList className="bg-[#050505] h-9 p-0 gap-0 rounded-none border-b border-border w-full justify-start overflow-x-auto no-scrollbar">
              <TabsTrigger value="terminal" className="data-[state=active]:bg-[#111] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-all hover:bg-[#0A0A0A]">
                1.0 MONITOR
              </TabsTrigger>
              <TabsTrigger value="calculators" className="data-[state=active]:bg-[#111] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-all hover:bg-[#0A0A0A]">
                2.0 ANALYSTS
              </TabsTrigger>
              <TabsTrigger value="journal" className="data-[state=active]:bg-[#111] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-all hover:bg-[#0A0A0A]">
                3.0 JOURNAL
              </TabsTrigger>
              <TabsTrigger value="engine" className="data-[state=active]:bg-[#111] data-[state=active]:text-[#FFB000] border-r border-border rounded-none text-[10px] uppercase font-bold px-8 h-full transition-all hover:bg-[#0A0A0A]">
                4.0 ENGINE
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden h-[calc(100vh-80px)]">
              <TabsContent value="terminal" className="m-0 h-full">
                <div className="grid grid-cols-12 h-full gap-0 overflow-hidden">
                  {/* MARKET WATCH - CATEGORIZED WIDGET */}
                  <div className={`${isExpanded ? 'hidden' : 'col-span-12 lg:col-span-3'} h-full overflow-hidden border-r border-border transition-all duration-500 ease-in-out`}>
                    <MarketWatch />
                  </div>
                  
                  {/* CENTRAL CHART & SIGNALS */}
                  <div className={`col-span-12 ${isExpanded ? 'lg:col-span-12' : 'lg:col-span-6'} flex flex-col h-full overflow-hidden relative transition-all duration-500 ease-in-out`}>
                    <button 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="absolute top-12 right-4 z-50 p-2 bg-black/80 border border-border text-[#FFB000] hover:bg-[#111] transition-all hidden lg:block"
                      title={isExpanded ? "Collapse View" : "Expand Center"}
                    >
                      {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>

                    <div className="h-1/2 border-b border-border relative overflow-hidden">
                      <LogChart />
                    </div>
                    <div className="h-1/2 overflow-hidden bg-[#020202]">
                      <SignalFeed />
                    </div>
                  </div>

                  {/* GLOBAL INTEL */}
                  <div className={`${isExpanded ? 'hidden' : 'col-span-12 lg:col-span-3'} h-full overflow-y-auto bg-black border-l border-border transition-all duration-500 ease-in-out`}>
                    <div className="p-4 space-y-8">
                      <div>
                        <div className="terminal-header flex justify-between items-center">
                          <span className="text-[#FFB000]">GLOBAL INTEL</span>
                          <span className="text-[8px] text-[#8E8E93]">PRIORITY: HIGH</span>
                        </div>
                        <div className="text-[11px] font-mono leading-relaxed space-y-4 mt-4">
                          <div className="border-l-2 border-[#0088FF] pl-3 py-1 hover:bg-white/5 transition-all">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">MACRO ADVISORY</span>
                            US CPI data cooler than expected. Dovish pivot anticipated. US Equities rotation in progress. Focus on mid-cap growth.
                          </div>
                          <div className="border-l-2 border-[#FFB000] pl-3 py-1 hover:bg-white/5 transition-all">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">TECH SECTOR</span>
                            NVDA Blackwell demand exceeding supply. Blackwell production ramping up. Target adjusted to $1450.
                          </div>
                          <div className="border-l-2 border-[#FF3B30] pl-3 py-1 hover:bg-white/5 transition-all">
                            <span className="text-[9px] text-[#8E8E93] block mb-1">CRYPTO DESK</span>
                            BTC Spot ETF inflows stagnating. 1H structure shift detected at $65k. Liquidity grab expected at $62.4k.
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="terminal-header"><span className="text-[#FFB000]">SYSTEM_LOG</span></div>
                        <div className="text-[10px] font-mono space-y-1 mt-4 text-[#8E8E93] opacity-80">
                          <div className="hover:text-white transition-colors cursor-default">[SYS] V6_KERNEL_UPTIME: 184H</div>
                          <div className="hover:text-white transition-colors cursor-default">[NET] TRADINGVIEW_WIDGET: ACTIVE</div>
                          <div className="hover:text-white transition-colors cursor-default">[SIG] BINANCE_WS_STREAM: CONNECTED</div>
                          <div className="hover:text-white transition-colors cursor-default">[UI] FOCUS_SCALE_MODE: {isExpanded ? 'ON' : 'OFF'}</div>
                          <div className="hover:text-white transition-colors cursor-default">[SEC] ENCRYPTED_CHANNEL: SECURE</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calculators" className="m-0 h-full overflow-hidden animate-in fade-in duration-500">
                <TerminalCalculators />
              </TabsContent>

              <TabsContent value="journal" className="m-0 h-full overflow-y-auto p-4 bg-[#020202] animate-in slide-in-from-bottom-2 duration-500">
                <TradingJournal />
              </TabsContent>

              <TabsContent value="engine" className="m-0 h-full overflow-y-auto p-6 lg:p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                <div className="max-w-3xl border border-white/5 p-10 bg-[#050505] shadow-[0_0_50px_rgba(0,136,255,0.1)]">
                  <h2 className="text-3xl font-black text-[#FFB000] mb-6 uppercase tracking-tighter italic">Vinnstrade Engine Core v6.0</h2>
                  <p className="text-sm text-[#8E8E93] mb-8 font-mono leading-relaxed">
                    Access the high-performance Python Analyst Kernel with multi-timeframe Market Structure Scanning and Telegram institutional alerting.
                  </p>
                  <code className="bg-black p-6 text-[#0088FF] text-xs block text-left mb-8 font-mono border border-white/10 select-all overflow-x-auto whitespace-pre">
                    git clone https://github.com/vinnstrade/vinns.trade.git<br/>
                    cd vinns.trade/python-engine<br/>
                    pip install -r requirements.txt<br/>
                    python main.py --mode institutional
                  </code>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <div className="text-[10px] font-bold p-3 border border-[#0088FF] text-[#0088FF] uppercase tracking-widest">Status: Ready</div>
                    <div className="text-[10px] font-bold p-3 border border-[#FFB000] text-[#FFB000] uppercase tracking-widest">API: Binance_Global</div>
                    <div className="text-[10px] font-bold p-3 border border-green-500/50 text-green-400 uppercase tracking-widest">Version: 6.0.1_STABLE</div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>

      <footer className="h-6 bg-[#050505] border-t border-border flex items-center px-4 justify-between text-[9px] font-bold tracking-widest text-[#8E8E93] shrink-0 z-50">
        <div className="flex gap-6">
          <span>SYSTEM: <span className="text-[#0088FF]">ULTRA_STABLE</span></span>
          <span>LATENCY: <span className="text-[#FFB000]">12MS</span></span>
        </div>
        <div className="flex gap-6">
          <span>USER: <span className="text-white">KELVIN_MASTER</span></span>
          <span className="text-[#0088FF]">V6.0.1_PRO</span>
        </div>
      </footer>
    </div>
  );
}
