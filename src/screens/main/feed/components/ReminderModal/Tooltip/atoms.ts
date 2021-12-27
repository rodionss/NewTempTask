import styled from 'styled-components/native'
import { assetList } from '@assets/index'
import { STATUS_BAR_HEIGHT } from '@utils/functions'

export const Container = styled.View`
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  top: ${STATUS_BAR_HEIGHT + 60}px;
`

export const Wrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex-direction: row;
  padding: 2px 2px 2px 10px;
  height: 40px;
  max-width: 280px;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(17, 19, 19, 0.25);
  border-radius: 20px;
  z-index: 9999;
`

export const Button = styled.TouchableOpacity`
  background-color: #333232;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  height: 36px;
  padding: 0 16px;
`

export const ButtonText = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  color: #fff;
`

export const Text = styled.Text`
  color: #fff;
  text-align: center;
  margin-right: 10px;
`

export const SavedIcon = styled.Image.attrs({
  source: assetList.saveIcon,
})`
  width: 24px;
  height: 24px;
`
