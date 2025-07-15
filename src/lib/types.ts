export type Mood = 'Happy' | 'Calm' | 'Okay' | 'Sad' | 'Anxious';

export interface MoodEntry {
  id: string;
  mood: Mood;
  journal: string;
  date: string; // ISO string
  time: string;
}
