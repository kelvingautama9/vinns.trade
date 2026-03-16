'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, TrendingUp, Goal, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  icon: React.ElementType;
};

export const mainNav: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Briefcase,
  },
  {
    title: 'Real-Rate Engine',
    href: '/real-rate-engine',
    icon: TrendingUp,
  },
  {
    title: 'Financial Freedom Calc',
    href: '/financial-freedom-calculator',
    icon: Goal,
  },
  {
    title: 'Portfolio Analysis',
    href: '#',
    disabled: true,
    icon: Briefcase,
  },
  {
    title: 'Market Trends',
    href: '#',
    disabled: true,
    icon: Briefcase,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <nav className="hidden items-center space-x-2 md:flex lg:space-x-4">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-disabled={item.disabled}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <Link href="/" className="mb-6 flex items-center gap-2 text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>
              <TrendingUp className="h-6 w-6 text-primary" />
              <span>Vinns Trade</span>
            </Link>
            <nav className="flex flex-col space-y-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    item.disabled && 'pointer-events-none opacity-50'
                  )}
                   aria-disabled={item.disabled}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault();
                    else setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
