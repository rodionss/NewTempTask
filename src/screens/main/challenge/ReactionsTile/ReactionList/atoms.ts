import styled, { css } from 'styled-components/native'
import { Link, Text } from '@components/main'
import { Wrapper } from '@screens/CameraRollPicker/atoms'
import { THEME } from '../../../../../const'

type ActivityView = {
  activity?: boolean
}

export const ReactionsContainer = styled.ScrollView<ActivityView>`
  padding: 20px 15px;
  background-color: ${THEME.navBarBackground};
  max-height: 100px;
  border-bottom-right-radius: 35px;
  border-bottom-left-radius: 35px;

  ${({ activity }: ActivityView) =>
    activity &&
    css`
      padding: 20px 5px 0 5px;
      background-color: transparent;
      max-height: 90px;
    `}
`

type Props = {
  selected: boolean
}

export const ReactionsButton = styled(Link)<Props>`
  width: 56px;
  height: 56px;
  border: 2px solid #1f1e1e;
  background-color: #1f1e1e;
  margin-right: 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ selected }: Props) =>
    selected &&
    css`
      border-color: #fff;
    `}
`

export const ReactionsButtonContent = styled.View`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Counter = styled(Text)`
  font-size: 12px;
  color: rgba(250, 250, 250, 0.6);
`

export const Label = styled(Text)`
  font-size: 12px;
  color: rgba(250, 250, 250, 0.6);
  font-weight: bold;
`

export const StyledWrapper = styled(Wrapper)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

export const List = styled.FlatList<ActivityView>`
  padding: ${({ activity }: ActivityView) => (activity ? '10px 0' : '20px')};
`

export const EmptyStateWrapper = styled.View<ActivityView>`
  border-radius: 1px;
  padding: ${({ activity }: ActivityView) => (activity ? '10px' : '20px')};
  border-color: red;
  border-style: solid;
  display: flex;
  height: 80%;
  align-items: center;
  justify-content: center;
`
