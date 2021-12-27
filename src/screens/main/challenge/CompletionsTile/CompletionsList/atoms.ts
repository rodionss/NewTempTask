import styled from 'styled-components/native'
import { Text } from '@components/main'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const ListWrapper = styled.View`
  flex: 1;
`

export const SectionHeader = styled.View`
  width: ${(width - 60) / 3}px;
  margin-left: 5px;
`

export const SectionHeaderTitle = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #919191;
  margin-bottom: 12px;
`
