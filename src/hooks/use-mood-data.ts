"use client"

import { useState, useEffect, useCallback } from 'react';
import type { MoodEntry, Mood } from '@/lib/types';

const STORAGE_KEY = 'mindmate_mood_data';

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function useMoodData() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        // Simple migration for old data that doesn't have a time field
        const parsedData = JSON.parse(storedData).map((entry: any) => ({
          ...entry,
          time: entry.time || formatTime(new Date(entry.date)), 
        }));
        setMoodData(parsedData);
      }
    } catch (error) {
      console.error("Failed to load mood data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const addMoodEntry = useCallback((mood: Mood, journal: string) => {
    const now = new Date();
    const newEntry: MoodEntry = {
      id: now.toISOString() + Math.random(),
      mood,
      journal,
      date: now.toISOString(),
      time: formatTime(now),
    };

    setMoodData(prevData => {
      const updatedData = [newEntry, ...prevData];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      } catch (error) {
        console.error("Failed to save mood data to localStorage", error);
      }
      return updatedData;
    });
  }, []);

  return { moodData, addMoodEntry, isLoaded };
}
