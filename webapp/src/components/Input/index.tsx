import cn from 'classnames'
import { type FormikProps } from 'formik'
import css from './index.module.scss'

interface InputProps<TFormValues> {
  name: keyof TFormValues
  label: string
  formik: FormikProps<TFormValues>
  maxWidth?: number | string
  type?: 'text' | 'password'
  placeholder?: string
  helperText?: string
}

export const Input = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
  placeholder,
  helperText,
}: InputProps<TFormValues>) => {
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
      <input
        className={cn({
          [css.input]: true,
          [css.invalid]: invalid,
        })}
        style={{ maxWidth }}
        type={type}
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
