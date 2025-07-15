"use client";

import { useState } from "react";
import { Laugh, Smile, Meh, Frown, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Mood } from "@/lib/types";
import { cn } from "@/lib/utils";

const moods: { name: Mood; icon: React.ReactNode }[] = [
  { name: "Happy", icon: <Laugh className="size-8" /> },
  { name: "Calm", icon: <Smile className="size-8" /> },
  { name: "Okay", icon: <Meh className="size-8" /> },
  { name: "Sad", icon: <Frown className="size-8" /> },
  { name: "Anxious", icon: <HeartPulse className="size-8" /> },
];

interface MoodTrackerProps {
  addMoodEntry: (mood: Mood, journal: string) => void;
}

export function MoodTracker({ addMoodEntry }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [journalText, setJournalText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodEntry(selectedMood, journalText);
      setSelectedMood(null);
      setJournalText("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        <CardDescription>Log your mood and thoughts to track your well-being.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4 text-center">Select your current mood</h3>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {moods.map(({ name, icon }) => (
              <button
                key={name}
                onClick={() => setSelectedMood(name)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 w-24 h-24 justify-center border-2",
                  selectedMood === name
                    ? "bg-primary/20 text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
                )}
                aria-pressed={selectedMood === name}
              >
                {icon}
                <span className="text-xs font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4 animate-in fade-in-50 duration-500">
          <Textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Tell us more about your day... (optional)"
            rows={4}
            aria-label="Journal Entry"
          />
          <Button onClick={handleSubmit} className="w-full" disabled={!selectedMood || showSuccess}>
            {showSuccess ? "Logged!" : "Save Entry"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
