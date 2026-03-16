import { InvestmentCalculator } from './components/investment-calculator';

export default function RealRateEnginePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Real-Rate Investment Engine
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          See beyond nominal returns. Understand how inflation impacts your
          investment growth and discover your true purchasing power over time.
        </p>
      </div>
      <InvestmentCalculator />
    </div>
  );
}
