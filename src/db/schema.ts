import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'

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
  weightIncrement: integer('weight_increment', { mode: 'number' }).notNull(),
  unit: text().default('kg').notNull(),
})

export const sessionLog = sqliteTable('session_log', {
  id: integer({ mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  exerciseId: integer('exercise_id', { mode: 'number' })
    .notNull()
    .references(() => exercises.id),
  performedReps: integer('performed_reps', { mode: 'number' }).notNull(),
  weightUsed: integer('weight_used', { mode: 'number' }).notNull(),
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
