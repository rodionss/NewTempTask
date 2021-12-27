import styled from 'styled-components/native'
import { Text } from '@components/main'
import { THEME } from '../../../../../const'

type Props = {
  error?: boolean
}

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})<Props>`
  width: 100%;
  height: 86px;
  margin-top: 12px;
  z-index: 99;
  padding: 8px 20px;
  border-radius: 24px;
  flex-direction: column;
  background-color: #333232;
  align-items: center;
  border: 1px solid ${({ error }: Props) => (error ? 'red' : '#333232')};
`

export const MultilineInput = styled.TextInput`
  width: 100%;
  font-size: 15px;
  font-weight: 800;
  background-color: #333232;
  color: ${THEME.formFieldValueColor};
  text-transform: uppercase;
  font-family: ${THEME.textFont};
  text-align: center;
  margin-bottom: 5px;
  max-width: 100%;
`

export const LengthRestriction = styled(Text)<Props>`
  font-size: 10px;
  font-weight: 400;
  color: ${({ error }: Props) => (error ? 'red' : '#fff')};
  margin-bottom: 8px;
`
