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
  templateId,
  templateData,
}: {
  to: string
  templateId: number
  templateData: EmailTemplateData
}) => {
  const { loggableResponse } = await makeRequestToBrevo({
    path: 'smtp/email',
    data: {
      to: [{ email: to }],
      templateId,
      params: templateData,
    },
  })

  logger.info('Email sent', {
    logType: 'email',
    to,
    templateId,
    templateData,
    response: loggableResponse,
  })
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    templateId: env.BREVO_WELCOME_TEMPLATE_ID,
    templateData: {
      userNick: user.nick,
      addIdeaUrl: `${getNewIdeaRoute({ abs: true })}`,
    },
  })
}

export const sendIdeaBlockedEmail = async ({ user, idea }: { user: Pick<User, 'email'>; idea: Pick<Idea, 'nick'> }) => {
  return await sendEmail({
    to: user.email,
    templateId: env.BREVO_IDEA_BLOCKED_TEMPLATE_ID,
    templateData: {
      ideaNick: idea.nick,
    },
  })
}

export const sendMostLikedIdeasEmail = async (user: User, ideasCount: number) => {
  await sendEmail({
    to: user.email,
    templateId: env.BREVO_MOST_LIKED_IDEAS_TEMPLATE_ID,
    templateData: {
      name: user.name,
      ideasCount,
    },
  })
}
