import { Link } from '@components/main'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import { Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { assetList } from '@assets/index'
import { HEIGHT_FEED_VIDEO } from '../../../const'

const { width } = Dimensions.get('window')

type Props = {
  first?: boolean
}

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: ${width}px;
  height: ${HEIGHT_FEED_VIDEO}px;
  align-items: flex-end;
  background-color: #000;
  border-radius: 35px;
`

export const CompletedAuthorContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 16px;
  left: 20px;
  flex-direction: row;
  align-items: center;
`

export const AuthorInfo = styled.View`
  margin-left: 8px;
`

export const ActionButtonContainer = styled.View`
  position: absolute;
  right: 16px;
  z-index: 999;
  bottom: ${HEIGHT_FEED_VIDEO / 3 + STATUS_BAR_HEIGHT}px;
`

export const AuthorName = styled.Text`
  font-weight: 600;
  color: #ffffff;
  font-size: 13px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`

export const CompletedAuthorInspired = styled.Text`
  font-size: 13px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`

export const CompleteAvatarWrapper = styled.View<Props>`
  position: absolute;
  z-index: ${({ first }: Props) => (first ? 999 : 99)};
  ${({ first }: Props) =>
    first ? 'top: 4px; left: 4px;' : 'bottom: 4px; right: 4px;'};
`

export const DotsContainer = styled(Link)`
  position: absolute;
  top: ${STATUS_BAR_HEIGHT + 20}px;
  right: 24px;
  width: 32px;
  height: 32px;
  z-index: 9999;
  align-items: center;
  justify-content: center;
`

export const AuthorIndicator = styled.View`
  position: absolute;
  bottom: -4px;
  left: 16px;
  width: 20px;
  align-items: center;
  justify-content: center;
  height: 20px;
  border-radius: 8px;
  background-color: #333232;
`

export const InviteFriend = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 9px;
  position: absolute;
  background-color: rgba(51, 50, 50, 1);
  z-index: 999;
  top: 4px;
  left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const InviteFriendIcon = styled.Image.attrs({
  source: assetList.inviteFriend,
})`
  width: 16px;
  height: 16px;
`

export const DotsMenu = styled.Image.attrs({
  source: assetList.dotsMenu,
})`
  width: 20px;
  height: 4px;
`
