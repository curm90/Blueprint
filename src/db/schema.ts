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

export const sessionLog = sqliteTable('session_log', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  exerciseId: integer('exercise_id', { mode: 'number' })
    .notNull()
    .references(() => exercises.id),
  difficulty: text().notNull(),
  notes: text(),
  loggedAt: integer('logged_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const exerciseRelations = relations(exercises, ({ many }) => ({
  sessionLogs: many(sessionLog),
}))

export const sessionLogRelations = relations(sessionLog, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sessionLog.exerciseId],
    references: [exercises.id],
  }),
}))

// === TYPE EXPORTS ===

// Drizzle inferred types
export type Exercise = typeof exercises.$inferSelect
export type ExerciseInsert = typeof exercises.$inferInsert
export type SessionLog = typeof sessionLog.$inferSelect
export type SessionLogInsert = typeof sessionLog.$inferInsert

// Zod schemas for validation
export const exerciseSelectSchema = createSelectSchema(exercises)
export const exerciseInsertSchema = createInsertSchema(exercises)

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

// Session log create schema
export const sessionLogCreateSchema = sessionLogInsertSchema.omit({
  id: true,
  loggedAt: true, // Auto-generated fields
})

// Derived TypeScript types
export type ExerciseForm = z.infer<typeof exerciseFormSchema>
export type ExerciseCreate = z.infer<typeof exerciseCreateSchema>
export type SessionLogForm = z.infer<typeof sessionLogFormSchema>
export type SessionLogCreate = z.infer<typeof sessionLogCreateSchema>
