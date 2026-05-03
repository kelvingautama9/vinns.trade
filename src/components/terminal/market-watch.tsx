'use client';

import React, { useEffect, useRef } from 'react';

export function MarketWatch() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Task 2: Official TradingView Market Overview Widget
    // This provides categorized automatic updates for Stocks, Crypto, Indices
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": false,
      "locale": "en",
      "width": "100%",
      "height": "100%",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "tabs": [
        {
          "title": "INDICES",
          "symbols": [
            { "s": "FOREXCOM:SPX500", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
            { "s": "FOREXCOM:DJI", "d": "Dow Jones" },
            { "s": "OANDA:XAUUSD", "d": "Gold" },
            { "s": "OANDA:USDIDR", "d": "USD/IDR" }
          ],
          "originalTitle": "Indices"
        },
        {
          "title": "US STOCKS",
          "symbols": [
            { "s": "NASDAQ:NVDA", "d": "Nvidia" },
            { "s": "NASDAQ:AAPL", "d": "Apple" },
            { "s": "NASDAQ:MSFT", "d": "Microsoft" },
            { "s": "NASDAQ:GOOGL", "d": "Alphabet" },
            { "s": "NASDAQ:TSLA", "d": "Tesla" },
            { "s": "NASDAQ:PLTR", "d": "Palantir" }
          ]
        },
        {
          "title": "CRYPTO",
          "symbols": [
            { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
            { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
            { "s": "BINANCE:SOLUSDT", "d": "Solana" }
          ]
        }
      ]
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-black border-r border-border overflow-hidden">
      <div className="terminal-header">
        <span>GLOBAL MONITOR (LIVE)</span>
        <span className="text-[#8E8E93] text-[8px]">AUTO_REFRESH: ON</span>
      </div>
      
      <div className="flex-1 tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
