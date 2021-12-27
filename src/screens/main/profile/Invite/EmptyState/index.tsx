import React from 'react'
import {
  QRCodeBorder,
  QRCodeWrapper,
  Wrapper,
} from '@screens/main/profile/Invite/QRCodeInvite/atoms'
import InvitesCountIcon from '@screens/main/profile/Invite/InvitesCountIcon'
import { Title } from '@screens/main/profile/Invite/atoms'
import QRCode from 'react-native-qrcode-svg'
import { assetList } from '@assets/index'
import { useSelector } from 'react-redux'
import { getProfileInvites } from '@modules/auth'
import { Invite } from '@screens/main/profile/Invite/types'
import { QR_CODE_SIZE } from '@screens/main/profile/Invite/QRCodeInvite'
import { URLS } from '../../../../../const'
import { Container, Heading } from './atoms'

function EmptyState() {
  const invites = useSelector(getProfileInvites) as Invite[]

  return (
    <Container>
      <Wrapper style={{ marginTop: 0, marginBottom: 40 }}>
        <InvitesCountIcon invitesCount={invites.length} large />
        <Heading>You don’t have invites</Heading>
        <Title centered>
          {`You can't invite via link, QR-code or from \nContact list`}
        </Title>
      </Wrapper>
      <Wrapper>
        <QRCodeWrapper>
          <QRCodeBorder />
          <QRCode
            value={URLS.appStore}
            size={QR_CODE_SIZE}
            logo={assetList.appLogo}
            logoSize={40}
            logoBackgroundColor='rgba(17, 19, 19, 0.7)'
            logoMargin={80}
          />
        </QRCodeWrapper>
        <Title style={{ marginTop: 25 }}>
          This QR-code is for downloading the app
        </Title>
      </Wrapper>
    </Container>
  )
}

export default EmptyState
