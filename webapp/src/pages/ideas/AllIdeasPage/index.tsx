import { zGetIdeasTrpcInput } from '@ideanick/backend/src/router/ideas/getIdeas/input'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'

import { Alert } from '../../../components/Alert'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { useDebounce } from '../../../hooks/useDebounce'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

import css from './index.module.scss'

export const AllIdeasPage = withPageWrapper({
  title: 'IdeaNick',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetIdeasTrpcInput.pick({ search: true }),
  })
  const search = useDebounce(formik.values.search, 500)
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getIdeas.useInfiniteQuery(
      {
        search,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
    )

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h2 className={css.title}>All Ideas</h2>

        <div className={css.searchContainer}>
          <div className={css.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            className={css.searchInput}
            value={formik.values.search}
            onChange={formik.handleChange}
            name="search"
          />
        </div>
      </div>

      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data.pages[0].ideas.length ? (
        <Alert color="brown">Nothing found by search</Alert>
      ) : (
        <div className={css.ideas}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={css.more} key="loader">
                <Loader type="section" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
          >
            {data.pages
              .flatMap((page) => page.ideas)
              .map((idea) => (
                <div className={css.ideaCard} key={idea.nick}>
                  <Link to={getViewIdeaRoute({ ideaNick: idea.nick })} className={css.ideaLink}>
                    <h3 className={css.ideaTitle}>{idea.name}</h3>
                    <p className={css.ideaDescription}>{idea.description}</p>
                    <div className={css.ideaLikes}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      Likes: {idea.likesCount}
                    </div>
                  </Link>
                </div>
              ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
})
