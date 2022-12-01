import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

type Props = {
  topic?: string
}

const Feed = ({ topic }: Props) => {
  const query = topic ? GET_ALL_POSTS_BY_TOPIC : GET_ALL_POSTS
  // const { data } = useQuery(!topic ? GET_ALL_POSTS_BY_TOPIC, {
  //   variables: { topic },
  // })
  const { data } = useQuery(query, {
    variables: topic ? { topic } : {},
  })

  // const { data, error } = !topic
  //   ? useQuery(GET_ALL_POSTS)
  //   : useQuery(GET_ALL_POSTS_BY_TOPIC, {
  //       variables: { topic },
  //     })

  const posts: Post[] = !topic ? data?.getPostList : data?.getPostListByTopic

  return (
    <div className='mt-5 space-x-4'>
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
