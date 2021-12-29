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
  NotificationTouchable,
  ActivityWrapper,
  BackgroundPeopleImage,
  BackgroundSmileImage,
  ImageWrapper,
} from './atoms'

type Props = {
  onClosePress: () => void
}

function ActivityInformation({ onClosePress }: Props) {
  return (
    <ActivityWrapper>
      <ImageWrapper>
        <BackgroundPeopleImage source={assetList.activityPeople} />
        <BackgroundSmileImage source={assetList.activitySmile} />
      </ImageWrapper>
      <Title>Activity</Title>
      <TextInfo>Check the growing popularity of all your games!</TextInfo>

      <ButtonMargin>
        <PrimaryButton full onPress={onClosePress} text='OKEY' light />
      </ButtonMargin>
    </ActivityWrapper>
  )
}

export default ActivityInformation
