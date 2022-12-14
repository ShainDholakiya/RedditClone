import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Avatar from './Avatar'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import client from '../apollo-client'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}

const PostBox = ({ subreddit }: Props) => {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)

  const [imageBoxOpen, setImageBoxOpen] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData: FormData) => {
    console.log(formData)
    const notification = toast.loading('Creating new post...')

    try {
      const { data: getSubredditListByTopic } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: { topic: subreddit || formData.subreddit },
      })

      const subredditExists =
        getSubredditListByTopic.getSubredditListByTopic.length

      if (!subredditExists) {
        // create subreddit
        console.log('New subreddit....')

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })

        console.log('Creating a post...', formData)

        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log('New post created', newPost)
      } else {
        // add post to subreddit
        console.log('Subreddit exists....')

        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image,
            subreddit_id: getSubredditListByTopic.getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log('New post created', newPost)
      }

      // After post has been added
      // Clear form
      setValue('postTitle', '')
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('subreddit', '')

      toast.success('Post created successfully', { id: notification })
    } catch (error) {
      console.log(error)
      toast.error('Whoops something went wrong', { id: notification })
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className='sticky top-16 z-50 bg-white border rounded-md border-gray-300 p-2'
    >
      <div className='flex items-center space-x-3'>
        <Avatar />

        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
          type='text'
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title!'
              : 'Sign in to post'
          }
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && 'text-blue-500'
          }`}
        />
        <LinkIcon className='h-6 text-gray-300' />
      </div>

      {watch('postTitle') && (
        <div className='flex flex-col py-2'>
          <div className='flex items-center px-2'>
            <p className='min-w-[90px]'>Body:</p>
            <input
              {...register('postBody', { required: true })}
              disabled={!session}
              className='m-2 flex-1 rounded-md bg-gray-50 p-2 outline-none'
              type='text'
              placeholder={
                session
                  ? 'Create a post by entering a title!'
                  : 'Sign in to post'
              }
            />
          </div>

          {!subreddit && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Subreddit:</p>
              <input
                {...register('subreddit', { required: true })}
                disabled={!session}
                className='m-2 flex-1 rounded-md bg-gray-50 p-2 outline-none'
                type='text'
                placeholder='i.e. r/shaincodes'
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className='flex items-center px-2'>
              <p className='min-w-[90px]'>Image URL:</p>
              <input
                {...register('postImage', { required: true })}
                disabled={!session}
                className='m-2 flex-1 rounded-md bg-gray-50 p-2 outline-none'
                type='text'
                placeholder='Optional...'
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className='space-y-2 p-2 text-red-500'>
              {errors.postTitle && <p>Title is required</p>}
              {errors.postBody && <p>Body is required</p>}
              {errors.subreddit && <p>Subreddit is required</p>}
              {errors.postImage && <p>Image is required</p>}
            </div>
          )}

          {watch('postTitle') && (
            <button
              type='submit'
              className='w-full rounded-full bg-blue-400 p-2 text-white'
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
