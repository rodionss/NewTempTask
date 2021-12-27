import { assetList } from '@assets/index'
import { BigFlagIcon } from '@components/icons'
import { FlatList, Text } from '@components/main'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import React, { useCallback } from 'react'
import styled from 'styled-components/native'
import { HEIGHT_FEED_VIDEO } from '../../../../const'
import ToPlayItem from './ToPlayItem'

const TO_PLAY_HEADER = 64

const ToPlayContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  height: 100%;
  background-color: #050505;
`

const ToPlayHeader = styled.View`
  width: 100%;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  z-index: 9999;
  height: ${STATUS_BAR_HEIGHT + TO_PLAY_HEADER}px;
  background-color: rgba(17, 19, 19, 0.95);
`
const ToPlayGameList = styled(FlatList).attrs({
  contentContainerStyle: {
    paddingTop: STATUS_BAR_HEIGHT + TO_PLAY_HEADER,
    paddingBottom: STATUS_BAR_HEIGHT + TO_PLAY_HEADER,
  },
})`
  margin-top: -${STATUS_BAR_HEIGHT + TO_PLAY_HEADER}px;
  width: 100%;
  height: ${HEIGHT_FEED_VIDEO}px;
`

const PlaceholderImage = styled.ImageBackground.attrs({
  source: assetList.toPlayPlaceholder,
  resizeMode: 'contain',
})`
  width: 100%;
  height: ${HEIGHT_FEED_VIDEO}px;
  justify-content: center;
  margin-top: -${TO_PLAY_HEADER}px;
  align-items: center;
`

const PlaceholderText = styled(Text)`
  font-size: 15px;
  line-height: 22px;
  padding: 0 20px;
  text-align: center;
  color: #919191;
`
const PlaceholderTitleText = styled(PlaceholderText)`
  font-weight: 800;
  font-size: 20px;
  margin-bottom: 12px;
`

type Props = {
  data: any[]
  navigation: any
}

const ListEmptyComponent = (
  <PlaceholderImage>
    <BigFlagIcon opacity={0.4} />
    <PlaceholderTitleText>Postponed games</PlaceholderTitleText>
    <PlaceholderText>
      ☝After the expiration of the game, it will disappear from actual
    </PlaceholderText>
  </PlaceholderImage>
)

const ToPlay = ({ data, navigation }: Props) => {
  const renderItem = useCallback(
    ({ item }: any) => (
      <ToPlayItem
        item={item}
        onPress={() => {
          navigation.push('ChallengeDetailed', {
            challenge: item,
            direct: true,
          })
        }}
      />
    ),
    [],
  )
  return (
    <ToPlayContainer>
      <ToPlayHeader />
      <ToPlayGameList
        data={data}
        numColumns={2}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </ToPlayContainer>
  )
}

export default ToPlay
