import cn from 'classnames'
import { type FormikProps } from 'formik'

import css from './index.module.scss'

interface TextareaProps<TFormValues> {
  name: keyof TFormValues
  label: string
  formik: FormikProps<TFormValues>
  placeholder?: string
  helperText?: string
}

export const Textarea = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  formik,
  placeholder,
  helperText,
}: TextareaProps<TFormValues>) => {
  const value = formik.values[name] as string
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean | undefined
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name as string}>
        {label}
      </label>
      <textarea
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        onChange={(e) => {
          void formik.setFieldValue(name as string, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name as string)
        }}
        value={value}
        name={name as string}
        id={name as string}
        disabled={disabled}
        placeholder={placeholder}
      />
      {helperText && !invalid && <div className={css.helper}>{helperText}</div>}
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
