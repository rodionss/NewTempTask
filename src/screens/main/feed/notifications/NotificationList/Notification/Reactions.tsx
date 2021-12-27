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

function Reactions({ notification }: Props) {
  const navigation = useNavigation()
  const { meta, updated_at } = notification
  const { challenge, participant } = meta

  const friends =
    meta && meta.friends && meta.friends.length
      ? meta.friends.map(R.prop('name'))
      : []

  const hasFriends = friends.count > 0
  const hasOther = meta.count - friends.count > 0

  return (
    <>
      <Avatar
        uri={participant.id ? participant.media.thumbnail_url : undefined}
        size={AVATAR_SIZE}
      />
      <NotificationContainer>
        <Link
          onPress={
            challenge.id
              ? () =>
                  navigation.push('ReactionsTile', {
                    challenge,
                    completion: participant,
                  })
              : undefined
          }
        >
          {challenge.id ? (
            <Text>
              {hasFriends ? (
                hasOther ? (
                  <>
                    <ChallengeLinkText>
                      {friends.join(', ')} &amp; {meta.count}
                    </ChallengeLinkText>
                    <NotificationText>
                      {' other people reacted to your completion at'}
                    </NotificationText>
                  </>
                ) : (
                  <>
                    <ChallengeLinkText>{friends.join(', ')}</ChallengeLinkText>
                    <NotificationText>
                      {' reacted to your completion at'}
                    </NotificationText>
                  </>
                )
              ) : (
                <>
                  <ChallengeLinkText>{meta.count}</ChallengeLinkText>
                  <NotificationText>
                    {' people reacted to your completion at'}
                  </NotificationText>
                </>
              )}

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

export default Reactions
