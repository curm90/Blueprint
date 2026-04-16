import z from 'zod'

export const exerciseSchema = z.object({
  exerciseTitle: z
    .string()
    .min(3, 'Exercise title must be at least 3 characters.')
    .max(50, 'Exercise title must be at most 50 characters.'),
  weight: z.string().min(1, 'Weight is required'),
  minReps: z.string().min(1, 'Minimum reps is required'),
  maxReps: z.string().min(1, 'Maximum reps is required'),
})

export const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Workout title must be at least 5 characters.')
    .max(50, 'Workout title must be at most 50 characters.'),
  selectedDays: z.array(z.string()).min(1, 'Select at least one day'),
  weightUnit: z.string(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(5, 'Current password must be at least 5 characters.')
      .max(32, 'Current password must be at most 32 characters.'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters.')
      .max(32, 'New password must be at most 32 characters.'),
    confirmNewPassword: z
      .string()
      .min(8, 'Confirm new password must be at least 8 characters.')
      .max(32, 'Confirm new password must be at most 32 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm new password must match.',
  })
