import { Notifications } from 'react-native-notifications'
import { useAnalytics } from '@utils/functions'
import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import { connect, useSelector } from 'react-redux'
import styled from 'styled-components'
import { assetList } from '../../assets'
import { Header } from '../../components'
import { OnboardingButton } from '../../components/buttons'
import { BackIcon } from '../../components/icons'
import { Text } from '../../components/main'
import { THEME, URLS } from '../../const'
import { addToRegistrationQueue, getProfilePhoneForm } from '../../modules/auth'
import { getApnToken } from '../../modules/auth/repository'

const Container = styled.View`
  flex: 1;
  background-color: #000;
`

const ScrollContainer = styled.View.attrs({
  bounces: false,
  contentContainerStyle: {
    paddingTop: 24,
    paddingBottom: 24,
  },
})`
  flex: 1;
  border-top-left-radius: 34px;
  padding-top: 24px;

  border-top-right-radius: 34px;
  background-color: ${THEME.secondaryBackgroundColor};
  padding: 24px 20px;
`
const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  color: #fafafa;
  line-height: 26px;
`

const InfoText = styled(Text)`
  margin-top: 16px;
  font-size: 16px;
  line-height: 25px;
  color: #fafafa;
  opacity: 0.6;
`

const SocialContainer = styled.View`
  align-items: center;
  margin-top: auto;
  padding-bottom: 72px;
`
const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`

const SocialButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  margin: 0 6px;
`

const SocialImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 60px;
  height: 60px;
`

const ButtonContainer = styled.View`
  margin-top: 24px;
`

const NotificationRegistrationDumb = ({
  navigation,
  addToRegistrationQueue,
}) => {
  const logEvent = useAnalytics()
  const [acceptPermission, setAccepted] = useState(false)
  const phone = useSelector(getProfilePhoneForm)

  useEffect(() => {
    Notifications.isRegisteredForRemoteNotifications().then((hasPermission) => {
      const isAccepted = !!hasPermission
      setAccepted(isAccepted)
      if (isAccepted) {
        logEvent('Notification permission', {
          enable: isAccepted,
          screen: 'registration',
        })
        getApnToken().then((apnToken) => {
          addToRegistrationQueue({ phone, apnToken })
        })
      }
    })

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      addToRegistrationQueue({ phone, apnToken: event.deviceToken })
    })
  }, [])

  const onPressInformMe = useCallback(() => {
    Notifications.registerRemoteNotifications()
  })

  return (
    <Container>
      <Header
        leftButton={{
          icon: BackIcon,
          onPress: () => navigation.goBack(),
        }}
        title={'Waiting list'}
      />
      <ScrollContainer>
        <Title>{'What’s next?'}</Title>

        <InfoText>
          {'You are on the waiting list. We can inform you, when your code is ready.\n\n' +
            'Just push the button below and give us your permission'}
        </InfoText>
        <ButtonContainer>
          <OnboardingButton
            text={acceptPermission ? 'Got it! We’ll be back soon' : 'INFORM ME'}
            light={!acceptPermission}
            disabled={acceptPermission}
            onPress={onPressInformMe}
          />
        </ButtonContainer>
        <SocialContainer>
          <InfoText>Our social media</InfoText>
          <RowContainer>
            <SocialButton
              onPress={() => {
                logEvent('Press on social network', { network: 'instagram' })
                Linking.openURL(URLS.instagram)
              }}
            >
              <SocialImage source={assetList.instagram} />
            </SocialButton>
            <SocialButton
              onPress={() => {
                logEvent('Press on social network', { network: 'facebook' })
                Linking.openURL(URLS.facebook)
              }}
            >
              <SocialImage source={assetList.facebook} />
            </SocialButton>
          </RowContainer>
        </SocialContainer>
      </ScrollContainer>
    </Container>
  )
}

const NotificationRegistration = R.compose(
  connect(undefined, { addToRegistrationQueue }),
)(NotificationRegistrationDumb)

export default NotificationRegistration
