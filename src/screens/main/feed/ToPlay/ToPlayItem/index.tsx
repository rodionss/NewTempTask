import Counter from '@components/Counter'
import { Link, Text } from '@components/main'
import Player from '@components/Player'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import moment from 'moment'
import React from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { HEIGHT_FEED_VIDEO, HEADER_HEIGHT } from '../../../../../const'

const ToPlayContainerItem = styled(Link)`
  height: ${HEIGHT_FEED_VIDEO / 2 - (HEADER_HEIGHT - STATUS_BAR_HEIGHT)}px;
  width: 49%;
  margin-top: 4px;
  overflow: hidden;
  border-radius: 15px;
`

const AuthorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
`

const GameInfoContainer = styled.View`
  margin-top: auto;
  padding-left: 12px;
`

const AuthorAvatar = styled(FastImage)`
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 8px;
`

const AuthorName = styled(Text)`
  font-weight: 600;
  color: #ffffff;
  font-size: 13px;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

const Title = styled(Text)`
  width: 90%;
  font-weight: 800;
  font-size: 15px;
  line-height: 19px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
`

type Props = {
  item: any
  onPress: () => void
}

const ToPlayItem = ({ item, onPress }: Props) => {
  const media = item.user_stats.inspiring_participant
    ? item.user_stats.inspiring_participant.media
    : item.media

  const author = item.user_stats.inspiring_participant
    ? item.user_stats.inspiring_participant.user
    : item.user

  return (
    <ToPlayContainerItem onPress={onPress}>
      <Player media={media} />
      <AuthorContainer>
        <AuthorAvatar source={{ uri: author.photo_url }} />
        <AuthorName>{author.username}</AuthorName>
      </AuthorContainer>
      <GameInfoContainer>
        <Title>{item.title}</Title>
        <Counter
          secondsToEnd={moment(item.finishes_at).diff(moment(), 'seconds')}
        />
      </GameInfoContainer>
    </ToPlayContainerItem>
  )
}

export default ToPlayItem
