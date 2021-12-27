import React, { useState } from 'react'
import FeedInviteModal from '@screens/main/feed/components/FeedInviteModal'
import { Challenge } from '@app-types/challenge'
import { assetList } from '../../../../../assets'
import { Container, Label, InviteButton, Icon } from './atoms'

type Props = {
  challenge: Challenge
}

function InviteFriend({ challenge }: Props) {
  const [inviteModalShown, setInviteModalShown] = useState(false)

  return (
    <Container>
      <InviteButton onPress={() => setInviteModalShown(true)}>
        <Icon source={assetList.inviteFriend} />
      </InviteButton>
      <Label>Invite friend</Label>
      <FeedInviteModal
        isVisible={inviteModalShown}
        challenge={challenge}
        onPressClose={() => setInviteModalShown(false)}
      />
    </Container>
  )
}

export default InviteFriend
