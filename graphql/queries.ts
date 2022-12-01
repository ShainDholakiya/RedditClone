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

export const GET_POST_BY_POST_ID = gql`
  query GetPostByPostIdQuery($post_id: ID!) {
    getPostById(post_id: $post_id) {
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

export const GET_ALL_POSTS_BY_TOPIC = gql`
  query GetAllPostsByTopicQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
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


export const GET_SUBREDDITS_BY_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditListLimit(limit: $limit) {
      id
      topic
      created_at
    }
  }
`

export const GET_ALL_VOTES_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      id
      created_at
      post_id
      upvote
      username
    }
  }
`