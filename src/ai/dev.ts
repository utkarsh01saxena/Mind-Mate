import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/self-care-suggestions.ts';
import '@/ai/flows/ai-chatbot.ts';
