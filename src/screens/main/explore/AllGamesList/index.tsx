import GameTileItem from '@components/GameTileItem'
import { BackIcon } from '@components/icons'
import { Text } from '@components/main'
import { keyExtractor, STATUS_BAR_HEIGHT } from '@utils/functions'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useMemo } from 'react'
import styled from 'styled-components/native'
import { TAB_HEIGHT, THEME } from '../../../../const'
import { GameList } from '../Explore/atoms'

const Container = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${THEME.primaryBackgroundColor};
`

const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: ${STATUS_BAR_HEIGHT + 12}px;
  left: 12px;
  z-index: 999;
  width: 44px;
  height: 44px;
`

const Header = styled.ImageBackground`
  width: 100%;
  justify-content: flex-end;
  margin-bottom: 20px;
  min-height: ${STATUS_BAR_HEIGHT + 180}px;
`

const TextGradientContainer = styled(LinearGradient).attrs({
  colors: [THEME.primaryBackgroundColor, '#00000077', '#ffffff00'],
  start: { x: 0, y: 0.7 },
  end: { x: 0, y: 0 },
})``

const Title = styled(Text)`
  font-weight: 900;
  font-size: 32px;
  line-height: 32px;
  text-align: center;
  padding: 0 30px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

const GamesCount = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  margin-top: 12px;
  text-align: center;
  align-self: center;
  color: #919191;
`

type Props = {
  navigation: any
}

const AllGamesList = ({ navigation }: Props) => {
  const topic = useMemo(() => navigation.state.params.item || {}, [])
  return (
    <Container>
      <Header source={{ uri: topic.thumbnail_url }}>
        <BackButton onPress={() => navigation.goBack()}>
          <BackIcon />
        </BackButton>
        <TextGradientContainer>
          <Title>{topic.title}</Title>
          <GamesCount>{topic.challenges.length} Games</GamesCount>
        </TextGradientContainer>
      </Header>
      <GameList
        data={topic.challenges || []}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <GameTileItem
            item={item}
            containerStyle={{ marginTop: 8 }}
            onPress={() => {
              navigation.navigate('ChallengeDetailed', {
                direct: true,
                challenge: item,
              })
            }}
          />
        )}
      />
    </Container>
  )
}

export default AllGamesList
