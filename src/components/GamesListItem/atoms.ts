import styled from 'styled-components/native'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import { FlatList } from 'react-native-gesture-handler'
import { Link, Text } from '@components/main'
import { HEIGHT_FEED_VIDEO } from '../../const'

export const ItemContainer = styled.View`
  overflow: hidden;
  height: ${HEIGHT_FEED_VIDEO}px;
  border-radius: 35px;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: ${STATUS_BAR_HEIGHT}px;
`

export const GameFeedList = styled(FlatList)`
  height: ${HEIGHT_FEED_VIDEO}px;
  position: absolute;
  width: 100%;
  border-radius: 35px;
`

export const GameInfoContainer = styled.View`
  padding: 0 20px;
`

export const FooterButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: 44px;
  width: 30%;
  margin-left: auto;
  padding-right: 20px;
  padding-bottom: 24px;
  justify-content: flex-end;
`

export const DateText = styled(Text)`
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`

export const Title = styled(Text)`
  width: 60%;
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const SmallButtonContainer = styled.View`
  padding-left: 20px;
  margin-bottom: 14px;
  flex-direction: row;
`

export const SmallButton = styled(Link)`
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 12px;
  border-radius: 6px;
  background-color: #333232;
`

export const SeeDetailedContainer = styled(Link)`
  width: 300px;
  margin-right: -150px;
  height: ${HEIGHT_FEED_VIDEO}px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 24px;
  background-color: #222222aa;
`

export const ReactionContainer = styled.View`
  position: absolute;
  right: 14px;
  z-index: 999;
  bottom: -135px;
`

export const CompletedIndicatorContainer = styled.View`
  width: 96px;
  height: 44px;
  border: 2px solid #fafafaaa;
  border-radius: 18px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
`

export const CompletedIndicatorText = styled.Text`
  font-weight: 800;
  font-size: 15px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(250, 250, 250, 0.6);
`

export const SendPopupContainer = styled.View`
  position: absolute;
  bottom: 64px;
  right: 20px;
  z-index: 9999;
  border-radius: 18px;
  background-color: #333232;
  border: 2px solid #3f3e3e;
`

export const SendPopupItem = styled(Link)`
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-direction: row;
  margin-top: 2px;
  align-self: center;
`

export const SendPopupItemText = styled(Text)`
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  margin-right: 4px;
`

export const CountDownContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 16px;
`

export const RoundIndicator = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 4px;
  background-color: #48db60;
`
