import { useParams as useReactRouterParams } from 'react-router-dom'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Клієнтське середовище (Vite)
    return import.meta.env.VITE_WEBAPP_URL || ''
  }
  // Серверне середовище (Node.js)
  return process.env.WEBAPP_URL || ''
}

const baseUrl = getBaseUrl()

interface PumpedGetRouteInputBase {
  abs?: boolean
}

interface PumpedGetRouteResult<T extends Record<string, string>> {
  (routeParams: { [K in keyof T]: string } & PumpedGetRouteInputBase): string
  placeholders: { [K in keyof T]: string }
  useParams: () => { [K in keyof T]: string }
  definition: string
}

function pumpGetRoute<T extends Record<string, string>>(
  routeParamsDefinition: T,
  getRoute: (routeParams: { [K in keyof T]: string }) => string
): PumpedGetRouteResult<T>

function pumpGetRoute(getRoute: () => string): {
  (routeParams?: PumpedGetRouteInputBase): string
  placeholders: Record<string, never>
  useParams: () => Record<string, never>
  definition: string
}

function pumpGetRoute(
  routeParamsOrGetRoute: Record<string, boolean> | (() => string),
  maybeGetRoute?: (params: Record<string, string>) => string
) {
  const isSimpleRoute = typeof routeParamsOrGetRoute === 'function'
  const routeParamsDefinition = isSimpleRoute ? {} : routeParamsOrGetRoute
  const getRoute = isSimpleRoute ? routeParamsOrGetRoute : maybeGetRoute

  if (!getRoute) throw new Error('Invalid arguments for pumpGetRoute')

  const placeholders = Object.keys(routeParamsDefinition).reduce(
    (acc, key) => ({ ...acc, [key]: `:${key}` }),
    {} as Record<string, string>
  )

  const definition = isSimpleRoute ? (getRoute as () => string)() : getRoute(placeholders)

  const pumpedGetRoute = (routeParams?: PumpedGetRouteInputBase) => {
    const route = isSimpleRoute ? (getRoute as () => string)() : getRoute(routeParams as Record<string, string>)

    return routeParams?.abs ? `${baseUrl}${route}` : route
  }

  pumpedGetRoute.placeholders = placeholders
  pumpedGetRoute.definition = definition
  pumpedGetRoute.useParams = useReactRouterParams as () => typeof placeholders

  return pumpedGetRoute
}

export type RouteParams<T extends { placeholders: Record<string, string> }> = {
  [K in keyof T['placeholders']]: string
}

export const pgr = pumpGetRoute
