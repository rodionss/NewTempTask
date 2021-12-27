import { BigProfileIcon } from '@components/icons'
import { Link, Text } from '@components/main'
import PosibleFriendList from '@components/PosibleFriendList'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
  flex: 1;
  padding-top: ${STATUS_BAR_HEIGHT + 128}px;
  align-items: center;
`

const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  margin-top: 12px;
  color: #fafafa;
`

const Description = styled(Text)`
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  color: #fafafa;
  padding: 0 32px;
  margin-top: 8px;
  margin-bottom: 16px;
  opacity: 0.6;
`

const ExploreButtonContainer = styled(Link)`
  width: 90%;
  padding: 16px 0;
  align-self: center;
  align-items: center;
  border-radius: 24px;
  margin-bottom: 16px;
  justify-content: center;
  background-color: #333232;
`

const ButtonText = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #fafafa;
`

const Triangle = styled.View`
  position: absolute;
  width: 24px;
  height: 24px;
  bottom: -8px;
  left: 24%;
  z-index: 99999;
  transform: rotate(45deg);
  background-color: #333232;
`

const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: #333232;
`
type Props = {
  navigation: any
}

type Button = {
  onPress: () => void
}

export const ExploreButton = ({ onPress }: Button) => (
  <ExploreButtonContainer onPress={onPress}>
    <ButtonText>Go to explore</ButtonText>
    <Triangle />
  </ExploreButtonContainer>
)

const FeedEmpty = ({ navigation }: Props) => {
  return (
    <Container>
      <BigProfileIcon />
      <Title>{"It's empty for now"}</Title>
      <Description>
        {'Subscribe to interesting people and their games will appear here'}
      </Description>
      <PosibleFriendList navigation={navigation} />
      <Separator />
      <Title style={{ marginBottom: 16 }}>{'Find new games'}</Title>
      <ExploreButton onPress={() => navigation.navigate('Explore')} />
    </Container>
  )
}

export default FeedEmpty
