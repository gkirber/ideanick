import { pick } from '@ideanick/shared/src/pick'
import axios, { type AxiosResponse } from 'axios'

import { env } from './env'

interface BrevoRequestData {
  subject?: string
  htmlContent?: string
  sender?: {
    email: string
    name: string
  }
  to?: Array<{
    email: string
  }>
  [key: string]: unknown
}

export const makeRequestToBrevo = async ({
  path,
  data,
}: {
  path: string
  data: BrevoRequestData
}): Promise<{
  originalResponse?: AxiosResponse
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>
}> => {
  if (!env.BREVO_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'BREVO_API_KEY is not set' },
      },
    }
  }
  const response = await axios({
    method: 'POST',
    url: `https://api.brevo.com/v3/${path}`,
    headers: {
      accept: 'application/json',
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    data,
  })
  return {
    originalResponse: response,
    loggableResponse: pick(response, ['status', 'statusText', 'data']),
  }
}

export const sendEmailThroughBrevo = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  return await makeRequestToBrevo({
    path: 'smtp/email',
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
      to: [{ email: to }],
    },
  })
}
