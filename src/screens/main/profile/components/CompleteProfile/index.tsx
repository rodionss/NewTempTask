import React, { useMemo } from 'react'
import { CloseIcon } from '@screens/main/feed/notifications/EnablePushNotifications/atoms'
import { assetList } from '@assets/index'
import { PrimaryButton } from '@components/buttons'
import { useSelector } from 'react-redux'
import { getProfile } from '@modules/auth'
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
  Container,
} from '@screens/main/feed/notifications/EnableNotifications/atoms'

type Props = {
  avatarError?: boolean
  onClosePress: () => void
  onEditPress: () => void
}

type Data = {
  icon: any
  title: string
  description: string
}

function CompleteProfile({ avatarError, onClosePress, onEditPress }: Props) {
  const profile = useSelector(getProfile)

  const data = useMemo(() => {
    const items: Data[] = []

    if (!profile.photo_url || avatarError) {
      items.push({
        icon: assetList.avatarIconTutorial,
        title: 'Add profile picture',
        description:
          'Interaction between users is much\nmore easier with photos',
      })
    }

    if (!profile.bio) {
      items.push({
        icon: assetList.bioIconTutorial,
        title: 'Add bio',
        description: 'Inspire people to follow you with a\ncouple of lines',
      })
    }

    return items
  }, [profile])

  return (
    <Container>
      <Wrapper>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Title>Let's add colors</Title>
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
          text='Edit profile'
          height={56}
          onPress={onEditPress}
          containerStyle={{ borderRadius: 24 }}
          size='small'
        />
        <RoundButton onPress={onClosePress}>
          <CloseIcon source={assetList.crossIcon} />
        </RoundButton>
      </Wrapper>
    </Container>
  )
}

export default CompleteProfile
