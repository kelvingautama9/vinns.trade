import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { MainNav } from './main-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block">Vinns Trade</span>
        </Link>
        <div className="flex-1">
          <MainNav />
        </div>
      </div>
    </header>
  );
}
