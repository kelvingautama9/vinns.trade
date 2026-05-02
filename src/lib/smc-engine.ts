import { SMCSignal, SignalQuality, SignalType, MarketTrend } from '@/types/terminal';

/**
 * SMC ENGINE V4 — Pure Structure Shift
 * Strictly filters signals into 3 tiers based on candle velocity and structure alignment.
 */
export function detectMarketStructure(symbol: string, candles: any[]): SMCSignal | null {
  if (candles.length < 10) return null;

  const closes = candles.map(c => parseFloat(c[4]));
  const highs = candles.map(c => parseFloat(c[2]));
  const lows = candles.map(c => parseFloat(c[3]));
  
  const currentClose = closes[closes.length - 1];
  const prevClose = closes[closes.length - 2];
  
  // Swing Detection
  const lastHigh = Math.max(...highs.slice(-15, -1));
  const lastLow = Math.min(...lows.slice(-15, -1));

  let type: SignalType | null = null;
  let score = 1;
  let trend: MarketTrend = 'RANGING';

  // Detect BOS (Continuation) / CHoCH (Shift)
  // Simplified logic for client-side: 
  // If price breaks a 15-candle high/low, we trigger.
  if (currentClose > lastHigh && prevClose <= lastHigh) {
    type = 'BOS BULL';
    trend = 'BULLISH';
  } else if (currentClose < lastLow && prevClose >= lastLow) {
    type = 'BOS BEAR';
    trend = 'BEARISH';
  }

  if (!type) return null;

  // Strength Level Mapping (1-3)
  // 1: Speculative (Low volatility break)
  // 2: Professional (Standard volatility)
  // 3: Institutional (High velocity / Expansion candle)
  let quality: SignalQuality = 'SPECULATIVE';
  const velocity = Math.abs((currentClose - prevClose) / prevClose);
  
  if (velocity > 0.008) {
    quality = 'PROFESSIONAL';
    score = 2;
  }
  if (velocity > 0.02) {
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
    pctChange: velocity * 100
  };
}
