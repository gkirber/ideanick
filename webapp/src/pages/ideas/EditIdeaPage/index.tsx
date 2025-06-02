import { zUpdateIdeaTrpcInput } from '@ideanick/backend/src/router/ideas/updateIdea/input'
import { canEditIdea } from '@ideanick/backend/src/utils/can'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { UploadToS3 } from '../../../components/UploadToS3'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

interface Idea {
  id: string
  name: string
  nick: string
  description: string
  text: string
  images: string[]
  certificate: string | null
  authorId: string
  isLikedByMe: boolean
  likesCount: number
  createdAt: Date
  serialNumber: number
  blockedAt: Date | null
  author: {
    id: string
    nick: string
    name: string
    avatar: string | null
  }
}

export const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = getEditIdeaRoute.useParams()
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  setProps: ({ queryResult, ctx }) => {
    if (!queryResult?.data?.idea) {
      throw new Error('Idea not found')
    }
    const idea = queryResult.data.idea
    
    if (!canEditIdea(ctx.me, idea)) {
      throw new Error('An idea can only be edited by the author')
    }
    
    return {
      idea,
    }
  },
  title: ({ idea }: { idea: Idea }) => `Edit Idea "${idea.name}"`,
})(({ idea }: { idea: Idea }) => {
  const navigate = useNavigate()
  const updateIdea = trpc.updateIdea.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      images: idea.images,
      name: idea.name,
      text: idea.text,
      nick: idea.nick,
      description: idea.description,
      certificate: idea.certificate,
    },
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values })
      navigate(getViewIdeaRoute({ ideaNick: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Description" name="description" maxWidth={500} formik={formik} />
          <Textarea label="Text" name="text" formik={formik} />
          <UploadsToCloudinary 
            label="Images" 
            name="images" 
            type="image" 
            preset="preview" 
            formik={formik} 
          />
          <UploadToS3 
            label="Certificate" 
            name="certificate" 
            formik={formik} 
          />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
})