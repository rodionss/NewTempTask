import React from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components'
import { assetList } from '../assets'
import { Link, Text } from '../components/main'
import { THEME } from '../const'
import { ComplexButton } from './buttons'
import { stringToColour, lightenDarkenColor } from '../utils'
import { LinearGradient } from 'expo-linear-gradient'
import { FeaturedIcon } from './icons'
import Avatar from './common/atoms/Avatar'

const UserItemContainer = styled(Link)`
  width: 100%;
  padding: 12px;
  flex-direction: row;
`

const UserPhoto = styled(FastImage)`
  width: 70px;
  height: 70px;
  border-radius: 27px;
`

const UserContainer = styled.View`
  margin-top: 10px;
  width: 40%;
  margin-left: 15px;
`

const UserPrimary = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  color: #fff;
`

const UserSecondary = styled(Text)`
  font-size: 14px;
  color: ${THEME.formFieldTitleColor};
  margin-top: 2px;
`

const ButtonContainer = styled.View`
  margin-left: auto;
  justify-content: center;
`

const SelectedIndicator = styled.View`
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 27px;
  align-items: center;
  z-index: 99;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const Checkmark = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.checkmark,
})`
  width: 24px;
  height: 20px;
  tint-color: #fff;
`

const UserPhotoPlaceholderContainer = styled(LinearGradient).attrs(
  ({ color }) => ({
    start: [0, 0],
    end: [1, 1],
    colors: [lightenDarkenColor(color, 70), color],
  }),
)`
  width: 70px;
  height: 70px;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
`

const UserPhotoText = styled(Text)`
  font-weight: 400;
  font-size: 28px;
  color: white;
`

export const UserPhotoPlaceholder = ({ name }) => (
  <UserPhotoPlaceholderContainer color={stringToColour(name)}>
    <UserPhotoText>{name[0]}</UserPhotoText>
  </UserPhotoPlaceholderContainer>
)

export const UserItem = ({
  onPress,
  user = {},
  selected = false,
  featured = false,
  button = null,
  innerKey = null,
  containerStyle = {},
}) => (
  <UserItemContainer style={containerStyle} onPress={onPress} key={innerKey}>
    {user.photo_url ? (
      <Avatar size={64} uri={user.photo_url}>
        {selected ? (
          <SelectedIndicator>
            <Checkmark />
          </SelectedIndicator>
        ) : null}
      </Avatar>
    ) : (
      <UserPhotoPlaceholder name={user.username} />
    )}

    <UserContainer>
      <UserPrimary>
        {user.username || ''} {featured ? <FeaturedIcon /> : null}
      </UserPrimary>
      <UserSecondary>{user.name || ''}</UserSecondary>
    </UserContainer>
    {button ? (
      <ButtonContainer>
        <ComplexButton
          size={'small'}
          text={button.text}
          primary={button.primary}
          onPress={button.onPress}
          loading={button.isLoading}
        />
      </ButtonContainer>
    ) : null}
  </UserItemContainer>
)
