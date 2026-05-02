
import { SMCSignal, SignalQuality, SignalType, MarketTrend } from '@/types/terminal';

/**
 * Simplified Client-Side SMC Engine
 * This mimics the logic of the Python script using OHLCV data from Binance
 */
export function detectMarketStructure(symbol: string, candles: any[]): SMCSignal | null {
  if (candles.length < 10) return null;

  const closes = candles.map(c => parseFloat(c[4]));
  const highs = candles.map(c => parseFloat(c[2]));
  const lows = candles.map(c => parseFloat(c[3]));
  
  const currentClose = closes[closes.length - 1];
  const prevClose = closes[closes.length - 2];
  
  // Simple Swing Detection
  const lastHigh = Math.max(...highs.slice(-10, -1));
  const lastLow = Math.min(...lows.slice(-10, -1));

  let type: SignalType | null = null;
  let score = 1;
  let trend: MarketTrend = 'RANGING';

  // Detect BOS/CHoCH
  if (currentClose > lastHigh && prevClose <= lastHigh) {
    type = 'BOS BULL';
    trend = 'BULLISH';
  } else if (currentClose < lastLow && prevClose >= lastLow) {
    type = 'BOS BEAR';
    trend = 'BEARISH';
  }

  if (!type) return null;

  // Quality logic (3 levels)
  let quality: SignalQuality = 'SPECULATIVE';
  if (Math.abs((currentClose - prevClose) / prevClose) > 0.005) {
    quality = 'PROFESSIONAL';
    score = 2;
  }
  if (Math.abs((currentClose - prevClose) / prevClose) > 0.015) {
    quality = 'INSTITUTIONAL';
    score = 3;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    ticker: symbol,
    price: currentClose,
    type,
    quality,
    score,
    trend,
    pctChange: ((currentClose - prevClose) / prevClose) * 100
  };
}
