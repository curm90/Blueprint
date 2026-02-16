import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const exercises = sqliteTable('exercises', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  name: text().notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
  currentWeight: integer('current_weight', { mode: 'number' }).notNull(),
  startingWeight: integer('starting_weight', { mode: 'number' }).notNull(),
  minReps: integer('min_reps', { mode: 'number' }).notNull(),
  maxReps: integer('max_reps', { mode: 'number' }).notNull(),
  weightIncrement: integer('weight_increment', { mode: 'number' })
    .default(2.5)
    .notNull(), // Default 2.5kg increment
  unit: text().default('kg').notNull(),
})

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
  exerciseId: integer('exercise_id', { mode: 'number' })
    .notNull()
    .references(() => exercises.id),
  order: integer().notNull(), // Order of exercise in workout
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const sessionLog = sqliteTable('session_log', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  exerciseId: integer('exercise_id', { mode: 'number' })
    .notNull()
    .references(() => exercises.id),
  workoutId: integer('workout_id', { mode: 'number' }).references(
    () => workouts.id,
  ), // Optional - can be standalone exercise log
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

export const exerciseRelations = relations(exercises, ({ many }) => ({
  sessionLogs: many(sessionLog),
  workoutExercises: many(workoutExercises),
}))

export const workoutRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  sessionLogs: many(sessionLog),
  workoutLogs: many(workoutLogs),
}))

export const workoutExerciseRelations = relations(
  workoutExercises,
  ({ one }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
  }),
)

export const sessionLogRelations = relations(sessionLog, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sessionLog.exerciseId],
    references: [exercises.id],
  }),
  workout: one(workouts, {
    fields: [sessionLog.workoutId],
    references: [workouts.id],
  }),
}))

export const workoutLogRelations = relations(workoutLogs, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutLogs.workoutId],
    references: [workouts.id],
  }),
}))

// === TYPE EXPORTS ===

// Drizzle inferred types
export type Exercise = typeof exercises.$inferSelect
export type ExerciseInsert = typeof exercises.$inferInsert
export type Workout = typeof workouts.$inferSelect
export type WorkoutInsert = typeof workouts.$inferInsert
export type WorkoutExercise = typeof workoutExercises.$inferSelect
export type WorkoutExerciseInsert = typeof workoutExercises.$inferInsert
export type SessionLog = typeof sessionLog.$inferSelect
export type SessionLogInsert = typeof sessionLog.$inferInsert
export type WorkoutLog = typeof workoutLogs.$inferSelect
export type WorkoutLogInsert = typeof workoutLogs.$inferInsert

// Zod schemas for validation
export const exerciseSelectSchema = createSelectSchema(exercises)
export const exerciseInsertSchema = createInsertSchema(exercises)

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
export const exerciseFormSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  currentWeight: z.string().min(1, 'Current weight must be at least 1'),
  unit: z.enum(['kg', 'lbs']), // Required, no default for forms
  minReps: z.string().min(1, 'Minimum reps must be at least 1'),
  maxReps: z.string().min(1, 'Maximum reps must be at least 1'),
})

// Workout form schema
export const workoutFormSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  selectedDays: z.array(z.string()).min(1, 'At least one day is required'),
  exerciseIds: z.array(z.number()).min(1, 'At least one exercise is required'),
})

// Session log form schema
export const sessionLogFormSchema = z.object({
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
export const exerciseCreateSchema = z.object({
  name: z.string().min(1),
  currentWeight: z.number().positive(),
  startingWeight: z.number().positive(),
  unit: z.enum(['kg', 'lbs']),
  minReps: z.number().int().positive(),
  maxReps: z.number().int().positive(),
})

// Workout create schema
export const workoutCreateSchema = z.object({
  name: z.string().min(1),
  selectedDays: z.array(z.string()).min(1), // Array of day strings like ['Mon', 'Wed', 'Fri']
  exerciseIds: z.array(z.number()).min(1),
})

// Session log create schema
export const sessionLogCreateSchema = sessionLogInsertSchema.omit({
  id: true,
  loggedAt: true, // Auto-generated fields
})

// Workout log create schema
export const workoutLogCreateSchema = workoutLogInsertSchema.omit({
  id: true,
  completedAt: true, // Auto-generated
})

// Derived TypeScript types
export type ExerciseForm = z.infer<typeof exerciseFormSchema>
export type ExerciseCreate = z.infer<typeof exerciseCreateSchema>
export type WorkoutForm = z.infer<typeof workoutFormSchema>
export type WorkoutCreate = z.infer<typeof workoutCreateSchema>
export type SessionLogForm = z.infer<typeof sessionLogFormSchema>
export type SessionLogCreate = z.infer<typeof sessionLogCreateSchema>
export type WorkoutLogCreate = z.infer<typeof workoutLogCreateSchema>

// Extended types with relations
export type WorkoutWithExercises = Workout & {
  workoutExercises: (WorkoutExercise & {
    exercise: Exercise
  })[]
}

export type WorkoutFull = Workout & {
  workoutExercises: (WorkoutExercise & {
    exercise: Exercise
  })[]
  workoutLogs: WorkoutLog[]
}
