import React from 'react'
import NotificationList from '@screens/main/feed/notifications/NotificationList'
import { PrimaryButton } from '@components/buttons'
import { assetList } from '@assets/index'
import EnablePushNotifications from '@screens/main/feed/notifications/EnablePushNotifications'
import {
  Wrapper,
  DigestWrapper,
  Title,
  NotificationListWrapper,
  RoundButton,
  CloseIcon,
} from './atoms'

type Props = {
  onSeeAllPress: () => void
  onClosePress: () => void
}

function Digest({ onSeeAllPress, onClosePress }: Props) {
  return (
    <Wrapper>
      <EnablePushNotifications />

      <DigestWrapper>
        <Title>Your latest notifications</Title>
        <NotificationListWrapper>
          <NotificationList digest />
        </NotificationListWrapper>
        <PrimaryButton full onPress={onSeeAllPress} text='SEE ALL' light />
      </DigestWrapper>
      <RoundButton onPress={onClosePress}>
        <CloseIcon source={assetList.crossIcon} />
      </RoundButton>
    </Wrapper>
  )
}

export default Digest
