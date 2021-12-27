import { NavBarTitle, Text } from '@components/main'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import styled, { css } from 'styled-components/native'
import { THEME } from '../../../const'

type ContainerProps = {
  size: HeaderSize
  rounded?: boolean
}

type CapsProps = {
  caps?: boolean
}

export enum HeaderSize {
  Modal = 'modal',
  Main = 'main',
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: ${({ size }) =>
    size === HeaderSize.Main ? STATUS_BAR_HEIGHT + 60 : 54}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 20px 10px 20px;
  background-color: ${({ size }) =>
    size === HeaderSize.Main
      ? THEME.navBarBackground
      : THEME.primaryBackgroundColor};
  border-radius: ${({ size }) => (size === HeaderSize.Main ? 0 : 35)}px;

  ${({ rounded }) =>
    rounded &&
    css`
      border-radius: 35px;
      background-color: rgba(27, 29, 29, 0.95);
    `}
`

export const Button = styled.TouchableOpacity`
  height: 36px;
  min-width: 36px;
  padding: 4px;
  align-items: center;
  justify-content: center;
`

export const ButtonText = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  color: #919191;
`

export const Title = styled(NavBarTitle)<CapsProps>`
  align-items: center;
  padding-bottom: 6px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: ${({ caps }) => (caps ? 'uppercase' : 'none')};
`

export const Summary = styled.View`
  flex-direction: row;
  justify-content: space-around;
`

export const Loader = styled.ActivityIndicator`
  height: 36px;
  width: 36px;
  padding: 4px;
  align-items: center;
  justify-content: center;
  color: ${THEME.navBarColor};
`
