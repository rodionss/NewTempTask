import React from 'react'
import { Text as Wrapper } from '@components/main'
import {
  ChallengeLinkText,
  NotificationDate,
  NotificationText,
} from '@screens/main/feed/notifications/NotificationList/Notification/atoms'
import moment from 'moment'

type Props = {
  name: string
  text: string
  date: string
  reverse?: boolean
}

function Text({ name, text, date, reverse = false }: Props) {
  return (
    <Wrapper>
      {reverse ? (
        <>
          <NotificationText>{text}</NotificationText>
          <ChallengeLinkText> {name}</ChallengeLinkText>
        </>
      ) : (
        <>
          <ChallengeLinkText>{name}</ChallengeLinkText>
          <NotificationText> {text}</NotificationText>
        </>
      )}
      <NotificationDate> {moment(date).fromNow()}</NotificationDate>
    </Wrapper>
  )
}

export default Text
