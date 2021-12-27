import React from 'react'
import { Link, Text } from '@components/main'
import {
  Notification,
  NotificationType,
} from '@screens/main/feed/notifications/types'
import moment from 'moment'
import { PrimaryButton, SecondaryButton } from '@components/buttons'
import { useNavigation } from 'react-navigation-hooks'
import Avatar from '@components/common/atoms/Avatar'
import { AVATAR_SIZE } from '@screens/main/feed/notifications/NotificationList/Notification'
import {
  ButtonsContainer,
  ChallengeLinkText,
  NotificationContainer,
  NotificationDate,
  NotificationText,
} from './atoms'

type Props = {
  notification: Notification
  onPressAccept: (notification: Notification) => void
  onPressDecline: (notification: Notification) => void
}

function ChallengeRequest({
  notification,
  onPressAccept,
  onPressDecline,
}: Props) {
  const navigation = useNavigation()
  const { meta, type, updated_at } = notification

  const showButtons =
    meta.challenge.id &&
    !meta.challenge.is_finished &&
    meta.request_state === 'requested'

  const user = meta.inviter
    ? meta.inviter
    : meta.challenge && meta.challenge.user

  return (
    <>
      <Avatar uri={user.photo_url} size={AVATAR_SIZE} />
      <NotificationContainer>
        <Link
          onPress={() => {
            if (meta.challenge.id) {
              navigation.push('ChallengeDetailed', {
                direct: true,
                challenge: meta.challenge,
              })
            }
          }}
        >
          <Text>
            <ChallengeLinkText>{meta.inviter.name}</ChallengeLinkText>
            <NotificationText>
              {type === NotificationType.Tag
                ? ' tagged you in game'
                : ' invited you to game'}
            </NotificationText>
            <ChallengeLinkText>
              {' '}
              {meta.challenge.id ? meta.challenge.title : 'DELETED'}
            </ChallengeLinkText>
            <NotificationDate> {moment(updated_at).fromNow()}</NotificationDate>
          </Text>
        </Link>

        {showButtons ? (
          <ButtonsContainer>
            <PrimaryButton
              text={
                [NotificationType.Invite, NotificationType.Tag].includes(type)
                  ? 'Accept'
                  : 'View'
              }
              height={41}
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

export default ChallengeRequest
