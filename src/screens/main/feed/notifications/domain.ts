import {
  Challenge,
  Notification,
  NotificationsResponse,
  NotificationType,
  Pagination,
} from '@screens/main/feed/notifications/types'
import * as Manager from '@modules/main/managers'
import * as Repo from '@modules/main/repository'
import { setAppIconBadgeNumber } from '@utils/functions'
import * as R from 'ramda'
import { handleErrors } from '../../../../aspects'

export function load(
  token: string,
  notifications: Notification[],
  setRefreshing: (refreshing: boolean) => void,
  setNotifications: (notifications: Notification[]) => void,
  setLastNotificationId: (id: number) => void,
  setPagination: (pagination: Pagination) => void,
  page = 1,
) {
  Manager.getNotifications(token, page)
    .then((response: NotificationsResponse) => {
      setRefreshing(false)
      if (page === 1) {
        setNotifications(response.notifications)
        if (response.notifications.length) {
          Repo.setLastNotificationId(response.notifications[0].id)
          setLastNotificationId(response.notifications[0].id)
          setAppIconBadgeNumber(0)
        }
      } else {
        setNotifications([...notifications, ...response.notifications])
      }
      setPagination({ hasMore: response.has_more, page: response.page })
    })
    .catch(handleErrors)
}

export function decline(
  notification: Notification,
  token: string,
  removeNotification: (notification: Notification) => void,
) {
  removeNotification(notification)

  const {
    type,
    meta: { follower, challenge },
  } = notification

  if (type === NotificationType.FollowingRequest)
    Manager.declineFollower(token, follower.id).catch(handleErrors)
  else if ([NotificationType.Invite, NotificationType.Tag].includes(type)) {
    Manager.declineChallenge(token, challenge.id).catch(handleErrors)
  }
}

export function accept(
  notification: Notification,
  token: string,
  removeNotification: (notification: Notification) => void,
  navigateChallengeDetailed: (challenge: Challenge, direct?: boolean) => void,
) {
  removeNotification(notification)

  const {
    type,
    meta: { follower, challenge },
  } = notification

  if (type === NotificationType.FollowingRequest) {
    Manager.acceptFollower(token, follower.id).catch(handleErrors)
  } else if (type === NotificationType.Tag) {
    Manager.tagConfirm(token, challenge.id).catch(handleErrors)
  } else if (type === NotificationType.Invite) {
    navigateChallengeDetailed(challenge)
  }
}

export function remove(
  notification: Notification,
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
) {
  const updatedNotification = {
    ...notification,
    meta: { ...notification.meta, request_state: 'declined' },
  }

  const index = R.findIndex(
    (currentNotification: Notification) =>
      currentNotification.id === notification.id,
  )(notifications)

  const updatedNotifications = R.update(
    index,
    updatedNotification,
    notifications,
  )
  setNotifications(updatedNotifications)
}
