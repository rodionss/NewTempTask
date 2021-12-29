import styled from 'styled-components/native'
import { Link, Text } from '@components/main'
import { THEME } from '../../../../../const'
import { Image } from 'react-native'

export const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  z-index: 9998;
  position: relative;
  border-radius: 32px;
  background-color: #1f1f1f;
  padding: 16px;
  height: 570px;
  margin: auto 20px;
`
export const BackgroundBlurImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
`

export const RoundButton = styled(Link)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #5b5a5a;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 16px;
  left: 16px;
`

export const Title = styled(Text)`
  text-align: center;
  font-weight: 700;
  font-size: 28px;
  line-height: 37px;
  color: #fff;
  margin-top: 28px;
`

export const ItemsWrapper = styled.View`
  margin: 24px 0 8px 0;
`

export const Item = styled.View`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Icon = styled.Image`
  width: 44px;
  height: 44px;
`

export const RightSide = styled.View`
  margin-left: 12px;
`

export const ItemTitle = styled(Text)`
  color: #fff;
  font-weight: 700;
  font-family: ${THEME.textFont};
  font-size: 15px;
  line-height: 23px;
`

export const Description = styled(Text)`
  font-family: ${THEME.textFont};
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
  color: #cdcdcd;
`

export const SmallText = styled(Text)`
  font-family: ${THEME.textFont};
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
  color: #cdcdcd;
  margin: 8px 0;
`
