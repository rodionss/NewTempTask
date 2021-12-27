import React from 'react'
import styled from 'styled-components'
import { THEME } from '../../const'

export const Container = styled.View`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
`

const Empty = () => {
  return <Container></Container>
}

export default Empty
