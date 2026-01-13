import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Mission-specific storage utilities
export const missionStorage = {
  save: (mission) => {
    const missions = missionStorage.getAll();
    const newMission = {
      id: Date.now(),
      timestamp: Date.now(),
      query: mission.query,
      data: mission.data
    };
    missions.unshift(newMission);
    
    // Keep only last 50 missions
    if (missions.length > 50) missions.pop();
    
    localStorage.setItem('planexa_missions', JSON.stringify(missions));
    return newMission;
  },

  getAll: () => {
    try {
      const missions = localStorage.getItem('planexa_missions');
      return missions ? JSON.parse(missions) : [];
    } catch (error) {
      console.error('Error loading missions:', error);
      return [];
    }
  },

  delete: (id) => {
    const missions = missionStorage.getAll();
    const filtered = missions.filter(m => m.id !== id);
    localStorage.setItem('planexa_missions', JSON.stringify(filtered));
  },

  clear: () => {
    localStorage.removeItem('planexa_missions');
  }
};
