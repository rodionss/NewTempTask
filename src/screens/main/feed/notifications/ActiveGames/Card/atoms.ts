import styled from 'styled-components/native'
import Player from '@components/Player'
import { Link } from '@components/main'
import { Dimensions } from 'react-native'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import { DRAWER_ACTIVE_HEIGHT_COLLAPSED } from '@screens/main/feed/notifications/ActiveGames/atoms'

const { height } = Dimensions.get('window')
const AVAILABLE_HEIGHT =
  (height - DRAWER_ACTIVE_HEIGHT_COLLAPSED - STATUS_BAR_HEIGHT) / 2
const DRAWER_OFFSET = 65
const TIMER_BOTTOM_OFFSET = -AVAILABLE_HEIGHT + DRAWER_OFFSET

export const Wrapper = styled.View`
  width: 130px;
  height: 256px;
  border: 2px solid #fff;
  border-radius: 17px;
  overflow: hidden;
`

export const CounterWrapper = styled.View`
  bottom: ${TIMER_BOTTOM_OFFSET}px;
`

export const Container = styled(Link)`
  width: 100%;
  height: 100%;
  padding: 0;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledPlayer = styled(Player)`
  border-radius: 17px;
`
