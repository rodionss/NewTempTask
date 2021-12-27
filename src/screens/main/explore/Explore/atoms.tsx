import { OnboardingButton } from '@components/buttons'
import GameTileItem from '@components/GameTileItem'
import { BackIcon } from '@components/icons'
import { Link, Text } from '@components/main'
import { UserItem } from '@components/UserItem'
import React from 'react'
import {
  Dimensions,
  StyleProp,
  SwitchChangeEvent,
  ViewProps,
} from 'react-native'
import { Switch } from 'react-native-gesture-handler'
import { TAB_HEIGHT, THEME } from '../../../../const'
import styled from 'styled-components/native'

const { width } = Dimensions.get('window')

export const HorizontalList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 16 },
})`
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #3e3e3e;
`

export const GameList = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingTop: 16,
    paddingBottom: TAB_HEIGHT + 20,
  },
  columnWrapperStyle: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  numColumns: 2,
})`
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: ${THEME.secondaryBackgroundColor};
`

const TopicItemTouchableContainer = styled(Link)`
  width: ${width - 40}px;
  margin-left: 20px;
  margin-right: 20px;
  height: 175px;
  border-radius: 13px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const TopicImageContainer = styled.ImageBackground.attrs({
  imageStyle: { borderRadius: 12 },
})`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding-left: 14px;
  padding-bottom: 12px;
  justify-content: flex-end;
`

const TopicName = styled(Text)`
  font-weight: 900;
  font-size: 32px;
  line-height: 32px;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

type TopicProps = {
  title: string
  image: string
  onPress: () => void
}

export const Topic = ({ image, title, onPress }: TopicProps) => (
  <TopicItemTouchableContainer onPress={onPress}>
    <TopicImageContainer source={{ uri: image }}>
      <TopicName>{title}</TopicName>
    </TopicImageContainer>
  </TopicItemTouchableContainer>
)

const HeaderRowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 32px;
  padding-right: 20px;
  margin-top: 16px;
  margin-bottom: 16px;
`

const HeaderTitle = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  color: #ffffff;
`

const ButtonContainer = styled(Link)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const ButtonText = styled(Text)`
  font-weight: 800;
  font-size: 15px;
  text-transform: uppercase;
  color: #fafafa;
`

type HeaderProps = {
  title: string
  containerStyle?: StyleProp<ViewProps>
  button?: {
    text: string
    onPress: () => void
  }
}

export const BlockHeader = ({ title, button, containerStyle }: HeaderProps) => (
  <HeaderRowContainer style={containerStyle}>
    <HeaderTitle>{title}</HeaderTitle>
    {button ? (
      <ButtonContainer onPress={button.onPress}>
        <ButtonText>{button.text}</ButtonText>
        <BackIcon style={{ transform: [{ rotateY: '180deg' }] }} />
      </ButtonContainer>
    ) : null}
  </HeaderRowContainer>
)

const IntrestingContainer = styled.View`
  width: ${width - 40}px;
  padding: 12px;
  margin-left: 20px;
  margin-right: 20px;
  min-height: 320px;
  border-radius: 16px;
  background-color: #1b1d1d;
`

const IntrestingTitle = styled(Text)`
  color: #7d7d7d;
  font-weight: 600;
  font-size: 15px;
`

export const EmptyMessage = styled(Text)`
  padding-left: 16px;
`

type IntrestingProps = {
  title: string
  users: any[]
  emptyMessage?: string
  onPress: (user: any) => void
  onPressButton: (user: any) => void
}

export const IntrestingPeopleList = ({
  title,
  onPress,
  users = [],
  onPressButton,
  emptyMessage,
}: IntrestingProps) => (
  <IntrestingContainer>
    <IntrestingTitle>{title}</IntrestingTitle>
    {users.length ? (
      users.map((user: any, index: number) => {
        const follow = user.user_stats.follow_state === 'none'
        return (
          <UserItem
            key={'user' + index}
            user={user}
            onPress={() => onPress(user)}
            button={{
              primary: follow,
              text: follow ? 'Follow' : 'Unfollow',
              onPress: () => onPressButton({ ...user, index, follow }),
            }}
          />
        )
      })
    ) : (
      <EmptyMessage style={{ paddingLeft: 0, marginTop: 12 }}>
        {emptyMessage}
      </EmptyMessage>
    )}
  </IntrestingContainer>
)

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: center;
`

const Dot = styled.View<{ active: boolean }>`
  width: ${({ active }) => (active ? 12 : 8)}px;
  height: ${({ active }) => (active ? 12 : 8)}px;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
  background-color: ${({ active }) => (active ? '#FAFAFA' : '#FAFAFAAA')};
`

type DotsProps = {
  count: number
  activeIndex: number
}

export const Dots = ({ count, activeIndex }: DotsProps) => (
  <RowContainer>
    {new Array(count).fill(0).map((_, i) => (
      <Dot key={'dot' + i} active={i === activeIndex} />
    ))}
  </RowContainer>
)

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: #3e3e3e;
`

const NotifyContainer = styled.View`
  border-radius: 12px;
  padding: 12px;
  align-self: center;
  width: 90%;
  margin-bottom: 44px;
  background-color: #1b1d1d;
`

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`
const DescriptionNotify = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  color: #7d7d7d;
`

type NotifyProps = {
  value: boolean
  onChange: (value: SwitchChangeEvent) => void
}

export const NotifyMe = ({ value, onChange }: NotifyProps) => (
  <NotifyContainer>
    <HeaderTitle>{'Subject categories\ncoming soon'}</HeaderTitle>
    <Row>
      <DescriptionNotify>{'Let me know about the release'}</DescriptionNotify>
      <Switch
        value={value}
        onChange={onChange}
        style={{ marginLeft: 'auto' }}
      />
    </Row>
  </NotifyContainer>
)
