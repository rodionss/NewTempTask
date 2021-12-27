import React from 'react'
import {
  Notification,
  NotificationType,
} from '@screens/main/feed/notifications/types'
import { Link } from '@components/main'
import { PrimaryButton, SecondaryButton } from '@components/buttons'
import Text from '@screens/main/feed/notifications/Text'
import { AVATAR_SIZE } from '@screens/main/feed/notifications/NotificationList/Notification/index'
import Avatar from '@components/common/atoms/Avatar'
import { useNavigation } from 'react-navigation-hooks'
import { ButtonsContainer, NotificationContainer } from './atoms'

type Props = {
  notification: Notification
  id: number
  onPressAccept: (notification: Notification) => void
  onPressDecline: (notification: Notification) => void
}

function FollowerRequest({
  notification,
  id,
  onPressAccept,
  onPressDecline,
}: Props) {
  const navigation = useNavigation()
  const { meta, type, updated_at } = notification

  let text = null
  let showButtons = false

  if (meta.followee_id) {
    return null
  }

  const user = meta.follower.id === id ? meta.followee : meta.follower
  if (type === NotificationType.Follower) {
    if (meta.follower.id === id) {
      text = (
        <Text
          name={user.name}
          text='You started following'
          date={updated_at}
          reverse
        />
      )
    } else {
      text = (
        <Text name={user.name} text='started following you' date={updated_at} />
      )
    }
  } else if (type === NotificationType.FollowingRequest) {
    if (meta.follower.id === id) {
      text = (
        <Text
          name={user.name}
          text='You requested to follow'
          date={updated_at}
          reverse
        />
      )
    } else {
      text = (
        <Text name={user.name} text='wishes to follow you' date={updated_at} />
      )
      showButtons = meta.request_state === 'requested'
    }
  }
  return (
    <>
      <Avatar uri={user.photo_url} size={AVATAR_SIZE} />
      <NotificationContainer>
        <Link
          onPress={() => {
            if (user.id) navigation.push('AlienProfile', { user })
          }}
        >
          {text}
        </Link>

        {showButtons ? (
          <ButtonsContainer>
            <PrimaryButton
              text='Accept'
              onPress={() => {
                onPressAccept(notification)
              }}
              size='small'
            />
            <SecondaryButton
              text='Decline'
              onPress={() => {
                onPressDecline(notification)
              }}
              size='small'
            />
          </ButtonsContainer>
        ) : null}
      </NotificationContainer>
    </>
  )
}

export default FollowerRequest
