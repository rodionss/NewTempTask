import moment from 'moment'
import { Notification, NotificationGroup } from './types'

function groupNotifications(notifications: Notification[]) {
  const day: Notification[] = []
  const week: Notification[] = []
  const earlier: Notification[] = []
  const groups: NotificationGroup[] = []

  const today = moment()

  if (!notifications) {
    return []
  }

  notifications.forEach((notification) => {
    const date = moment(notification.updated_at)

    if (date.isSame(today, 'day')) {
      day.push(notification)
    } else if (date.isSame(today, 'week')) {
      week.push(notification)
    } else {
      earlier.push(notification)
    }
  })

  if (day.length) groups.push({ section: 'Day', data: day })
  if (week.length) groups.push({ section: 'Week', data: week })
  if (earlier.length) groups.push({ section: 'Earlier', data: earlier })

  return groups
}

export default groupNotifications
