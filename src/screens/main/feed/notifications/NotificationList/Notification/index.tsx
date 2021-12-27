import React from 'react'
import {
  NotificationType,
  Notification,
} from '@screens/main/feed/notifications/types'
import { UserItem } from '@screens/main/feed/notifications/NotificationList/Notification/atoms'
import Completions from './Completions'
import Reactions from './Reactions'
import ChallengeRequest from './ChallengeRequest'
import FollowerRequest from './FollowerRequest'

export const AVATAR_SIZE = 44

type Props = {
  item: Notification
  id: number
  onPressAccept: (notification: Notification) => void
  onPressDecline: (notification: Notification) => void
}

function NotificationItem({ item, id, onPressAccept, onPressDecline }: Props) {
  const { type } = item

  let notificationItem = null

  if ([NotificationType.Tag, NotificationType.Invite].includes(type)) {
    notificationItem = (
      <ChallengeRequest
        notification={item}
        onPressAccept={onPressAccept}
        onPressDecline={onPressDecline}
      />
    )
  } else if (
    [NotificationType.Follower, NotificationType.FollowingRequest].includes(
      item.type,
    )
  ) {
    notificationItem = (
      <FollowerRequest
        notification={item}
        id={id}
        onPressAccept={onPressAccept}
        onPressDecline={onPressDecline}
      />
    )
  } else if ([NotificationType.Completions].includes(type)) {
    notificationItem = <Completions notification={item} />
  } else if ([NotificationType.Reactions].includes(type)) {
    notificationItem = <Reactions notification={item} />
  }

  return <UserItem>{notificationItem}</UserItem>
}

export default NotificationItem
