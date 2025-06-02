import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { canBlockIdeas, canEditIdea } from '@ideanick/backend/src/utils/can'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@ideanick/shared/src/cloudinary'
import { getS3UploadName, getS3UploadUrl } from '@ideanick/shared/src/s3'
import { format } from 'date-fns'
import ImageGallery from 'react-image-gallery'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper, type SetPropsProps } from '../../../lib/pageWrapper'
import { type AppContext } from '../../../lib/ctx'
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'

type IdeaType = NonNullable<TrpcRouterOutput['getIdea']['idea']> & {
  images: string[]
}

const LikeButton = ({ idea }: { idea: IdeaType }) => {
  const trpcUtils = trpc.useContext()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick })
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })
  return (
    <button
      className={css.likeButton}
      onClick={() => {
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
      }}
    >
      <Icon size={32} className={css.likeIcon} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  )
}

const BlockIdea = ({ idea }: { idea: IdeaType }) => {
  const blockIdea = trpc.blockIdea.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ ideaNick: idea.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

type MeType = NonNullable<AppContext['me']>

export const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = getViewIdeaRoute.useParams()
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  setProps: ({ queryResult, getAuthorizedMe }: SetPropsProps<
    { idea: IdeaType | null },
    { idea: IdeaType; me: MeType }
  >) => {
    if (!queryResult?.data?.idea) {
      throw new Error('Idea not found')
    }
    return {
      idea: queryResult.data.idea as IdeaType,
      me: getAuthorizedMe(),
    }
  },
  showLoaderOnFetching: false,
  title: ({ idea }: { idea: IdeaType }) => idea.name,
})(({ idea, me }: { idea: IdeaType; me: MeType }) => (
  <Segment title={idea.name} description={idea.description}>
    <div className={css.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
    <div className={css.author}>
      <img className={css.avatar} alt="" src={getAvatarUrl(idea.author.avatar, 'small')} />
      <div className={css.name}>
        Author:
        <br />
        {idea.author.nick}
        {idea.author.name ? ` (${idea.author.name})` : ''}
      </div>
    </div>
    {!!idea.images.length && (
      <div className={css.gallery}>
        <ImageGallery
          showPlayButton={false}
          showFullscreenButton={false}
          items={idea.images.map((image) => ({
            original: getCloudinaryUploadUrl(image, 'image', 'large'),
            thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
          }))}
        />
      </div>
    )}
    {idea.certificate && (
      <div className={css.certificate}>
        Certificate:{' '}
        <a className={css.certificateLink} target="_blank" href={getS3UploadUrl(idea.certificate)} rel="noreferrer">
          {getS3UploadName(idea.certificate)}
        </a>
      </div>
    )}
    <div className={css.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
    <div className={css.likes}>
      Likes: {idea.likesCount}
      {me && (
        <>
          <br />
          <LikeButton idea={idea} />
        </>
      )}
    </div>
    {canEditIdea(me, idea) && (
      <div className={css.editButton}>
        <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
      </div>
    )}
    {canBlockIdeas(me) && (
      <div className={css.blockIdea}>
        <BlockIdea idea={idea} />
      </div>
    )}
  </Segment>
))
