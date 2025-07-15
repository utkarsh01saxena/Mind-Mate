"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GreetingProps {
  name: string | null;
}

export function Greeting({ name }: GreetingProps) {
  if (!name) {
    return <Skeleton className="h-16 w-full" />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold font-headline text-primary">
          {getGreeting()}, {name}!
        </h2>
        <p className="text-sm text-muted-foreground">
          Ready to check in with yourself?
        </p>
      </CardContent>
    </Card>
  );
}
