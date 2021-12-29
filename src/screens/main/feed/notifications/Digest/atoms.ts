import styled from 'styled-components/native'
import { Text } from '@components/main'
import LinearGradient from 'react-native-linear-gradient'
import { Image, TouchableOpacity } from 'react-native'

export const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  padding: 20px;
  justify-content: center;
  align-items: center;
  z-index: 9998;
`

export const DigestWrapper = styled.View`
  width: 100%;
  border-radius: 35px;
  background-color: rgba(17, 19, 19, 1);

  align-items: center;
  margin-bottom: 10px;
`

export const Title = styled(Text)`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #fafafa;
  margin-bottom: 25px;
  z-index: 9999;
`
export const TextInfo = styled(Text)`
  text-align: center;
  margin-left: 25px;
  margin-right: 25px;
  font-size: 15px;
  font-weight: 500;
  color: #cdcdcd;
  margin-bottom: 24px;
`
export const BackgroundView = styled(LinearGradient)`
  position: relative;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  width: 100%;
  height: 205px;
  z-index: 9999;
`
export const BackgroundImage = styled(Image)`
  position: absolute;
  margin-top: 10px;
  width: 305px;
  height: 183px;
  z-index: 9998;
`
export const NotificationImage = styled(Image)`
  width: 20px;
  height: 22px;
`
export const BackgroundBlurImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
`
export const NotificationContainer = styled.View`
  position: absolute;
  width: 154px;
  height: 154px;
  background-color: rgba(31, 31, 31, 1);
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  right: -50px;
  top: -10px;
  z-index: 9998;
`
export const ButtonMargin = styled.View`
  width: 100%;
  padding: 0 15px 15px 15px;
`
export const NotificationTouchable = styled(TouchableOpacity)``
