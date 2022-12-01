import Image from 'next/image'
import React from 'react'
import { useSession } from 'next-auth/react'

type Props = {
  seed?: string
  large?: boolean
}

const Avatar = ({ seed, large }: Props) => {
  const { data: session } = useSession()

  return (
    <div
      className={`relative overflow-hidden h-10 w-10 rounded-full border-gray-300 bg-white ${
        large && 'h-20 w-20'
      }`}
    >
      <Image
        alt='avatar'
        src={`https://avatars.dicebear.com/api/human/${
          seed || session?.user?.name || 'placeholder'
        }.svg`}
        layout='fill'
      />
    </div>
  )
}

export default Avatar
