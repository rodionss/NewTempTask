import { Text } from '@components/main'
import styled from 'styled-components/native'
import { THEME } from '../../../const'

export const TabsContainer = styled.View.attrs({
  horizontal: true,
  contentContainerStyle: {
    paddingHorizontal: 8,
  },
})`
  margin-top: 16px;
  height: 40px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${THEME.separatorColor};
`

export const Button = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  margin-right: 8px;
  align-items: center;
`

export const Label = styled(Text)<{ active: boolean }>`
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: ${({ active }) => (active ? '#fff' : '#eee')};
`

export const Indicator = styled.View`
  width: 100%;
  height: 2px;
  background-color: #fff;
`
