import {
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@ideanick/shared/src/cloudinary'
import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { useUploadToCloudinary } from '../UploadToCloudinary'
import css from './index.module.scss'

interface UploadsToCloudinaryProps<
  TTypeName extends CloudinaryUploadTypeName,
  TFormValues,
  TKey extends keyof TFormValues = keyof TFormValues,
> {
  label: string
  name: TKey
  formik: FormikProps<TFormValues>
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
}

export const UploadsToCloudinary = <
  TTypeName extends CloudinaryUploadTypeName,
  TFormValues,
  TKey extends keyof TFormValues = keyof TFormValues,
>({
  label,
  name,
  formik,
  type,
  preset,
}: UploadsToCloudinaryProps<TTypeName, TFormValues, TKey>) => {
  const value = (formik.values[name] || []) as string[]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean | undefined
  const invalid = !!touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToCloudinary } = useUploadToCloudinary(type)

  const handleFileChange = async (files: FileList | null) => {
    if (!files?.length) return

    setLoading(true)
    try {
      const newValue = [...value]
      await Promise.all(
        Array.from(files).map(async (file) => {
          const { publicId } = await uploadToCloudinary(file)
          newValue.push(publicId)
        })
      )
      formik.setFieldValue(name as string, newValue)
    } catch (err: unknown) {
      formik.setFieldError(name as string, err instanceof Error ? err.message : 'Upload failed')
    } finally {
      formik.setFieldTouched(name as string, true, false)
      setLoading(false)
      if (inputEl.current) inputEl.current.value = ''
    }
  }

  const removeImage = (publicId: string) => {
    formik.setFieldValue(
      name as string,
      value.filter((id) => id !== publicId)
    )
  }

  return (
    <div className={cn(css.field, { [css.disabled]: disabled })}>
      <input
        className={css.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
        multiple
        ref={inputEl}
        onChange={(e) => handleFileChange(e.target.files)}
      />

      <label className={css.label} htmlFor={name as string}>
        {label}
      </label>

      {value.length > 0 && (
        <div className={css.previews}>
          {value.map((publicId) => (
            <div key={publicId} className={css.previewPlace}>
              <button type="button" className={css.delete} onClick={() => removeImage(publicId)} disabled={disabled}>
                <Icon className={css.deleteIcon} name="delete" />
              </button>
              <img className={css.preview} alt="Preview" src={getCloudinaryUploadUrl(publicId, type, preset)} />
            </div>
          ))}
        </div>
      )}

      <div className={css.buttons}>
        <Button
          type="button"
          onClick={() => inputEl.current?.click()}
          loading={loading}
          disabled={loading || disabled}
          color="green"
        >
          {value.length ? 'Upload more' : 'Upload'}
        </Button>
      </div>

      {invalid && <div className={css.error}>{error}</div>}
    </div>
  )
}
