import { pgr } from '../utils/pumpGetRoute'

export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getAllIdeasRoute = pgr(() => '/')

export const getViewIdeaRoute = pgr({ ideaNick: ':ideaNick' }, ({ ideaNick }) => `/ideas/${ideaNick}`)

export const getEditIdeaRoute = pgr({ ideaNick: ':ideaNick' }, ({ ideaNick }) => `/ideas/${ideaNick}/edit`)

export const getNewIdeaRoute = pgr(() => '/ideas/new')
