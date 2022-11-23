import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query GetAllPostsQuery {
    getPostList {
        body
        comment {
            id
            created_at
            post_id
            text
            username
        }
        created_at
        id
        image
        subreddit {
            id
            created_at
            topic
        }
        subreddit_id
        title
        username
        vote {
            created_at
            id
            post_id
            upvote
            username
        }
    }
  }
`

export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      topic
      created_at
    }
  }
`
