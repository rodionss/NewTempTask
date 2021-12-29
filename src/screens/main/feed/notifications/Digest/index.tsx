import React from 'react'
import NotificationList from '@screens/main/feed/notifications/NotificationList'
import { PrimaryButton } from '@components/buttons'
import { assetList } from '@assets/index'
import BlurStyles from '@components/BlurStyles'
import LinearGradient from 'react-native-linear-gradient'
import {
  Wrapper,
  DigestWrapper,
  Title,
  NotificationListWrapper,
  RoundButton,
  CloseIcon,
  TextInfo,
  BackgroundImage,
  BackgroundView,
  ButtonMargin,
  NotificationContainer,
  NotificationImage,
  NotificationTouchable, BackgroundBlurImage,
} from './atoms'

type Props = {
  onSeeAllPress: () => void
  onClosePress: () => void
}

function Digest({ onSeeAllPress, onClosePress }: Props) {
  return (
    <>
      <NotificationContainer>
        <NotificationTouchable>
          <NotificationImage source={assetList.ringIcon} />
        </NotificationTouchable>
      </NotificationContainer>
      <BackgroundBlurImage source={assetList.backgroundBlur} />
      <Wrapper>
        <DigestWrapper>
          <BackgroundView
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={['rgba(31, 31, 31, 0)', 'rgba(31, 31, 31, 1)']}
          >
            <BackgroundImage source={assetList.backgroundImageDigest} />
          </BackgroundView>

          <Title>Digest</Title>
          <TextInfo>
            Digest of the latest notifications. It will appear when you see new
            subscribers, invites to games and tags
          </TextInfo>

          <ButtonMargin>
            <PrimaryButton full onPress={onSeeAllPress} text='Create' light />
          </ButtonMargin>
        </DigestWrapper>
      </Wrapper>
    </>
  )
}

export default Digest
