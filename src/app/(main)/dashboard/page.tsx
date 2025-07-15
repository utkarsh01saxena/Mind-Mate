"use client";

import { Greeting } from "@/components/dashboard/greeting";
import { MoodChart } from "@/components/dashboard/mood-chart";
import { MoodTracker } from "@/components/dashboard/mood-tracker";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";
import { useMoodData } from "@/hooks/use-mood-data";
import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { moodData, addMoodEntry, isLoaded: isMoodDataLoaded } = useMoodData();
  const { userName, saveUserName, isLoaded: isUserDataLoaded } = useUserData();

  const isLoaded = isMoodDataLoaded && isUserDataLoaded;

  return (
    <>
      <WelcomeDialog
        isOpen={isUserDataLoaded && !userName}
        onSave={saveUserName}
      />
      <div className="p-4 md:p-6 lg:p-8 grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Greeting name={userName} />
          <MoodTracker addMoodEntry={addMoodEntry} />
          <Card>
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Your weekly emotional patterns.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoaded ? (
                <MoodChart moodData={moodData} />
              ) : (
                <Skeleton className="h-[350px] w-full" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Journal History</CardTitle>
              <CardDescription>A log of your recent entries.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  {isLoaded ? (
                    moodData.length > 0 ? (
                      moodData.map((entry) => (
                        <div key={entry.id} className="p-4 rounded-lg border bg-background">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-primary">{entry.mood}</span>
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground block">
                                {format(parseISO(entry.date), "PPP")}
                              </span>
                              <span className="text-xs text-muted-foreground block">
                                {entry.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground/80 break-words">{entry.journal || "No journal entry."}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                        <p>No journal entries yet.</p>
                        <p className="text-sm">Start by logging your mood!</p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
