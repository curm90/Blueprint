import { useState } from 'react'
import { Input } from './ui/input'
import type { SessionLog, WorkoutExercise } from '@/db/schema'

type WorkoutExerciseWithProgress = WorkoutExercise & {
  sessionLogs: Array<SessionLog>
}

export default function ProgressList({
  exercises,
}: {
  exercises: Array<WorkoutExerciseWithProgress> | undefined
}) {
  const [searchTerm, setSearchTerm] = useState('')

  // Add defensive programming for undefined/null exercises
  const safeExercises = exercises || []

  const filteredExercises = safeExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getProgress = (current: number, started: number) => {
    if (!current || !started || started === 0) {
      return { diff: 0, percentage: 0 }
    }
    const diff = current - started
    const percentage = Math.round((diff / started) * 100)
    return { diff, percentage }
  }

  const getLastSessionDate = (sessionLogs: Array<SessionLog>) => {
    if (sessionLogs.length === 0) return 'Never'

    const lastSession = sessionLogs[0] // Already ordered by desc(loggedAt)
    const loggedAt = lastSession.loggedAt
    return loggedAt ? new Date(loggedAt).toLocaleDateString() : 'Never'
  }

  const getTotalSessions = (sessionLogs: Array<SessionLog>) => {
    return sessionLogs.length
  }

  return (
    <div className="mx-auto max-w-6xl my-10 flex flex-col gap-6 px-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Progress Overview</h1>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <span className="text-sm text-muted-foreground">
            {filteredExercises.length} exercise
            {filteredExercises.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Exercise
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Current
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Started
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Progress
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Sessions
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Last Session
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map((exercise, index) => {
                const progress = getProgress(
                  exercise.currentWeight || 0,
                  exercise.startingWeight || 0,
                )
                const isPositive = progress.diff > 0
                const unit = exercise.unit || 'kg'

                return (
                  <tr
                    key={exercise.id || index}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-medium text-foreground">
                        {exercise.name || 'Unknown Exercise'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-semibold text-foreground">
                        {exercise.currentWeight || 0}
                        {unit}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-muted-foreground">
                        {exercise.startingWeight || 0}
                        {unit}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-md ${
                            isPositive
                              ? 'text-green-700 bg-green-50'
                              : progress.diff < 0
                                ? 'text-red-700 bg-red-50'
                                : 'text-gray-600 bg-gray-50'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {progress.diff}
                          {unit}
                        </span>
                        <span
                          className={`text-xs ${
                            isPositive
                              ? 'text-green-600'
                              : progress.diff < 0
                                ? 'text-red-600'
                                : 'text-gray-500'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {progress.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-medium text-foreground">
                        {getTotalSessions(exercise.sessionLogs)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm text-muted-foreground">
                        {getLastSessionDate(exercise.sessionLogs)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredExercises.length === 0 && safeExercises.length > 0 && (
          <div className="p-12 text-center">
            <span className="text-muted-foreground">
              No exercises found matching "{searchTerm}"
            </span>
          </div>
        )}

        {safeExercises.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-muted-foreground">
              No exercises found. Add some exercises first.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
