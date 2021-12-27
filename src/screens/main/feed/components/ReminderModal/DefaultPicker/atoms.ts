import styled, { css } from 'styled-components/native'
import { Link, Text } from '@components/main'

type Props = {
  top?: boolean
  bottom?: boolean
}

export const Wrapper = styled.View`
  background-color: #111313;
  width: 100%;
`

export const TimePickerWrapper = styled.View`
  background-color: #333232;
  border-radius: 24px;
  margin-bottom: 12px;
`

export const TimeButton = styled(Link)<Props>`
  background-color: #333232;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(71, 70, 70, 0.6);

  ${({ top }: Props) =>
    top &&
    css`
      border-top-right-radius: 24px;
      border-top-left-radius: 24px;
    `}

  ${({ bottom }: Props) =>
    bottom &&
    css`
      border-bottom-right-radius: 24px;
      border-bottom-left-radius: 24px;
      border-bottom-width: 0;
    `}
`

export const ButtonText = styled(Text)`
  font-weight: 500;
  font-size: 18px;
  color: #fff;
`

export const ExactTimeButton = styled(Link)`
  background-color: #333232;
  border-radius: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
`
