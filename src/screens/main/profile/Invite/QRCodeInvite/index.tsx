import React from 'react'
import { Title } from '@screens/main/profile/Invite/atoms'
import QRCode from 'react-native-qrcode-svg'
import { useSelector } from 'react-redux'
import { assetList } from '@assets/index'
import { getProfileInvites } from '@modules/auth'
import { BackIcon } from '@components/icons'
import { HeaderSize } from '@components/common/Header/atoms'
import { Header } from '@components/index'
import { useNavigation } from 'react-navigation-hooks'
import * as R from 'ramda'
import { withNavigationFocus } from 'react-navigation'
import { Invite } from '../types'
import { URLS } from '../../../../../const'
import {
  QRCodeWrapper,
  Step,
  StepText,
  QRCodeBorder,
  Wrapper,
  Container,
} from './atoms'

export const QR_CODE_SIZE = 200

function QRCodeInviteDumb() {
  const navigation = useNavigation()
  const invites = useSelector(getProfileInvites) as Invite[]

  return (
    <Container>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
        title='Invite via qr-code'
        size={HeaderSize.Main}
        rounded
      />
      <Wrapper>
        <Step>
          <StepText>1</StepText>
        </Step>
        <Title>Scan this QR-code to download the app</Title>
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
      </Wrapper>
      <Wrapper>
        <Step>
          <StepText>2</StepText>
        </Step>
        <Title>Scan this QR-code to be invited to Happyō</Title>
        <QRCodeWrapper>
          <QRCodeBorder />
          <QRCode value={invites[0].url} size={QR_CODE_SIZE} />
        </QRCodeWrapper>
      </Wrapper>
    </Container>
  )
}

const QRCodeInvite = R.compose(withNavigationFocus)(QRCodeInviteDumb)

export default QRCodeInvite
