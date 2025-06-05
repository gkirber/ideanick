import { zCreateIdeaTrpcInput } from '@ideanick/backend/src/router/ideas/createIdea/input'

import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { UploadsToS3 } from '../../../components/UploadsToS3'
import { UploadToS3 } from '../../../components/UploadToS3'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const NewIdeaPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Idea',
})(() => {
  const createIdea = trpc.createIdea.useMutation()

  const { formik, buttonProps, alertProps } = useForm<typeof zCreateIdeaTrpcInput>({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
      images: [],
      certificate: null,
      documents: [],
    },
    validationSchema: zCreateIdeaTrpcInput,
    onSubmit: async (values) => {
      await createIdea.mutateAsync(values)
      formik.resetForm()
    },
    successMessage: 'Idea created!',
    showValidationAlert: true,
  })

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="name" label="Name" formik={formik} maxWidth={500} placeholder="Enter idea name" />
          <Input
            name="nick"
            label="Nick"
            formik={formik}
            maxWidth={500}
            placeholder="Use only lowercase letters, numbers and dashes"
            helperText="Only lowercase letters, numbers and dashes are allowed"
          />
          <Input
            name="description"
            label="Description"
            formik={formik}
            maxWidth={500}
            placeholder="Brief description of your idea"
          />
          <Textarea
            name="text"
            label="Text"
            formik={formik}
            placeholder="Detailed description of your idea (minimum 100 characters)"
            helperText="Text should be at least 100 characters long"
          />
          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
          <UploadToS3 label="Certificate" name="certificate" formik={formik} />
          <UploadsToS3 label="Documents" name="documents" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Create Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
