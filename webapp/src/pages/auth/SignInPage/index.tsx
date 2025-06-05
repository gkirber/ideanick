import { zSignInTrpcInput } from '@ideanick/backend/src/router/auth/signIn/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { mixpanelIdentify, mixpanelTrackSignIn } from '../../../lib/mixpanel'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getAllIdeasRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const SignInPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign In',
})(() => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useContext()
  const signIn = trpc.signIn.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token, userId } = await signIn.mutateAsync(values)
      mixpanelIdentify(userId)
      mixpanelTrackSignIn()
      Cookies.set('token', token, { expires: 99999 })
      await trpcUtils.invalidate()
      await trpcUtils.getMe.invalidate()
      navigate(getAllIdeasRoute())
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign In">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign In</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
