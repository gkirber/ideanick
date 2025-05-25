import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getNewIdeaRoute } from '@ideanick/webapp/src/lib/routes'
import { type Idea, type User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'

import { makeRequestToBrevo } from './brevo'
import { env } from './env'
import { logger } from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const _getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVariables)
  return html
}

interface EmailTemplateData {
  [key: string]: string | number | boolean | null | undefined
}

const sendEmail = async ({
  to,
  templateName,
  templateData,
  subject,
}: {
  to: string
  templateName: string
  templateData: EmailTemplateData
  subject: string
}) => {
  const html = await _getEmailHtml(templateName, templateData as Record<string, string>)

  const { loggableResponse } = await makeRequestToBrevo({
    path: 'smtp/email',
    data: {
      to: [{ email: to }],
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
    },
  })

  logger.info('email', 'Email sent', {
    to,
    templateName,
    templateData,
    response: loggableResponse,
  })
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    templateName: 'welcome',
    subject: 'Ласкаво просимо до IdeaNick!',
    templateData: {
      userNick: user.nick,
      addIdeaUrl: `${getNewIdeaRoute({ abs: true })}`,
      homeUrl: env.WEBAPP_URL,
    },
  })
}

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    templateName: 'IdeaBlocked',
    subject: 'Вашу ідею заблоковано',
    templateData: {
      ideaNick: idea.nick,
      homeUrl: env.WEBAPP_URL,
    },
  })
}

export const sendMostLikedIdeasEmail = async (user: User, ideasCount: number) => {
  await sendEmail({
    to: user.email,
    templateName: 'mostLikedIdeas',
    subject: 'Найпопулярніші ідеї тижня',
    templateData: {
      name: user.name,
      ideasCount,
      homeUrl: env.WEBAPP_URL,
    },
  })
}
