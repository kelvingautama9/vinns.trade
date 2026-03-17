import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Instagram } from 'lucide-react';

export default function Home() {
  return (
    <div className="container relative">
      <section className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-32">
        <div className="space-y-6">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
            Kelvin's Trading Diary
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Smarter Investing,
            <br />
            Clearer Process.
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            Welcome to my personal trading space. Here, I share the modern, intuitive financial tools I use to navigate the markets. My goal is to cut through the noise and chart a clear path to financial growth. This is my diary, my process, and my invitation for you to join the journey.
          </p>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/real-rate-engine">
                Start Calculating
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/financial-freedom-calculator">
                Trading Plan
              </Link>
            </Button>
          </div>
           <div className="mt-8 space-y-4 pt-4">
              <p className="text-sm font-medium text-muted-foreground">Connect with me:</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <Link href="https://www.instagram.com/kelvingautama9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                      <Instagram className="h-5 w-5" />
                      @kelvingautama9
                  </Link>
                  <Link href="https://www.instagram.com/vinns.trade" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                       <Instagram className="h-5 w-5" />
                      @vinns.trade
                  </Link>
                   <Link href="https://www.binance.com/en/square/profile/vinns_trade" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><path d="M12 2l-2.4 4.8L4.8 12l4.8 4.8L12 22l4.8-4.8 4.8-4.8-4.8-4.8L12 2zm0 2.83L13.17 6 12 7.17 10.83 6 12 4.83zm0 14.34L10.83 18 12 16.83 13.17 18 12 19.17zM18 13.17L16.83 12 18 10.83 19.17 12 18 13.17zM6 13.17L4.83 12 6 10.83 7.17 12 6 13.17zM12 12l-1.2-1.2-1.2 1.2 1.2 1.2L12 12z"/></svg>
                      Vinns Trade
                  </Link>
              </div>
          </div>
        </div>
        <div className="hidden h-full items-center justify-center md:flex">
          <div className="relative h-full w-full">
            <div className="relative z-10 flex h-[400px] w-full items-center justify-center rounded-2xl border bg-card/50 p-8 shadow-lg backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="96"
                      height="96"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M9 17h2" />
                      <path d="M8 7h2" />
                      <path d="M5 12h2" />
                      <path d="M16 12h2" />
                      <rect x="3" y="5" width="4" height="10" rx="1" />
                      <rect x="15" y="9" width="4" height="6" rx="1" />
                      <path d="M9 5v2" />
                      <path d="M9 15v2" />
                    </svg>
                    <p className="mt-4 text-2xl font-bold">Vinns Trade</p>
                    <p className="text-muted-foreground">Kelvin's Trading Diary</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
