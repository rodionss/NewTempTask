import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components'
import { assetList } from '../assets'
import { STATUS_BAR_HEIGHT } from '../utils'

const Container = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  align-items: center;
  justify-content: center;
  background-color: #00000099;
`
const ContentContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const Logo = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.logo,
})`
  width: 120px;
  height: 50px;
`

const LoadingText = styled.Text`
  font-size: 13px;
  color: #fff;
  margin-right: 20px;
`

const GlobalLoader = () => (
  <Container>
    <Logo />
    <ContentContainer>
      <LoadingText>Please wait</LoadingText>
      <ActivityIndicator />
    </ContentContainer>
  </Container>
)
export default GlobalLoader
