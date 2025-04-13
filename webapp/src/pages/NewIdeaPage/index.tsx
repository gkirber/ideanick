import { zCreateIdeaTrpcInput } from '@ideanick/backend/src/router/createIdea/input'
import { useFormik } from 'formik'
import { Segment } from '../../components/Segment'
import { useState } from 'react'
import { Input } from '../../components/Input'
import { Textarea } from '../../components/Textarea'
import { withZodSchema } from 'formik-validator-zod'
import { trpc } from '../../lib/trpc'

export const NewIdeaPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const createIdea = trpc.createIdea.useMutation()
  const formik = useFormik({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate: withZodSchema(zCreateIdeaTrpcInput),
    onSubmit: async (values) => {
      await createIdea.mutateAsync(values)
      formik.resetForm()
      setSuccessMessageVisible(true)
      setTimeout(() => {
        setSuccessMessageVisible(false)
      }, 3000)
    },
  })

  console.log(formik)

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <Input name="name" label="Name" formik={formik} />
        <Input name="nick" label="Nick" formik={formik} />
        <Input name="description" label="Description" formik={formik} />
        <Textarea name="text" label="Text" formik={formik} />
        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Some fields are invalid</div>}
        {successMessageVisible && <div style={{ color: 'green' }}>Idea created!</div>}
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Create Idea'}
        </button>
      </form>
    </Segment>
  )
}
