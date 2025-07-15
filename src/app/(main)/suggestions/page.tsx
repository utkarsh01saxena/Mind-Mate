"use client";

import { useState } from "react";
import { getSelfCareSuggestions, type SelfCareSuggestionsOutput } from "@/ai/flows/self-care-suggestions";
import { useMoodData } from "@/hooks/use-mood-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wind, BookOpen, Sparkles as SparklesIcon, StretchHorizontal, Coffee } from "lucide-react";

const suggestionIcons = [
  <Wind key="wind" className="text-primary size-6" />,
  <BookOpen key="book" className="text-primary size-6" />,
  <StretchHorizontal key="stretch" className="text-primary size-6" />,
  <Coffee key="coffee" className="text-primary size-6" />,
  <SparklesIcon key="sparkles" className="text-primary size-6" />,
];

type Suggestion = SelfCareSuggestionsOutput['suggestions'][0];

export default function SuggestionsPage() {
  const { moodData, isLoaded } = useMoodData();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const latestEntry = moodData[0];
    if (!latestEntry) {
      setError("Please log your mood first to get personalized suggestions.");
      setIsLoading(false);
      return;
    }

    try {
      const moodAndJournal = `Mood: ${latestEntry.mood}. Journal: ${latestEntry.journal}`;
      const result = await getSelfCareSuggestions({ moodData: moodAndJournal });
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error("Failed to get suggestions:", e);
      setError("Sorry, something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const lastMood = isLoaded && moodData.length > 0 ? moodData[0].mood : null;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Personalized Self-Care</h1>
            <p className="text-muted-foreground mt-2">
                Discover activities and prompts tailored to your current mood.
            </p>
        </div>

        <Card className="text-center bg-card">
            <CardContent className="p-6">
                <p className="mb-1 text-muted-foreground">
                    Based on your last entry, you were feeling...
                </p>
                <p className="font-bold text-2xl text-primary mb-4">{lastMood || "Unknown"}</p>
                <Button onClick={handleGetSuggestions} disabled={isLoading || !isLoaded || !moodData.length}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Generating..." : "Get My Suggestions"}
                </Button>
                {error && <p className="text-destructive text-sm mt-4">{error}</p>}
            </CardContent>
        </Card>

        {suggestions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3 animate-in fade-in-50 duration-500">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  {suggestionIcons[index % suggestionIcons.length]}
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80">{suggestion.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        { !isLoading && suggestions.length === 0 && (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400"/>
            <h3 className="mt-2 text-sm font-medium">No suggestions yet</h3>
            <p className="mt-1 text-sm">Click the button above to generate some ideas.</p>
          </div>
        )}

      </div>
    </div>
  );
}
