import Counter from '@components/Counter'
import { Link, Text } from '@components/main'
import Player from '@components/Player'
import moment from 'moment'
import React from 'react'
import { Dimensions, StyleProp, ViewStyle } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import Avatar from './common/atoms/Avatar'

const { width } = Dimensions.get('window')

const ContainerItem = styled(Link)`
  width: ${(width - 60) / 2}px;
  height: ${((width / 3.2 - 3) * 5) / 2}px;
  overflow: hidden;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  margin-left: 8px;
  font-size: 13px;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

const Title = styled(Text)`
  width: 100%;
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
  containerStyle?: StyleProp<ViewStyle>
}

const GameTileItem = ({ item, onPress, containerStyle = {} }: Props) => {
  const media =
    item.user_stats && item.user_stats.inspiring_participant
      ? item.user_stats.inspiring_participant.media
      : item.media

  const author =
    item.user_stats && item.user_stats.inspiring_participant
      ? item.user_stats.inspiring_participant.user
      : item.user
  return (
    <ContainerItem style={containerStyle} onPress={onPress}>
      <Player media={media} />
      <AuthorContainer>
        <Avatar size={24} uri={author.photo_url} />
        <AuthorName>{author.username}</AuthorName>
      </AuthorContainer>
      <GameInfoContainer>
        <Title>{item.title}</Title>
        <Counter
          secondsToEnd={moment(item.finishes_at).diff(moment(), 'seconds')}
        />
      </GameInfoContainer>
    </ContainerItem>
  )
}

export default GameTileItem
