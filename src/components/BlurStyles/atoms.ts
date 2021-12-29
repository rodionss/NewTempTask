import styled from 'styled-components/native'
import { Animated, Image, TouchableOpacity, View, Text } from 'react-native'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import { FlatList } from 'react-native-gesture-handler'
import { HEIGHT_FEED_VIDEO } from '../../const'

export const ItemContainer = styled.View`
  overflow: hidden;
  height: ${HEIGHT_FEED_VIDEO}px;
  border-radius: 35px;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: ${STATUS_BAR_HEIGHT}px;
`
export const TouchElemet = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  background-color: red;
`
