'use client';

import React, { useEffect, useRef } from 'react';

export function MarketWatch() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
          "title": "TOTAL MARKET",
          "symbols": [
            { "s": "FOREXCOM:SPX500", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
            { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
            { "s": "NASDAQ:NVDA", "d": "Nvidia" },
            { "s": "OANDA:XAUUSD", "d": "Gold" },
            { "s": "OANDA:USDIDR", "d": "USD/IDR" },
            { "s": "TVC:DXY", "d": "DXY" },
            { "s": "BINANCE:ETHUSDT", "d": "Ethereum" }
          ]
        },
        {
          "title": "S&P 500 TOP",
          "symbols": [
            { "s": "NASDAQ:AAPL", "d": "Apple" },
            { "s": "NASDAQ:MSFT", "d": "Microsoft" },
            { "s": "NASDAQ:GOOGL", "d": "Alphabet" },
            { "s": "NASDAQ:AMZN", "d": "Amazon" },
            { "s": "NASDAQ:META", "d": "Meta" },
            { "s": "NASDAQ:NVDA", "d": "Nvidia" },
            { "s": "NASDAQ:TSLA", "d": "Tesla" },
            { "s": "NYSE:LLY", "d": "Eli Lilly" },
            { "s": "NYSE:JPM", "d": "JPM Chase" },
            { "s": "NYSE:UNH", "d": "UnitedHealth" }
          ]
        },
        {
          "title": "TOP CRYPTO",
          "symbols": [
            { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
            { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
            { "s": "BINANCE:SOLUSDT", "d": "Solana" },
            { "s": "BINANCE:BNBUSDT", "d": "BNB" },
            { "s": "BINANCE:XRPUSDT", "d": "XRP" },
            { "s": "BINANCE:ADAUSDT", "d": "Cardano" },
            { "s": "BINANCE:DOGEUSDT", "d": "Dogecoin" },
            { "s": "BINANCE:AVAXUSDT", "d": "Avalanche" },
            { "s": "BINANCE:DOTUSDT", "d": "Polkadot" },
            { "s": "BINANCE:LINKUSDT", "d": "Chainlink" }
          ]
        },
        {
          "title": "FX / INDICES",
          "symbols": [
            { "s": "FOREXCOM:SPX500", "d": "S&P 500" },
            { "s": "FOREXCOM:NSXUSD", "d": "Nasdaq 100" },
            { "s": "OANDA:USDIDR", "d": "USD/IDR" },
            { "s": "FX_IDC:EURIDR", "d": "EUR/IDR" },
            { "s": "TVC:DXY", "d": "US Dollar Index" },
            { "s": "OANDA:XAUUSD", "d": "Gold" },
            { "s": "INDEX:NKY", "d": "Nikkei 225" },
            { "s": "INDEX:HSI", "d": "Hang Seng" }
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
    <div className="flex flex-col h-full bg-black border-r border-border overflow-hidden transition-all duration-300">
      <div className="terminal-header">
        <span>GLOBAL MONITOR (INSTITUTIONAL)</span>
        <span className="text-[#8E8E93] text-[8px] animate-pulse">SYNC: ONLINE</span>
      </div>
      
      <div className="flex-1 tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}