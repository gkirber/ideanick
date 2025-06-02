import { useStore } from '@nanostores/react'
import { type UseTRPCQueryResult, type UseTRPCQuerySuccessResult } from '@trpc/react-query/shared'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { Loader } from '../components/Loader'
import { lastVisistedNotAuthRouteStore } from '../components/NotAuthRouteTracker'
import { NotFoundPage } from '../pages/other/NotFoundPage'
import { useAppContext, type AppContext } from './ctx'

class CheckExistsError extends Error {}
class CheckAccessError extends Error {}
class GetAuthorizedMeError extends Error {}

type HelperProps<TData> = {
  ctx: AppContext
  queryResult?: UseTRPCQuerySuccessResult<TData, null>
}

export type SetPropsProps<TData, TProps extends Record<string, unknown>> = HelperProps<TData> & {
  getAuthorizedMe: (message?: string) => NonNullable<AppContext['me']>
} & TProps

interface PageWrapperProps<TData, TProps extends Record<string, unknown>> {
  redirectAuthorized?: boolean
  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string
  checkAccess?: (helperProps: HelperProps<TData>) => boolean
  checkAccessTitle?: string
  checkAccessMessage?: string
  checkExists?: (helperProps: HelperProps<TData>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string
  showLoaderOnFetching?: boolean
  title: string | ((props: HelperProps<TData> & TProps) => string)
  isTitleExact?: boolean
  useQuery?: () => UseTRPCQueryResult<TData, unknown>
  setProps?: (props: SetPropsProps<TData, TProps>) => TProps
  Page: React.FC<TProps>
}

const PageWrapper = <TData, TProps extends Record<string, unknown>>({
  authorizedOnly,
  authorizedOnlyTitle = 'Please, Authorize',
  authorizedOnlyMessage = 'This page is available only for authorized users',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Access Denied',
  checkAccessMessage = 'You have no access to this page',
  checkExists,
  checkExistsTitle,
  checkExistsMessage,
  useQuery,
  setProps,
  title,
  isTitleExact = false,
  Page,
  showLoaderOnFetching = true,
}: PageWrapperProps<TData, TProps>) => {
  const lastVisistedNotAuthRoute = useStore(lastVisistedNotAuthRouteStore)
  const navigate = useNavigate()
  const ctx = useAppContext()
  const queryResult = useQuery?.()

  const redirectNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectNeeded) navigate(lastVisistedNotAuthRoute, { replace: true })
  }, [redirectNeeded, navigate, lastVisistedNotAuthRoute])

  if (queryResult?.isLoading || (showLoaderOnFetching && queryResult?.isFetching) || redirectNeeded) {
    return <Loader type="page" />
  }

  if (queryResult?.isError) {
    const errorMessage = queryResult.error instanceof Error ? queryResult.error.message : 'An unknown error occurred'
    return <ErrorPageComponent message={errorMessage} />
  }

  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }

  const helperProps: HelperProps<TData> = {
    ctx,
    queryResult: queryResult?.data ? (queryResult as UseTRPCQuerySuccessResult<TData, null>) : undefined,
  }

  if (checkAccess && !checkAccess(helperProps)) {
    return <ErrorPageComponent title={checkAccessTitle} message={checkAccessMessage} />
  }

  if (checkExists && !checkExists(helperProps)) {
    return <NotFoundPage title={checkExistsTitle} message={checkExistsMessage} />
  }

  const getAuthorizedMe = (message?: string) => {
    if (!ctx.me) throw new GetAuthorizedMeError(message)
    return ctx.me
  }

  try {
    const props =
      setProps?.({
        ...helperProps,
        getAuthorizedMe,
      } as unknown as SetPropsProps<TData, TProps>) ?? ({} as TProps)

    const calculatedTitle = typeof title === 'function' ? title({ ...helperProps, ...props }) : title

    const exactTitle = isTitleExact ? calculatedTitle : `${calculatedTitle} — IdeaNick`

    return (
      <>
        <Helmet>
          <title>{exactTitle}</title>
        </Helmet>
        <Page {...props} />
      </>
    )
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }
    if (error instanceof CheckAccessError) {
      return <NotFoundPage title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }
    if (error instanceof GetAuthorizedMeError) {
      return <ErrorPageComponent title={authorizedOnlyTitle} message={error.message || authorizedOnlyMessage} />
    }
    throw error
  }
}

export const withPageWrapper = <TData, TProps extends Record<string, unknown>>(
  pageWrapperProps: Omit<PageWrapperProps<TData, TProps>, 'Page'>
) => {
  return (Page: React.FC<TProps>) => {
    return () => <PageWrapper {...pageWrapperProps} Page={Page} />
  }
}
