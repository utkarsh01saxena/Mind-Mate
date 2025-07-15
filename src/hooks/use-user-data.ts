"use client";

import { useState, useEffect, useCallback } from 'react';

const USER_NAME_KEY = 'mindmate_user_name';

export function useUserData() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedName = localStorage.getItem(USER_NAME_KEY);
      if (storedName) {
        setUserName(storedName);
      }
    } catch (error) {
      console.error("Failed to load user name from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const saveUserName = useCallback((name: string) => {
    try {
      if (name) {
        localStorage.setItem(USER_NAME_KEY, name);
        setUserName(name);
      }
    } catch (error) {
      console.error("Failed to save user name to localStorage", error);
    }
  }, []);

  return { userName, saveUserName, isLoaded };
}
