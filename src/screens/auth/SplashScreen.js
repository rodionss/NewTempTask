import React from 'react'
import styled from 'styled-components'
import { assetList } from '../../assets'
import { THEME } from '../../const'

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${THEME.primaryBackgroundColor};
`

const Logo = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.logoSlogan,
})`
  position: absolute;
  width: 295px;
  height: 135px;
`

const SplashScreen = () => (
  <Container>
    <Logo />
  </Container>
)

export default SplashScreen
