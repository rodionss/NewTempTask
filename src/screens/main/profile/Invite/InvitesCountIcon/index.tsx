import React from 'react'
import { Wrapper, InvitesCount, InvitesCountText, InviteIcon } from './atoms'

type Props = {
  invitesCount: number
  large?: boolean
}

function InvitesCountIcon({ invitesCount, large }: Props) {
  return (
    <Wrapper>
      <InviteIcon large={large} />
      <InvitesCount large={large}>
        <InvitesCountText large={large}>{invitesCount}</InvitesCountText>
      </InvitesCount>
    </Wrapper>
  )
}

export default InvitesCountIcon
