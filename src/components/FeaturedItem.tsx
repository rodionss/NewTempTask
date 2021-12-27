import React from 'react'
import * as R from 'ramda'
import { Dimensions } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { ComplexButton } from '.'
import { Text, Link } from './main'
import Player from './Player'

const { height } = Dimensions.get('window')

const FeaturedContainer = styled.View`
  height: ${height / 2 + height / 8}px;
  width: 300px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #282828;
`

const BlackoutContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px;
  align-items: center;
  justify-content: flex-end;
  background-color: #00000099;
`

const UserContainer = styled(Link)`
  align-items: center;
`

const Avatar = styled(FastImage)`
  height: 100px;
  width: 100px;
  border-radius: 50px;
`

const Username = styled(Text)`
  margin-top: 8px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
`

const Bio = styled(Text)`
  font-size: 12px;
  line-height: 15px;
  margin-top: 4px;
  text-align: center;
  color: #ffffff;
  opacity: 0.6;
`

const FollowButtonContainer = styled.View`
  width: 100%;
  margin-top: 40px;
`

type Props = {
  navigation: any
  follow: boolean
  onPress: () => void
  play: boolean
  item: any
}

const FeaturedItem = ({ navigation, follow, onPress, play, item }: Props) => (
  <FeaturedContainer>
    <Player
      muted={true}
      paused={false}
      play={play}
      media={item.top_challenge.media}
    />
    <BlackoutContainer>
      <UserContainer
        onPress={() => {
          navigation.push('AlienProfile', { user: item })
        }}
      >
        <Avatar source={{ uri: item.photo_url }} />
        <Username>{item.username}</Username>
        <Bio>{item.bio}</Bio>
      </UserContainer>

      <FollowButtonContainer>
        <ComplexButton
          onPress={onPress}
          text={follow ? 'Unfollow' : 'Follow'}
          primary={!follow}
        />
      </FollowButtonContainer>
    </BlackoutContainer>
  </FeaturedContainer>
)

export default R.compose(withNavigationFocus)(FeaturedItem)
