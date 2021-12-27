import styled from 'styled-components/native'
import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export const Header = styled.View`
  width: ${width};
`
