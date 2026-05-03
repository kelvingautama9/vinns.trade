'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, PriceScaleMode, IChartApi, ISeriesApi } from 'lightweight-charts';

export function LogChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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
        mode: PriceScaleMode.Logarithmic, // TASK 1: Logarithmic scale
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
      upColor: '#0088FF', // Institutional Blue
      downColor: '#FF3B30', // Institutional Red
      borderVisible: false,
      wickUpColor: '#0088FF',
      wickDownColor: '#FF3B30',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 2. Fetch Historical Data (REST API)
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=500'
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
    const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) wsRef.current.close();
      if (chartRef.current) chartRef.current.remove();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <div className="terminal-header">
        <div className="flex items-center gap-2">
           <span className="text-[#0088FF] animate-pulse">●</span>
           <span>BTC/USDT INSTITUTIONAL FEED</span>
        </div>
        <div className="flex gap-4">
          <span className="text-white">SOURCE: BINANCE_WS</span>
          <span className="text-[#FFB000]">SCALE: LOG</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1" />
    </div>
  );
}
