import styled, { css } from 'styled-components/native'
import { Dimensions } from 'react-native'
import { assetList } from '@assets/index'
import { Link, Text } from '@components/main'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import { THEME } from '../../../../../const'

const DRAWER_HEIGHT = Dimensions.get('window').height / 2 + 200
export const DRAWER_ACTIVE_HEIGHT_COLLAPSED =
  (Dimensions.get('window').height / 11) * 7
const DRAWER_ACTIVE_HEIGHT_EXPANDED =
  Dimensions.get('window').height - STATUS_BAR_HEIGHT - 60

type Props = {
  selected?: boolean
}

type UnreadNotifications = {
  unreadNotifications?: boolean
}

type Collapsed = {
  collapsed?: boolean
}

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
  position: relative;
`
export const EmptyState = styled.Image.attrs({
  source: assetList.noActiveGames,
  resizeMode: 'contain',
})`
  height: 400px;
  width: 100%;
`

export const Drawer = styled.View`
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background: rgba(17, 19, 19, 1);
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: ${DRAWER_HEIGHT};
  top: -200px;
`

export const DrawerActive = styled.View<Collapsed>`
  position: absolute;
  bottom: 0;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: #111313;
  padding: 20px 15px;
  height: ${({ collapsed }: Collapsed) =>
    collapsed
      ? DRAWER_ACTIVE_HEIGHT_COLLAPSED
      : DRAWER_ACTIVE_HEIGHT_EXPANDED}px;
`

export const Title = styled(Text)`
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 8px;
  text-align: center;
`

export const Description = styled(Text)`
  font-size: 15px;
  color: #fafafa;
  margin-bottom: 24px;
  text-align: center;
  line-height: 24px;
`

export const ButtonsBar = styled.View`
  background-color: #1f1e1e;
  height: 44px;
  padding: 1px;
  display: flex;
  margin: 0 5px;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 24px;
`

export const Button = styled(Link)<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-radius: 18px;
  background-color: ${({ selected }: Props) =>
    selected ? '#333232' : '#1f1e1e'};
`

export const ButtonText = styled(Text)<Props>`
  color: #fff;
  ${({ selected }: Props) =>
    !selected &&
    css`
      opacity: 0.6;
    `}
`

export const IconWrapper = styled.View<UnreadNotifications>`
  ${({ unreadNotifications }: UnreadNotifications) =>
    unreadNotifications &&
    css`
      transform: rotate(-15deg);
    `}
`
