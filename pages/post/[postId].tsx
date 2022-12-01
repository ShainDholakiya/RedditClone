import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ADD_COMMENT } from '../../graphql/mutations'
import { toast } from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import TimeAgo from 'react-timeago'

type FormData = {
  comment: string
}

const PostPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: { post_id: router.query.postId },
  })
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, 'getPostById'],
  })

  const post: Post = data?.getPostById

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const noti = toast.loading('Posting comment...')

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: formData.comment,
      },
    })

    setValue('comment', '')

    toast.success('Comment posted!', {
      id: noti,
    })
  })

  return (
    <div className='mx-auto my-7 max-w-5xl'>
      <Post post={post} />

      <div className='-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16'>
        <p className='text-sm'>
          Comment as <span className='text-red-500'>{session?.user?.name}</span>
        </p>
        <form className='flex flex-col space-y-2' onSubmit={onSubmit}>
          <textarea
            {...register('comment')}
            disabled={!session}
            className='h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50'
            placeholder={
              session ? 'What are your thoughts?' : 'Please sign in to comment'
            }
          />

          <button
            disabled={!session}
            type='submit'
            className='rounded-full bg-red-500 p-3 disabled:bg-gray-200'
          >
            Comment
          </button>
        </form>
      </div>
      <div className='-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10'>
        <hr className='py-2' />
        {post?.comment.map((comment) => (
          <div
            key={comment.id}
            className='relative flex items-center space-y-5 space-x-2'
          >
            <hr className='absolute top-10 h-16 border z-0 left-7' />
            <div className='z-50'>
              <Avatar seed={comment.username} />
            </div>
            <div className='flex flex-col'>
              <p className='py-2 text-xs text-gray-400'>
                <span className='font-semibold'>{comment.username}</span>{' '}
                <TimeAgo date={comment.created_at} />
              </p>
              <p>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostPage
