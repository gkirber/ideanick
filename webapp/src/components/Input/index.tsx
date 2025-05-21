import cn from 'classnames'
import { FormikProps } from 'formik'
import css from './index.module.scss'

export const Input = ({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
  placeholder,
  helperText,
}: {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
  type?: 'text' | 'password'
  placeholder?: string
  helperText?: string
}) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  return (
    <div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
      <label className={css.label} htmlFor={name}>
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
          void formik.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik.isSubmitting}
        placeholder={placeholder}
      />
      {helperText && !invalid && <div className={css.helper}>{helperText}</div>}
      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
