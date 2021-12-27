import React from 'react'
import styled from 'styled-components'
import { SuccessIcon, WarningIcon } from '../../../components/icons'
import { Text } from '../../../components/main'

const Container = styled.View`
  width: 100%;
  height: 32px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`

const GetInviteText = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 24px;
  color: #ffffff;
`

const GetInviteStatus = ({ text, status, containerStyle }) => (
  <Container style={containerStyle}>
    {status === 'warn' ? (
      <WarningIcon style={{ marginRight: 8 }} />
    ) : (
      <SuccessIcon style={{ marginRight: 8 }} />
    )}
    <GetInviteText style={{ fontWeight: status === 'warn' ? '400' : '600' }}>
      {text}
    </GetInviteText>
    <GetInviteText style={{}}>{' • Get 1 invite'}</GetInviteText>
  </Container>
)

export default GetInviteStatus
