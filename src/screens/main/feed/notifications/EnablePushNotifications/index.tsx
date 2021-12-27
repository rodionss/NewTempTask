import React, { useEffect, useState } from 'react'
import { Notifications } from 'react-native-notifications'
import { useAnalytics } from '@utils/index'
import { PrimaryButton } from '@components/buttons'
import { assetList } from '@assets/index'
import {
  Wrapper,
  Content,
  Description,
  Message,
  Highlighted,
  CloseIcon,
  RoundButton,
} from './atoms'

export enum Appearance {
  Dark = 'dark',
  Light = 'light',
}

type Props = {
  appearance?: Appearance
}

function EnablePushNotifications({ appearance = Appearance.Dark }: Props) {
  const logEvent = useAnalytics('Activity screen seen', {}, true)
  const [showBanner, setShowBanner] = useState(false)
  const [forceHide, setForceHide] = useState(false)

  const onClosePress = () => {
    setForceHide(true)
    setShowBanner(false)
  }

  const handlePress = () => {
    Notifications.events().registerRemoteNotificationsRegistered(() => {
      logEvent('Push access granted')
      onClosePress()
    })
    Notifications.registerRemoteNotifications()
  }

  useEffect(() => {
    if (forceHide) {
      return
    }
    Notifications.isRegisteredForRemoteNotifications().then(
      (isRegistered: boolean) => {
        setShowBanner(!isRegistered)
      },
    )
  })

  return showBanner ? (
    <Wrapper appearance={appearance}>
      <Content>
        <Message>
          <Description>
            Enable <Highlighted>Push notifications</Highlighted>, so you
          </Description>
          <Description>won’t miss any news and games</Description>
        </Message>
        <PrimaryButton
          text='Enable'
          height={41}
          onPress={handlePress}
          size='small'
        />
      </Content>
      <RoundButton onPress={onClosePress}>
        <CloseIcon source={assetList.crossIcon} />
      </RoundButton>
    </Wrapper>
  ) : null
}

export default EnablePushNotifications
