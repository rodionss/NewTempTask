import styled, { css } from 'styled-components/native'
import { Link, Text } from '@components/main'

type Props = {
  selected?: boolean
}

export const Wrapper = styled.View`
  width: 100%;
  padding: 12px;
  background-color: rgba(27, 29, 29, 0.95);
  border-radius: 24px;
  margin-bottom: 24px;
`

export const DayPickerWrapper = styled.View`
  width: 100%;
  background-color: #111313;
  height: 44px;
  padding: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 24px;
`

export const DayPickerButton = styled(Link)<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-radius: 18px;
  background-color: ${({ selected }: Props) =>
    selected ? '#333232' : '#111313'};
`

export const DayPickerButtonText = styled(Text)<Props>`
  color: #fff;
  ${({ selected }: Props) =>
    !selected &&
    css`
      opacity: 0.6;
    `}
`

export const RemindButton = styled(Link)`
  width: 100%;
  background-color: #333232;
  border-radius: 24px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const RemindButtonText = styled(Text)`
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  text-transform: uppercase;
`
