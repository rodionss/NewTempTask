import styled from 'styled-components/native'
import { Text } from '@components/main'
import LinearGradient from 'react-native-linear-gradient'
import { Image, TouchableOpacity } from 'react-native'

export const ActivityWrapper = styled.View`
  width: 100%;
  border-radius: 32px;
  background-color: rgba(31, 31, 31, 1);
  display: flex;
  align-items: center;
  z-index: 9998;
  margin-bottom: 200px;
`
export const ImageWrapper = styled.View`
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
  width: 100%;
  height: 200px;
  position: relative;
  z-index: 9998;
`
export const ButtonMargin = styled.View`
  width: 100%;
  padding: 0 16px 14px 16px;
`

export const Title = styled(Text)`
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #fafafa;
  margin-top: 25px;
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
export const BackgroundPeopleImage = styled(Image)`
  position: absolute;
  margin-top: 10px;
  left: 0;
  top: -10px;
  border-top-left-radius: 32px;
  width: 229px;
  height: 261px;
`
export const BackgroundSmileImage = styled(Image)`
  position: absolute;
  right: 0;
  top: -10px;
  border-top-right-radius: 32px;
  margin-top: 10px;
  width: 239px;
  height: 239px;
  
`
