import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        <meta name='description' content='Dope reddit clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </div>
  )
}
