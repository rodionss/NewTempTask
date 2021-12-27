import React, { useState } from 'react'
import { Wrapper, AvatarImage, AvatarFallbackImage } from './atoms'

export enum AvatarSize {
  S = 24,
  M = 32,
  L = 88,
  XL = 375,
  Navbar = 28,
  Contact = 72,
}

type Props = {
  uri?: string
  size?: AvatarSize
  onError?: () => void
  children?: React.ReactNode
}

function Avatar({ uri, size = AvatarSize.S, onError, children }: Props) {
  const [error, setError] = useState(false)

  const showAvatar = uri && !error

  const handleError = () => {
    if (onError) {
      onError()
    }
    setError(true)
  }

  const avatar = showAvatar ? (
    <AvatarImage
      children={children}
      source={{ uri }}
      size={size}
      onError={handleError}
    />
  ) : (
    <AvatarFallbackImage children={children} size={size} />
  )

  return <Wrapper size={size}>{avatar}</Wrapper>
}

export default Avatar
