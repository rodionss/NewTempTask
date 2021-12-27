import styled from 'styled-components/native'
import { Link, ScrollView, Text } from '@components/main'
import { THEME } from '../../../../const'

type SizeProps = {
  width: number
  height: number
}

type CenteredProps = {
  centered?: boolean
}

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
`

export const Wrapper = styled.View`
  background-color: #111313;
  height: 100%;
`

export const ModalContent = styled.View`
  padding-top: 16px;
  align-items: center;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: #1a1c1c;
  z-index: 9999;
  height: 60%;
`

export const Group = styled.View`
  margin-bottom: 32px;
`

export const ButtonGroup = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const ButtonsWrapper = styled.View`
  padding: 32px 20px 0 20px;
`

export const Button = styled(Link)`
  background-color: #1a1c1c;
  padding: 16px 18px;
  border-radius: 30px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ButtonText = styled(Text)`
  text-transform: uppercase;
  color: #fafafa;
  font-weight: 800;
  font-size: 12px;
  line-height: 18px;
`

export const Title = styled(Text)<CenteredProps>`
  font-family: ${THEME.textFont};
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
  color: #919191;
  margin-bottom: 16px;
  text-align: ${({ centered }: CenteredProps) =>
    centered ? 'center' : 'left'};
`

export const Icon = styled.Image<SizeProps>`
  width: ${({ width }: SizeProps) => width}px;
  height: ${({ height }: SizeProps) => height}px;
`

export const LeftSide = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ContactList = styled(ScrollView)`
  width: 100%;
`
