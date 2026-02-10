import { createFormHook } from '@tanstack/react-form'

import {
  DifficultySelector,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../components/demo.FormComponents'
import { fieldContext, formContext } from './demo.form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    DifficultySelector,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
