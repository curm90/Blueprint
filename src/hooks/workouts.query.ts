import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { exerciseKeys } from './exercises.query'
import type { WorkoutCreate } from '@/db/schema'
import {
  addWorkoutServer,
  completeWorkoutSessionServer,
  deleteWorkoutServer,
  getTodaysWorkoutsServer,
  getWorkoutByIdServer,
  getWorkoutsServer,
  isWorkoutCompletedTodayServer,
  logWorkoutCompleteServer,
  startWorkoutSessionServer,
  updateWorkoutServer,
} from '@/utils/workouts.server'
import { useToast } from '@/components/ui/toast'

// Query Keys - centralized for consistency
export const workoutKeys = {
  all: ['workouts'] as const,
  workouts: () => [...workoutKeys.all, 'list'] as const,
  workout: (id: number) => [...workoutKeys.all, 'detail', id] as const,
  todaysWorkouts: () => [...workoutKeys.all, 'today'] as const,
  workoutCompletedToday: (id: number) =>
    [...workoutKeys.all, 'completed-today', id] as const,
}

// ============ QUERIES ============

/**
 * Get all workouts
 */
export function useWorkouts() {
  return useQuery({
    queryKey: workoutKeys.workouts(),
    queryFn: () => getWorkoutsServer(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get single workout by ID
 */
export function useWorkoutById(id: number) {
  return useQuery({
    queryKey: workoutKeys.workout(id),
    queryFn: () => getWorkoutByIdServer({ data: { id } }),
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // Only run if ID is provided
  })
}

/**
 * Get today's workouts
 */
export function useTodaysWorkouts() {
  return useQuery({
    queryKey: workoutKeys.todaysWorkouts(),
    queryFn: () => getTodaysWorkoutsServer(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Check if a workout was completed today
 */
export function useIsWorkoutCompletedToday(workoutId: number) {
  return useQuery({
    queryKey: workoutKeys.workoutCompletedToday(workoutId),
    queryFn: () => isWorkoutCompletedTodayServer({ data: { workoutId } }),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!workoutId,
  })
}

// ============ MUTATIONS ============

/**
 * Add new workout with optimistic updates
 */
export function useAddWorkout() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (workoutData: WorkoutCreate) =>
      addWorkoutServer({ data: workoutData }),
    onSuccess: () => {
      // Invalidate and refetch workout data and exercise templates
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      toast({
        type: 'success',
        title: 'Workout Created',
        description: 'Your workout has been created successfully',
      })
    },
    onError: (error) => {
      console.error('Failed to add workout:', error)
      toast({
        type: 'error',
        title: 'Failed to Create Workout',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Update workout with optimistic updates
 */
export function useUpdateWorkout() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number
      updates: Partial<WorkoutCreate>
    }) => updateWorkoutServer({ data: { id, updates } }),
    onSuccess: () => {
      // Invalidate all workout-related queries and exercise templates
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      toast({
        type: 'success',
        title: 'Workout Updated',
        description: 'Your workout has been updated successfully',
      })
    },
    onError: (error) => {
      console.error('Failed to update workout:', error)
      toast({
        type: 'error',
        title: 'Failed to Update Workout',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Delete workout with optimistic updates
 */
export function useDeleteWorkout() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (workoutId: number) =>
      deleteWorkoutServer({ data: { id: workoutId } }),
    // Optimistic update - remove from cache immediately
    onMutate: async (workoutId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: workoutKeys.all })

      // Snapshot the previous values for rollback
      const previousWorkouts = queryClient.getQueryData(workoutKeys.workouts())

      // Optimistically remove workout from cache
      queryClient.setQueryData(workoutKeys.workouts(), (old: Array<any>) =>
        old.filter((workout) => workout.id !== workoutId),
      )

      return { previousWorkouts }
    },
    onSuccess: () => {
      toast({
        type: 'success',
        title: 'Workout Deleted',
        description: 'Workout has been removed successfully',
      })
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousWorkouts) {
        queryClient.setQueryData(
          workoutKeys.workouts(),
          context.previousWorkouts,
        )
      }
      console.error('Failed to delete workout:', error)
      toast({
        type: 'error',
        title: 'Failed to Delete Workout',
        description: 'Something went wrong. Please try again.',
      })
    },
    onSettled: () => {
      // Always refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
    },
  })
}

/**
 * Log workout completion
 */
export function useLogWorkoutComplete() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ workoutId, notes }: { workoutId: number; notes?: string }) =>
      logWorkoutCompleteServer({ data: { workoutId, notes } }),
    onSuccess: (_, { workoutId }) => {
      // Invalidate workout-related queries to show completion status
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
      // Also invalidate the specific workout completion status
      queryClient.invalidateQueries({
        queryKey: workoutKeys.workoutCompletedToday(workoutId),
      })
      toast({
        type: 'success',
        title: 'Workout Complete!',
        description: 'Great job finishing your workout!',
      })
    },
    onError: (error) => {
      console.error('Failed to log workout completion:', error)
      toast({
        type: 'error',
        title: 'Failed to Log Completion',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Start a workout session
 */
export function useStartWorkoutSession() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ workoutId, notes }: { workoutId: number; notes?: string }) =>
      startWorkoutSessionServer({ data: { workoutId, notes } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
    },
    onError: (error) => {
      console.error('Failed to start workout session:', error)
      toast({
        type: 'error',
        title: 'Failed to Start Workout',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}

/**
 * Complete a workout session
 */
export function useCompleteWorkoutSession() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({
      workoutLogId,
      notes,
    }: {
      workoutLogId: number
      notes?: string
    }) => completeWorkoutSessionServer({ data: { workoutLogId, notes } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all })
      // Invalidate exercises with progress to show new session data
      queryClient.invalidateQueries({ queryKey: exerciseKeys.all })
      toast({
        type: 'success',
        title: 'Workout Complete!',
        description: 'Great job finishing your workout!',
      })
    },
    onError: (error) => {
      console.error('Failed to complete workout session:', error)
      toast({
        type: 'error',
        title: 'Failed to Complete Workout',
        description: 'Something went wrong. Please try again.',
      })
    },
  })
}
