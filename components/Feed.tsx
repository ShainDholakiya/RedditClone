import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

type Props = {
  topic?: string
}

const Feed = ({ topic }: Props) => {
  const [data, setData] = useState<any>()

  const fetchData = () => {
    if (topic) {
      const { data } = useQuery(GET_ALL_POSTS_BY_TOPIC, {
        variables: { topic },
      })
      setData(data)
    } else {
      const { data } = useQuery(GET_ALL_POSTS)
      setData(data)
    }
  }
  fetchData()
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
