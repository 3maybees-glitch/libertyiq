'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Difficulty } from '@/lib/quiz-data';

export interface QuizResult {
  topicId: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  rankEarned: string | null;
  completedAt: string;
  timeSeconds: number;
}

export interface TopicProgress {
  topicId: string;
  topicName: string;
  highestRank: string | null;
  completedLevels: Difficulty[];
  results: QuizResult[];
}

interface QuizProgressState {
  progress: Record<string, TopicProgress>;
  lastUpdated: string;
}

const STORAGE_KEY = 'libertyiq-quiz-progress';

function getInitialState(): QuizProgressState {
  return {
    progress: {},
    lastUpdated: new Date().toISOString(),
  };
}

function loadFromStorage(): QuizProgressState {
  if (typeof window === 'undefined') {
    return getInitialState();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading quiz progress:', error);
  }
  
  return getInitialState();
}

function saveToStorage(state: QuizProgressState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving quiz progress:', error);
  }
}

export function useQuizProgress() {
  const [state, setState] = useState<QuizProgressState>(() => getInitialState());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loaded = loadFromStorage();
      setState(loaded);
      setIsLoaded(true);
    }
  }, []);

  // Save quiz result
  const saveResult = useCallback((
    topicId: string,
    topicName: string,
    difficulty: Difficulty,
    score: number,
    totalQuestions: number,
    passingScore: number,
    rankEarned: string,
    timeSeconds: number
  ) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= passingScore;

    const result: QuizResult = {
      topicId,
      difficulty,
      score,
      totalQuestions,
      percentage,
      passed,
      rankEarned: passed ? rankEarned : null,
      completedAt: new Date().toISOString(),
      timeSeconds,
    };

    setState(prev => {
      const existingProgress = prev.progress[topicId] || {
        topicId,
        topicName,
        highestRank: null,
        completedLevels: [],
        results: [],
      };

      // Update completed levels if passed
      let completedLevels = [...existingProgress.completedLevels];
      if (passed && !completedLevels.includes(difficulty)) {
        completedLevels.push(difficulty);
      }

      // Update highest rank
      const rankOrder = ['Intern Analyst', 'Senior Fellow', 'Chief Strategist'];
      let highestRank = existingProgress.highestRank;
      if (passed && rankEarned) {
        const currentIndex = highestRank ? rankOrder.indexOf(highestRank) : -1;
        const newIndex = rankOrder.indexOf(rankEarned);
        if (newIndex > currentIndex) {
          highestRank = rankEarned;
        }
      }

      const newState: QuizProgressState = {
        progress: {
          ...prev.progress,
          [topicId]: {
            ...existingProgress,
            highestRank,
            completedLevels,
            results: [...existingProgress.results, result],
          },
        },
        lastUpdated: new Date().toISOString(),
      };

      saveToStorage(newState);
      return newState;
    });

    return { percentage, passed };
  }, []);

  // Get progress for a specific topic
  const getTopicProgress = useCallback((topicId: string): TopicProgress | null => {
    return state.progress[topicId] || null;
  }, [state.progress]);

  // Check if a level is completed
  const isLevelCompleted = useCallback((topicId: string, difficulty: Difficulty): boolean => {
    const progress = state.progress[topicId];
    return progress?.completedLevels.includes(difficulty) || false;
  }, [state.progress]);

  // Check if a level is unlocked (previous levels completed)
  const isLevelUnlocked = useCallback((topicId: string, difficulty: Difficulty): boolean => {
    const progress = state.progress[topicId];
    
    if (difficulty === 'easy') return true;
    if (difficulty === 'medium') {
      return progress?.completedLevels.includes('easy') || false;
    }
    if (difficulty === 'hard') {
      return progress?.completedLevels.includes('medium') || false;
    }
    return false;
  }, [state.progress]);

  // Get all progress
  const getAllProgress = useCallback((): TopicProgress[] => {
    return Object.values(state.progress);
  }, [state.progress]);

  // Get total stats
  const getTotalStats = useCallback(() => {
    const allProgress = Object.values(state.progress);
    const totalCompleted = allProgress.reduce((sum, p) => sum + p.completedLevels.length, 0);
    const totalQuizzesTaken = allProgress.reduce((sum, p) => sum + p.results.length, 0);
    const topicsStarted = allProgress.length;
    
    // Count ranks
    const ranks = {
      'Intern Analyst': 0,
      'Senior Fellow': 0,
      'Chief Strategist': 0,
    };
    
    allProgress.forEach(p => {
      p.completedLevels.forEach(level => {
        if (level === 'easy') ranks['Intern Analyst']++;
        if (level === 'medium') ranks['Senior Fellow']++;
        if (level === 'hard') ranks['Chief Strategist']++;
      });
    });

    // Calculate overall rank based on most advanced achieved
    let overallRank: string | null = null;
    if (ranks['Chief Strategist'] > 0) overallRank = 'Chief Strategist';
    else if (ranks['Senior Fellow'] > 0) overallRank = 'Senior Fellow';
    else if (ranks['Intern Analyst'] > 0) overallRank = 'Intern Analyst';

    return {
      totalCompleted,
      totalQuizzesTaken,
      topicsStarted,
      ranks,
      overallRank,
    };
  }, [state.progress]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    const newState = getInitialState();
    setState(newState);
    saveToStorage(newState);
  }, []);

  // Get highest rank for a topic (returns 'none', 'intern', 'fellow', or 'chief')
  const getHighestRank = useCallback((topicId: string): 'none' | 'intern' | 'fellow' | 'chief' => {
    const progress = state.progress[topicId];
    if (!progress || !progress.highestRank) return 'none';
    
    // Map rank names to simple keys
    if (progress.highestRank === 'Chief Strategist') return 'chief';
    if (progress.highestRank === 'Senior Fellow') return 'fellow';
    if (progress.highestRank === 'Intern Analyst') return 'intern';
    return 'none';
  }, [state.progress]);

  // Save rank directly (simpler API for quiz completion)
  const saveRank = useCallback((topicId: string, rankId: 'intern' | 'fellow' | 'chief') => {
    const rankNames = {
      intern: 'Intern Analyst',
      fellow: 'Senior Fellow',
      chief: 'Chief Strategist',
    };
    const rankLevels = {
      intern: 'easy' as Difficulty,
      fellow: 'medium' as Difficulty,
      chief: 'hard' as Difficulty,
    };

    setState(prev => {
      const existingProgress = prev.progress[topicId] || {
        topicId,
        topicName: topicId,
        highestRank: null,
        completedLevels: [],
        results: [],
      };

      // Check if this rank is higher than current
      const rankOrder = ['intern', 'fellow', 'chief'];
      const currentRank = getHighestRank(topicId);
      const currentIndex = currentRank === 'none' ? -1 : rankOrder.indexOf(currentRank);
      const newIndex = rankOrder.indexOf(rankId);

      if (newIndex <= currentIndex) {
        // Don't downgrade rank
        return prev;
      }

      // Update completed levels
      let completedLevels = [...existingProgress.completedLevels];
      const levelToAdd = rankLevels[rankId];
      if (!completedLevels.includes(levelToAdd)) {
        completedLevels.push(levelToAdd);
      }

      const newState: QuizProgressState = {
        progress: {
          ...prev.progress,
          [topicId]: {
            ...existingProgress,
            highestRank: rankNames[rankId],
            completedLevels,
          },
        },
        lastUpdated: new Date().toISOString(),
      };

      saveToStorage(newState);
      return newState;
    });
  }, [getHighestRank]);

  return {
    isLoaded,
    saveResult,
    saveRank,
    getTopicProgress,
    getHighestRank,
    isLevelCompleted,
    isLevelUnlocked,
    getAllProgress,
    getTotalStats,
    resetProgress,
  };
}
