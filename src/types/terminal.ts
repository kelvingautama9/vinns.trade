
export type MarketTrend = 'BULLISH' | 'BEARISH' | 'RANGING';
export type SignalQuality = 'SPECULATIVE' | 'PROFESSIONAL' | 'INSTITUTIONAL';
export type SignalType = 'BOS BULL' | 'BOS BEAR' | 'CHoCH BULL' | 'CHoCH BEAR';

export interface SMCSignal {
  id: string;
  time: string;
  ticker: string;
  price: number;
  type: SignalType;
  quality: SignalQuality;
  score: number; // 1-3
  trend: MarketTrend;
  pctChange: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  result: 'WIN' | 'LOSS' | 'BREAKEVEN';
  pnl: number;
  notes: string;
  imageUrl?: string;
}

export interface TickerData {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}
