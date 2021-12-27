import { Text } from '@components/main'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { THEME } from '../../../const'

type HeaderProps = {
  lastHour: boolean
}

export const ImageWrapper = styled.View`
  margin: 0 3px 3px 0;
  position: relative;
`

export const StyledImage = styled(Image)`
  border-radius: 10px;
`

export const Header = styled.View<HeaderProps>`
  background: ${({ lastHour }) =>
    lastHour ? THEME.dangerColor : 'transparent'};
  width: 100%;
  height: 18px;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  z-index: 1;
  padding-left: 8px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

export const Footer = styled.View`
  position: absolute;
  width: 100%;
  display: flex;
  align-items: flex-end;
  padding: 0 8px 4px 0;
  bottom: 0;
  z-index: 2;
`

export const Duration = styled(Text)`
  color: #fafafa;
  font-size: 12px;
  font-weight: 500;
  padding: 0;
`
