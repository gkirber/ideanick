import { createRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { useMe } from '../../lib/ctx'
import {
  getAllIdeasRoute,
  getEditProfileRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes'

import css from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()
  const location = useLocation()

  const handleGetLinkClass = (route: string) => {
    const isActive = location.pathname === route || (route === getAllIdeasRoute() && location.pathname === '/')
    return isActive ? `${css.link} ${css.active}` : css.link
  }

  return (
    <div className={css.layout}>
      <div className={css.container}>
        {/* Sidebar */}
        <div className={css.sidebar}>
          <div className={css.header}>
            <div className={css.bulb}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#facc15"
                stroke="#facc15"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2v1"></path>
                <path d="M12 3a6 6 0 0 1 6 6v1.5a3.5 3.5 0 0 1-3.5 3.5H12"></path>
                <path d="M8.5 14A3.5 3.5 0 0 1 5 10.5V9a6 6 0 0 1 6-6z"></path>
              </svg>
            </div>
            <h1 className={css.title}>IdeaNick</h1>
          </div>

          <nav className={css.navigation}>
            <Link className={handleGetLinkClass(getAllIdeasRoute())} to={getAllIdeasRoute()}>
              All Ideas
            </Link>
            {me ? (
              <>
                <Link className={handleGetLinkClass(getNewIdeaRoute())} to={getNewIdeaRoute()}>
                  Add Idea
                </Link>
                <Link className={handleGetLinkClass(getEditProfileRoute())} to={getEditProfileRoute()}>
                  Edit Profile
                </Link>
                <Link className={css.link + ' ' + css.logout} to={getSignOutRoute()}>
                  Log Out ({me.nick})
                </Link>
              </>
            ) : (
              <>
                <Link className={handleGetLinkClass(getSignUpRoute())} to={getSignUpRoute()}>
                  Sign Up
                </Link>
                <Link className={handleGetLinkClass(getSignInRoute())} to={getSignInRoute()}>
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className={css.content} ref={layoutContentElRef}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
