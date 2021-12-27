import React from 'react'
import * as R from 'ramda'
import { Link, Text } from '@components/main'
import moment from 'moment'
import { Notification } from '@screens/main/feed/notifications/types'
import { AVATAR_SIZE } from '@screens/main/feed/notifications/NotificationList/Notification/index'
import Avatar from '@components/common/atoms/Avatar'
import { useNavigation } from 'react-navigation-hooks'
import {
  ChallengeLinkText,
  NotificationContainer,
  NotificationDate,
  NotificationText,
} from './atoms'

type Props = {
  notification: Notification
}

function Completions({ notification }: Props) {
  const navigation = useNavigation()
  const { meta, updated_at } = notification
  const { challenge } = meta

  const friends =
    meta && meta.friends && meta.friends.length
      ? meta.friends.map(R.prop('name'))
      : []

  return (
    <>
      <Avatar
        uri={challenge.id ? challenge.media.thumbnail_url : undefined}
        size={AVATAR_SIZE}
      />
      <NotificationContainer>
        <Link
          onPress={
            challenge.id
              ? () =>
                  navigation.push('ChallengeDetailed', {
                    direct: true,
                    challenge,
                  })
              : undefined
          }
        >
          {challenge.id ? (
            <Text>
              {meta.count > 0 ? (
                <ChallengeLinkText>
                  {friends.join(', ')} &amp; {meta.count}
                </ChallengeLinkText>
              ) : (
                <ChallengeLinkText>{friends.join(', ')}</ChallengeLinkText>
              )}
              <NotificationText>
                {meta.count > 0 ? ' more people' : ''} played your game
              </NotificationText>
              <ChallengeLinkText> {meta.challenge.title}</ChallengeLinkText>
              <NotificationDate>
                {' '}
                {moment(updated_at).fromNow()}
              </NotificationDate>
            </Text>
          ) : (
            <Text>
              <NotificationText>
                Game was <ChallengeLinkText>DELETED</ChallengeLinkText>
              </NotificationText>
            </Text>
          )}
        </Link>
      </NotificationContainer>
    </>
  )
}

export default Completions
