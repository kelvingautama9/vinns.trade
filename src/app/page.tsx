import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container relative">
      <section className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-32">
        <div className="space-y-6">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
            Investment Tools
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Smarter Investing,
            <br />
            Clearer Future.
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            Welcome to Vinns Trade. We provide modern, intuitive financial tools
            to help you understand the power of your investments. See through
            the noise of inflation and chart your path to financial growth.
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
                Freedom Calculator
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden h-full items-center justify-center md:flex">
          <div className="relative h-full w-full">
            <div className="absolute -left-4 -top-4 h-48 w-48 rounded-full bg-primary/10 blur-2xl"></div>
            <div className="absolute -right-4 -bottom-4 h-64 w-64 rounded-full bg-accent/50 blur-3xl"></div>
            <div className="relative z-10 flex h-[400px] w-full items-center justify-center rounded-2xl border bg-card/50 p-8 shadow-lg backdrop-blur-sm">
                <div className="flex flex-col items-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="96"
                      height="96"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 3V21" />
                      <path d="M17.6 11.4 3 20" />
                      <path d="m3 4 14.6 8.6" />
                    </svg>
                    <p className="mt-4 text-2xl font-bold">Vinns Trade</p>
                    <p className="text-muted-foreground">Clarity in Finance</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
