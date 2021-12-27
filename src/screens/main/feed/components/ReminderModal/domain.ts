import moment from 'moment'
import { Challenge } from '@app-types/challenge'
import { Notifications } from 'react-native-notifications'

export enum RemindType {
  HourHalf = 30,
  Hour = 60,
  ThreeHours = 180,
  Custom = 0,
}

export function setReminder(
  challenge: Challenge,
  remindType: RemindType,
  remindTime: Date = null,
) {
  let fireDate = null
  if (remindType == RemindType.Custom) {
    fireDate = remindTime
  } else {
    fireDate = moment().add(remindType, 'minutes')
  }

  Notifications.postLocalNotification(
    {
      title: 'Time for Happyō!',
      body: `Your saved game ${challenge.title} expires soon, come to play it and feel happier! 😉`,
      fireDate: fireDate.toDate().toISOString(),
    },
    challenge.id,
  )
}
