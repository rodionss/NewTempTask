import { Challenge } from '@app-types/challenge'
import { Text } from '@components/main'
import { getMuted, setMuted } from '@modules/main'
import React from 'react'
import {
  Dimensions,
  StyleProp,
  TouchableOpacityProps,
  ViewProps,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { OnboardingButton } from '.'
import { HEIGHT_FEED_VIDEO } from '../const'
import Avatar from './common/atoms/Avatar'
import Player from './Player'

const { width } = Dimensions.get('window')

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: ${width}px;
  height: ${HEIGHT_FEED_VIDEO}px;
  align-items: flex-end;
  border-radius: 35px;
`

const Footer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16;
  width: 100%;
  padding: 0 20px;
`

const UserName = styled(Text)`
  font-size: 14px;
  color: #fff;
  font-weight: 600;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`
const Name = styled(Text)`
  font-size: 14px;
  color: #d9d9d9;
  font-weight: normal;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

const Title = styled(Text)`
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  text-transform: uppercase;
  color: #ffffff;
  width: 70%;
  margin-bottom: 3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const Author = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Info = styled.View`
  margin-left: 12px;
`

const ButtonCotnainer = styled.View`
  margin-left: auto;
  align-items: flex-end;
`

type ButtonType = {
  onPress: () => void
  icon: (props?: object) => Element
  text?: string
  light?: boolean
  textStyle?: object
  containerStyle?: object
  isLoading?: boolean
}

type Props = {
  authorPhotoSize?: number
  game?: Challenge
  author: {
    photo_url: string
    username: string
    name: string
  }
  play?: boolean
  containerStyle?: StyleProp<ViewProps>
  media?: any // Media
  button?: ButtonType | TouchableOpacityProps
}
const OnboardingGame = ({
  author,
  media,
  button,
  game = {},
  play = false,
  containerStyle = {},
  authorPhotoSize = 0,
}: Props) => {
  const dispatch = useDispatch()
  const muted = useSelector(getMuted)
  return (
    <Container
      onPress={() => {
        dispatch(setMuted(!muted))
      }}
      style={containerStyle}
    >
      <Player muted={muted} preload={true} media={media} play={play} />
      <Footer>
        {game.title ? <Title>{game.title}</Title> : null}
        <RowContainer>
          <Author>
            <Avatar size={authorPhotoSize || 40} uri={author.photo_url} />
            <Info>
              <UserName>{author.username}</UserName>
              <Name>{author.name}</Name>
            </Info>
          </Author>
          <ButtonCotnainer>
            <OnboardingButton {...button} />
          </ButtonCotnainer>
        </RowContainer>
      </Footer>
    </Container>
  )
}

export default OnboardingGame
