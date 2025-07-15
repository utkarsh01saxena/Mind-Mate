"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { MoodEntry, Mood } from "@/lib/types"
import { eachDayOfInterval, format, subDays, parseISO } from 'date-fns';

interface MoodChartProps {
  moodData: MoodEntry[];
}

const moodOrder: Mood[] = ["Happy", "Calm", "Okay", "Sad", "Anxious"];

const chartConfig = {
  Happy: { label: "Happy", color: "hsl(var(--chart-4))" },
  Calm: { label: "Calm", color: "hsl(var(--chart-2))" },
  Okay: { label: "Okay", color: "hsl(var(--chart-3))" },
  Sad: { label: "Sad", color: "hsl(var(--chart-1))" },
  Anxious: { label: "Anxious", color: "hsl(var(--chart-5))" },
}

export function MoodChart({ moodData }: MoodChartProps) {
  const chartData = (() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = moodData.filter(entry => format(parseISO(entry.date), 'yyyy-MM-dd') === dayStr);
      
      const moodCounts = dayEntries.reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        date: format(day, 'EEE'),
        ...moodCounts
      };
    });
  })();

  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
             <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Legend />
            {moodOrder.map((mood) => (
              <Bar key={mood} dataKey={mood} stackId="a" fill={chartConfig[mood].color} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
