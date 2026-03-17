import { RiskRewardCalculator } from "./components/risk-reward-calculator";

export default function TradingPlanPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Trading Plan
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Analyze the statistical viability of your trading strategy with the Risk-Reward Probability Engine.
        </p>
      </div>
      <RiskRewardCalculator />
    </div>
  );
}
