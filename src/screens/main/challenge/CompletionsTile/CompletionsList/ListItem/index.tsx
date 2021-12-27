import React, { useState, useMemo } from 'react'
import { Image } from 'react-native'
import Avatar from '@components/common/atoms/Avatar'
import Player from '@components/Player'
import { assetList } from '@assets/index'
import { Label } from '@screens/main/challenge/CompletionsTile/InviteFriend/atoms'
import {
  Wrapper,
  Container,
  HeaderItem,
  PositionNumber,
  StarWrapper,
  AvatarWrapper,
  AvatarFallbackWrapper,
  AvatarFallback,
} from './atoms'

type Props = {
  onPress: () => void
  username: string
  name: string
  avatarUrl: string
  position: number
  media: object
  isAuthor: boolean
  currentCompletion: boolean
}

function ChallengeListItem({
  onPress,
  avatarUrl,
  username,
  name,
  position,
  media,
  isAuthor = true,
  currentCompletion,
}: Props) {
  const [avatarExists, setAvatarExists] = useState(true)
  const positionNumber = `# ${position}`

  const avatar = useMemo(() => {
    if (avatarExists) {
      return (
        <Avatar
          onError={() => setAvatarExists(false)}
          source={{ uri: avatarUrl }}
        />
      )
    }

    const initials = name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')

    return (
      <AvatarFallbackWrapper>
        <AvatarFallback>{initials}</AvatarFallback>
      </AvatarFallbackWrapper>
    )
  }, [avatarExists])

  return (
    <Wrapper>
      <Container onPress={onPress} currentCompletion={currentCompletion}>
        <HeaderItem>
          <AvatarWrapper>
            <Avatar size={24} uri={avatarUrl} />
            {isAuthor && (
              <StarWrapper>
                <Image
                  style={{ width: 12, height: 12 }}
                  source={assetList.authorStar}
                />
              </StarWrapper>
            )}
          </AvatarWrapper>
          <PositionNumber>{positionNumber}</PositionNumber>
        </HeaderItem>
        <Player media={media} play={false} />
      </Container>
      <Label>{username}</Label>
    </Wrapper>
  )
}

export default ChallengeListItem
