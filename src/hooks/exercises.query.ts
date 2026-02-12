import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ExerciseCreate } from '@/db/schema'
import {
  addExerciseServer,
  deleteExerciseServer,
  getExercisesServer,
  getExercisesWithProgressServer,
  updateExerciseServer,
} from '@/utils/exercises.server'
import { useToast } from '@/components/ui/toast'

// Query Keys - centralized for consistency
export const exerciseKeys = {
  all: ['exercises'] as const,
  exercises: () => [...exerciseKeys.all, 'list'] as const,
  exercisesWithProgress: () => [...exerciseKeys.all, 'withProgress'] as const,
}

// ============ QUERIES ============

/**
 * Get basic exercises list
 */
export function useExercises() {
  return useQuery({
    queryKey: exerciseKeys.exercises(),
    queryFn: () => getExercisesServer(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get exercises with progress data for progress page
 */
export function useExercisesWithProgress() {
  return useQuery({
    queryKey: exerciseKeys.exercisesWithProgress(),
    queryFn: () => getExercisesWithProgressServer(),
    staleTime: 1 * 60 * 1000, // 1 minute (progress data changes more frequently)
  })
}

// ============ MUTATIONS ============

/**
 * Add new exercise with optimistic updates
 */
export function useAddExercise() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (exerciseData: ExerciseCreate) =>
      addExerciseServer({ data: exerciseData }),
    onSuccess: () => {
      // Invalidate and refetch exercises data
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      toast({
        type: 'success',
        title: 'Exercise Added',
        description: 'Your exercise has been added successfully',
      })
    },
    onError: (error) => {
      console.error('Failed to add exercise:', error)
      toast({
        type: 'error',
        title: 'Failed to Add Exercise',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Update exercise with optimistic updates
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<ExerciseCreate>
    }) => updateExerciseServer({ data: { id, updates } }),
    onSuccess: () => {
      // Invalidate all exercise-related queries
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      toast({
        type: 'success',
        title: 'Exercise Updated',
        description: 'Your exercise has been updated successfully',
      })
    },
    onError: (error) => {
      console.error('Failed to update exercise:', error)
      toast({
        type: 'error',
        title: 'Failed to Update Exercise',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Delete exercise with optimistic updates
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (exerciseId: number) =>
      deleteExerciseServer({ data: { id: exerciseId } }),
    // Optimistic update - remove from cache immediately
    onMutate: async (exerciseId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: exerciseKeys.all })

      // Snapshot the previous values for rollback
      const previousExercises = queryClient.getQueryData(
        exerciseKeys.exercises(),
      )
      const previousWithProgress = queryClient.getQueryData(
        exerciseKeys.exercisesWithProgress(),
      )

      // Optimistically remove exercise from cache
      queryClient.setQueryData(exerciseKeys.exercises(), (old: Array<any>) =>
        old.filter((exercise) => exercise.id !== exerciseId),
      )
      queryClient.setQueryData(
        exerciseKeys.exercisesWithProgress(),
        (old: Array<any>) =>
          old.filter((exercise) => exercise.id !== exerciseId),
      )

      return { previousExercises, previousWithProgress }
    },
    onSuccess: () => {
      toast({
        type: 'success',
        title: 'Exercise Deleted',
        description: 'Exercise has been removed successfully',
      })
    },
    onError: (error, exerciseId, context) => {
      // Rollback on error
      if (context?.previousExercises) {
        queryClient.setQueryData(
          exerciseKeys.exercises(),
          context.previousExercises,
        )
      }
      if (context?.previousWithProgress) {
        queryClient.setQueryData(
          exerciseKeys.exercisesWithProgress(),
          context.previousWithProgress,
        )
      }
      console.error('Failed to delete exercise:', error)
      toast({
        type: 'error',
        title: 'Failed to Delete Exercise',
        description: 'Something went wrong. Please try again.',
      })
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
    },
  })
}
