import React from 'react'
import styled from 'styled-components'

import { Text } from '../components/main'
import { THEME } from '../const'

const Container = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
`

const EmptyText = styled(Text)`
  margin: 10px 10px 10px 10px;
  font-size: 16px;
  text-align: center;
  width: 90%;
  align-self: center;
`

const EmptyState = ({ text, children }) => (
  <Container>{text ? <EmptyText>{text}</EmptyText> : children}</Container>
)

export default EmptyState
