import React from 'react'
import { CloseIcon } from '@screens/main/feed/notifications/EnablePushNotifications/atoms'
import { assetList } from '@assets/index'
import { PrimaryButton } from '@components/buttons'
import { Notifications } from 'react-native-notifications'
import { useAnalytics } from '@utils/functions'
import {
  Wrapper,
  RoundButton,
  Title,
  ItemsWrapper,
  Icon,
  ItemTitle,
  Description,
  RightSide,
  Item,
  SmallText,
  Container,
} from './atoms'

type Props = {
  onClosePress: () => void
}

type Data = {
  icon: any
  title: string
  description: string
}

const data: Data[] = [
  {
    icon: assetList.completionsIconTutorial,
    title: 'Completions',
    description: "You're so inspiring! See\ncompletions inspired by you",
  },
  {
    icon: assetList.reactionsIconTutorial,
    title: 'Reactions',
    description: 'Get updates about reactions to\nyour games',
  },
  {
    icon: assetList.newFollowersIconTutorial,
    title: 'New followers',
    description: 'Learn who has started following\nyou',
  },
  {
    icon: assetList.yourFriendsIconTutorial,
    title: 'Your friends',
    description: "We'll let you know if your contacts\njoin Happyō",
  },
]

function EnableNotifications({ onClosePress }: Props) {
  const logEvent = useAnalytics()

  const handlePress = () => {
    Notifications.events().registerRemoteNotificationsRegistered(() => {
      logEvent('Push access granted')
      onClosePress()
    })
    Notifications.registerRemoteNotifications()
  }

  return (
    <Container>
      <Wrapper>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Title>Don't miss</Title>
        <ItemsWrapper>
          {data.map(({ icon, title, description }) => (
            <Item>
              <Icon source={icon} />
              <RightSide>
                <ItemTitle>{title}</ItemTitle>
                <Description>{description}</Description>
              </RightSide>
            </Item>
          ))}
        </ItemsWrapper>
        <PrimaryButton
          text='Enable notifications'
          height={56}
          onPress={handlePress}
          containerStyle={{ borderRadius: 24 }}
          size='small'
        />
        <SmallText>
          We promise to send only useful notifications. But if you get bored –
          just turn them off ^_^
        </SmallText>

        <RoundButton onPress={onClosePress}>
          <CloseIcon source={assetList.crossIcon} />
        </RoundButton>
      </Wrapper>
    </Container>
  )
}

export default EnableNotifications
