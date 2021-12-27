import styled from 'styled-components/native'
import { Link, Text } from '@components/main'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const Container = styled.View`
  display: flex;
  width: ${(width - 60) / 3}px;
  align-items: center;
  margin: 0 5px 0 5px;
`

export const InviteButton = styled(Link)`
  width: ${(width - 60) / 3 - 4}px;
  padding: 0;
  height: ${(((width - 60) / 3) * 41) / 21}px;
  border: 2px dashed #919191;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Icon = styled.Image`
  width: 24px;
  height: 24px;
`

export const Label = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  color: #919191;
`
