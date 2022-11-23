import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Header from '../components/Header'
import PostBox from '../components/PostBox'

export default function Home() {
  return (
    <div className='max-w-5xl my-7 mx-auto'>
      <Head>
        <title>Reddit Clone</title>
        <meta name='description' content='Dope reddit clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PostBox />

      <div className='flex'>
        <Feed />
      </div>
    </div>
  )
}
