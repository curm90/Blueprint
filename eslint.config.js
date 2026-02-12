//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      '@typescript-eslint/array-type': 'off', // Allow both Array<T> and T[] syntax
    },
  },
]
