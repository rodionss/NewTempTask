import React from 'react'
import Avatar, { AvatarSize } from '@components/common/atoms/Avatar'
import { ReactionIcon } from '@components/Reactions'
import { ReactionWrapper, Wrapper, Name, Username } from './atoms'

type Props = {
  avatarUrl: string
  reaction: string
  name: string
  username: string
  showReaction: boolean
  onPress: () => void
}

function ListItem({
  avatarUrl,
  reaction,
  name,
  username,
  showReaction,
  onPress,
}: Props) {
  return (
    showReaction && (
      <Wrapper onPress={onPress}>
        <Avatar uri={avatarUrl} size={AvatarSize.Contact} />
        <ReactionWrapper>
          <ReactionIcon size={20} reaction={reaction} />
        </ReactionWrapper>
        <Username>{username}</Username>
        <Name>{name}</Name>
      </Wrapper>
    )
  )
}

export default ListItem
