'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, PriceScaleMode } from 'lightweight-charts';

export function LogChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#8E8E93',
      },
      grid: {
        vertLines: { color: '#1A2535' },
        horzLines: { color: '#1A2535' },
      },
      rightPriceScale: {
        mode: PriceScaleMode.Logarithmic,
        borderColor: '#1A2535',
      },
      timeScale: {
        borderColor: '#1A2535',
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#0088FF',
      downColor: '#FF3B30',
      borderVisible: false,
      wickUpColor: '#0088FF',
      wickDownColor: '#FF3B30',
    });

    const fetchHistoricalData = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100');
        const data = await res.json();
        const formatted = data.map((d: any) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        candlestickSeries.setData(formatted);
        chart.timeScale().fitContent();
      } catch (e) {}
    };

    fetchHistoricalData();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="terminal-header">
        <span>BTC/USDT LOGARITHMIC PERSPECTIVE (LIVE)</span>
        <div className="flex gap-4">
          <span className="text-white">SOURCE: BINANCE_API</span>
          <span className="text-[#FFB000]">SCALE: LOG</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
}