'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, PriceScaleMode, IChartApi, ISeriesApi } from 'lightweight-charts';

const SYMBOLS = [
  { label: 'BTC/USDT', value: 'BTCUSDT' },
  { label: 'ETH/USDT', value: 'ETHUSDT' },
  { label: 'SOL/USDT', value: 'SOLUSDT' },
  { label: 'BNB/USDT', value: 'BNBUSDT' },
  { label: 'ADA/USDT', value: 'ADAUSDT' },
];

const TIMEFRAMES = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

export function LogChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [symbol, setSymbol] = useState('BTCUSDT');
  const [interval, setInterval] = useState('1h');

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#8E8E93',
        fontFamily: 'IBM Plex Mono',
      },
      grid: {
        vertLines: { color: '#111' },
        horzLines: { color: '#111' },
      },
      rightPriceScale: {
        mode: PriceScaleMode.Logarithmic,
        borderColor: '#222',
        autoScale: true,
      },
      timeScale: {
        borderColor: '#222',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 0,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0088FF',
      downColor: '#FF3B30',
      borderVisible: false,
      wickUpColor: '#0088FF',
      wickDownColor: '#FF3B30',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 2. Fetch Historical Data
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=500`
        );
        const data = await response.json();
        const formatted = data.map((d: any) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        candlestickSeries.setData(formatted);
        chart.timeScale().fitContent();
      } catch (err) {
        console.error('History fetch error:', err);
      }
    };

    fetchHistory();

    // 3. Setup Live Connection (WebSocket)
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);
    wsRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const kline = message.k;
      if (seriesRef.current) {
        seriesRef.current.update({
          time: kline.t / 1000,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        });
      }
    };

    // 4. Handle Resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) wsRef.current.close();
      if (chartRef.current) chartRef.current.remove();
    };
  }, [symbol, interval]);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="terminal-header flex-col md:flex-row items-start md:items-center gap-2">
        <div className="flex items-center gap-2">
           <span className="text-[#0088FF] animate-pulse">●</span>
           <span className="text-[#FFB000]">{symbol} / LOG SCALE</span>
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex bg-black border border-border">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setInterval(tf.value)}
                className={`px-3 py-1 text-[9px] font-bold border-r border-border last:border-r-0 transition-colors ${interval === tf.value ? 'bg-[#FFB000] text-black' : 'text-muted-foreground hover:bg-white/5'}`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <select 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-black border border-border text-[9px] font-bold text-[#FFB000] outline-none px-2 py-1"
          >
            {SYMBOLS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
}
