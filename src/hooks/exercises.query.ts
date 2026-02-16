import { useQuery } from '@tanstack/react-query'
import {
  getExerciseTemplatesServer,
  getWorkoutExercisesWithProgressServer,
} from '@/utils/workouts.server'

// Query Keys - centralized for consistency
export const exerciseKeys = {
  all: ['exerciseTemplates'] as const,
  templates: () => [...exerciseKeys.all, 'list'] as const,
}

// ============ QUERIES ============

/**
 * Get exercise templates from previous workouts for reuse
 */
export function useExercises() {
  return useQuery({
    queryKey: exerciseKeys.templates(),
    queryFn: () => getExerciseTemplatesServer(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Alias for backward compatibility - gets exercise templates
 */
export function useExerciseTemplates() {
  return useExercises()
}

/**
 * Get workout exercises with their progress data (session logs)
 */
export function useExercisesWithProgress() {
  return useQuery({
    queryKey: [...exerciseKeys.all, 'progress'],
    queryFn: () => getWorkoutExercisesWithProgressServer(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
