import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const workouts = sqliteTable('workouts', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  name: text().notNull(),
  selectedDays: text().notNull(), // Comma-separated list of selected days (e.g. "Mon,Wed,Fri")
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const workoutExercises = sqliteTable('workout_exercises', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  workoutId: integer('workout_id', { mode: 'number' })
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  currentWeight: integer('current_weight', { mode: 'number' }).notNull(),
  startingWeight: integer('starting_weight', { mode: 'number' }).notNull(),
  minReps: integer('min_reps', { mode: 'number' }).notNull(),
  maxReps: integer('max_reps', { mode: 'number' }).notNull(),
  weightIncrement: integer('weight_increment', { mode: 'number' })
    .default(2.5)
    .notNull(), // Default 2.5kg increment
  unit: text().default('kg').notNull(),
  order: integer().notNull(), // Order of exercise in workout
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const sessionLog = sqliteTable('session_log', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  workoutExerciseId: integer('workout_exercise_id', { mode: 'number' })
    .notNull()
    .references(() => workoutExercises.id),
  workoutLogId: integer('workout_log_id', { mode: 'number' })
    .notNull()
    .references(() => workoutLogs.id),
  weight: integer('weight', { mode: 'number' }).notNull(), // Actual weight used
  reps: integer('reps', { mode: 'number' }).notNull(), // Actual reps completed
  difficulty: text().notNull(),
  notes: text(),
  loggedAt: integer('logged_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const workoutLogs = sqliteTable('workout_logs', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  workoutId: integer('workout_id', { mode: 'number' })
    .notNull()
    .references(() => workouts.id),
  completedAt: integer('completed_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  notes: text(),
})

export const workoutRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  workoutLogs: many(workoutLogs),
}))

export const workoutExerciseRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    sessionLogs: many(sessionLog),
  }),
)

export const sessionLogRelations = relations(sessionLog, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sessionLog.workoutExerciseId],
    references: [workoutExercises.id],
  }),
  workoutLog: one(workoutLogs, {
    fields: [sessionLog.workoutLogId],
    references: [workoutLogs.id],
  }),
}))

export const workoutLogRelations = relations(workoutLogs, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutLogs.workoutId],
    references: [workouts.id],
  }),
  sessionLogs: many(sessionLog),
}))

// === TYPE EXPORTS ===

// Drizzle inferred types
export type Workout = typeof workouts.$inferSelect
export type WorkoutInsert = typeof workouts.$inferInsert
export type WorkoutExercise = typeof workoutExercises.$inferSelect
export type WorkoutExerciseInsert = typeof workoutExercises.$inferInsert
export type SessionLog = typeof sessionLog.$inferSelect
export type SessionLogInsert = typeof sessionLog.$inferInsert
export type WorkoutLog = typeof workoutLogs.$inferSelect
export type WorkoutLogInsert = typeof workoutLogs.$inferInsert

// Zod schemas for validation
export const workoutSelectSchema = createSelectSchema(workouts)
export const workoutInsertSchema = createInsertSchema(workouts)

export const workoutExerciseSelectSchema = createSelectSchema(workoutExercises)
export const workoutExerciseInsertSchema = createInsertSchema(workoutExercises)

export const workoutLogSelectSchema = createSelectSchema(workoutLogs)
export const workoutLogInsertSchema = createInsertSchema(workoutLogs)

// Session log schemas with proper enum constraint for difficulty
export const sessionLogSelectSchema = createSelectSchema(sessionLog, {
  difficulty: z.enum(['easy', 'right', 'hard']),
})

export const sessionLogInsertSchema = createInsertSchema(sessionLog, {
  difficulty: z.enum(['easy', 'right', 'hard']),
})

// Form-specific schemas (string inputs that need conversion)
export const workoutExerciseFormSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  currentWeight: z.string().min(1, 'Current weight must be at least 1'),
  unit: z.enum(['kg', 'lbs']),
  minReps: z.string().min(1, 'Minimum reps must be at least 1'),
  maxReps: z.string().min(1, 'Maximum reps must be at least 1'),
  weightIncrement: z.string().optional(),
})

// Workout form schema - now includes exercises array
export const workoutFormSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  selectedDays: z.array(z.string()).min(1, 'At least one day is required'),
  exercises: z
    .array(workoutExerciseFormSchema)
    .min(1, 'At least one exercise is required'),
})

// Session log form schema - now includes weight and reps
export const sessionLogFormSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  reps: z.string().min(1, 'Reps is required'),
  difficulty: z.enum(['easy', 'right', 'hard'], {
    message: 'Please select a difficulty',
  }),
  notes: z
    .string()
    .max(200, {
      message: 'Notes must be less than 200 characters',
    })
    .optional(),
})

// API schema for server functions (parsed numbers)
export const workoutExerciseCreateSchema = z.object({
  name: z.string().min(1),
  currentWeight: z.number().positive(),
  startingWeight: z.number().positive(),
  unit: z.enum(['kg', 'lbs']),
  minReps: z.number().int().positive(),
  maxReps: z.number().int().positive(),
  weightIncrement: z.number().positive().optional(),
  order: z.number().int().nonnegative(),
})

// Workout create schema - now includes exercises
export const workoutCreateSchema = z.object({
  name: z.string().min(1),
  selectedDays: z.array(z.string()).min(1),
  exercises: z.array(workoutExerciseCreateSchema).min(1),
})

// Session log create schema - now includes weight and reps
export const sessionLogCreateSchema = z.object({
  workoutExerciseId: z.number().int().positive(),
  workoutLogId: z.number().int().positive(),
  weight: z.number().positive(),
  reps: z.number().int().positive(),
  difficulty: z.enum(['easy', 'right', 'hard']),
  notes: z.string().optional(),
})

// Workout log create schema
export const workoutLogCreateSchema = workoutLogInsertSchema.omit({
  id: true,
  completedAt: true, // Auto-generated
})

// Derived TypeScript types
export type WorkoutExerciseForm = z.infer<typeof workoutExerciseFormSchema>
export type WorkoutExerciseCreate = z.infer<typeof workoutExerciseCreateSchema>
export type WorkoutForm = z.infer<typeof workoutFormSchema>
export type WorkoutCreate = z.infer<typeof workoutCreateSchema>
export type SessionLogForm = z.infer<typeof sessionLogFormSchema>
export type SessionLogCreate = z.infer<typeof sessionLogCreateSchema>
export type WorkoutLogCreate = z.infer<typeof workoutLogCreateSchema>

// Extended types with relations
export type WorkoutWithExercises = Workout & {
  workoutExercises: WorkoutExercise[]
}

export type WorkoutFull = Workout & {
  workoutExercises: WorkoutExercise[]
  workoutLogs: WorkoutLog[]
}

export type WorkoutLogWithSessions = WorkoutLog & {
  sessionLogs: (SessionLog & {
    workoutExercise: WorkoutExercise
  })[]
}

// Exercise template type for reusing exercises across workouts
export type ExerciseTemplate = Pick<
  WorkoutExercise,
  | 'name'
  | 'currentWeight'
  | 'startingWeight'
  | 'minReps'
  | 'maxReps'
  | 'weightIncrement'
  | 'unit'
>
