import { Text } from '@components/main'
import { Image } from 'react-native'
import styled from 'styled-components/native'

export const Wrapper = styled.View`
  flex-direction: row;
  padding: 24px 20px;
  justify-content: space-around;
  width: 100%;
`

export const Line = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const LineText = styled(Text)`
  color: #919191;
  font-size: 15px;
  font-weight: 500;
`

export const Icon = styled(Image)`
  border-radius: 4px;
  width: 22px;
  height: 22px;
  margin-right: 6px;
`
