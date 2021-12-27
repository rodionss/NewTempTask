import Avatar from '@components/common/atoms/Avatar'
import React from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import { OnboardingButton } from '../buttons'
import { ContactListIcon } from '../icons'
import { Text } from '../main'

export const EmptyMessage = styled(Text)`
  padding-left: 16px;
`
const FriendItemContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: 162px;
  height: 280px;
  border-radius: 20px;
  margin-left: 8px;
  margin-right: 8px;
  background-color: #1b1d1d;
`

const AvatarFriend = styled(FastImage)`
  width: 100%;
  height: 162px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`

const FriendContentContainer = styled.View`
  padding: 0 12px;
  margin-top: auto;
  margin-bottom: 12px;
`
const UsernameFriend = styled(Text)`
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  color: #ffffff;
  margin-top: 12px;
  text-transform: lowercase;
`

const MutualFriends = styled(Text)`
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 12px;
  line-height: 18px;
  color: rgba(250, 250, 250, 0.6);
`

const AvatarContainer = styled.View`
  margin-top: 16px;
  border-radius: 30px;
  align-self: center;
  justify-content: center;
  align-items: center;
`

const AvatarFallback = styled(Text)`
  color: #fff;
  font-size: 32px;
  text-transform: uppercase;
`

type PosibleFriendProps = {
  item: any
  onPress: () => void
  button: {
    text: string
    light: boolean
    onPress: () => void
  }
}

export const PosibleFriendItem = ({
  item = {},
  onPress,
  button,
}: PosibleFriendProps) => (
  <FriendItemContainer onPress={onPress}>
    <AvatarContainer>
      <Avatar size={144} uri={item.photo_url} />
    </AvatarContainer>
    <FriendContentContainer>
      <UsernameFriend>{item.username}</UsernameFriend>
      <MutualFriends>{/** 3 mutual friends */}</MutualFriends>
      <OnboardingButton
        text={button.text}
        onPress={button.onPress}
        light={button.light}
        loading={false}
        containerStyle={{ height: 40 }}
      />
    </FriendContentContainer>
  </FriendItemContainer>
)

const IconContainer = styled.View`
  height: 72px;
  width: 72px;
  border-radius: 28px;
  margin-top: 40px;
  margin-bottom: 16px;
  align-self: center;
  align-items: center;
  justify-content: center;
  background-color: #333232;
`

const ContactsTitle = styled(UsernameFriend)`
  text-transform: none;
`

export const ContactsItem = ({ onPress }: { onPress: () => void }) => (
  <FriendItemContainer>
    <IconContainer>
      <ContactListIcon />
    </IconContainer>
    <FriendContentContainer>
      <ContactsTitle>{'Find more friends'}</ContactsTitle>
      <MutualFriends>
        {'Turn on sync\nfor contacts for better recommendations'}
      </MutualFriends>
      <OnboardingButton
        text={'Enable'}
        onPress={onPress}
        light={true}
        loading={false}
        containerStyle={{ height: 40 }}
      />
    </FriendContentContainer>
  </FriendItemContainer>
)
