import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { Link, Text } from '@components/main'

export const ModalContent = styled.View`
  width: ${Dimensions.get('window').width}px;
  margin-top: auto;
  padding: 8px 20px 0 20px;
  align-items: center;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: #111313;
  z-index: 9999;
`

export const Header = styled(Text)`
  font-weight: 700;
  font-size: 20px;
  color: #fff;
  width: 100%;
  text-align: center;
  margin: 24px 0;
`

export const ButtonContainer = styled.View`
  width: 80%;
  margin-top: 32px;
  margin-bottom: 44px;
  flex-direction: column;
`

export const CancelButton = styled(Link)`
  margin: 0 0 40px 0;
`

export const CancelText = styled(Text)`
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  color: #fff;
  opacity: 0.6;
  margin: 0;
`
