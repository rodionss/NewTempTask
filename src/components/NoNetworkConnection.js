import * as React from 'react'
import styled from 'styled-components'
import { STATUS_BAR_HEIGHT } from '../utils'

const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: ${STATUS_BAR_HEIGHT + 44}px;
  z-index: 999;
  background-color: #ed4337;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 16px;
`

const Error = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #fff;
`

const NoNetworkConnection = ({ text }) => (
  <Container>
    <Error>{text}</Error>
  </Container>
)

export default NoNetworkConnection
