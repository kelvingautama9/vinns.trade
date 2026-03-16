import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinancialFreedomCalculatorPage() {
  return (
    <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Goal className="h-6 w-6 text-primary" />
            Financial Freedom Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! We're building a powerful tool to help you map your journey to financial independence.
          </p>
          <Button asChild>
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
