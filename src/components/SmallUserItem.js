import { Link, Text } from '@components/main'
import React from 'react'
import styled from 'styled-components/native'
import Avatar from './common/atoms/Avatar'

const UserItemContainer = styled(Link)`
  margin: 10px;
  width: 80px;
  height: 100px;
`

const UserPhotoContainer = styled.View`
  padding: 5px;
`

const UserNameContainer = styled.View`
  align-items: center;
`

const UserNickName = styled(Text)`
  font-size: 12px;
  font-weight: 700;
`

const UserName = styled(Text)`
  font-size: 12px;
`

const SmallUserItem = ({ user, onPress }) => (
  <UserItemContainer onPress={onPress}>
    <UserPhotoContainer>
      <Avatar uri={user.photo_url} size={72} />
    </UserPhotoContainer>
    <UserNameContainer>
      <UserNickName>{user.username}</UserNickName>
      <UserName>{user.name.split(' ')[0]}</UserName>
    </UserNameContainer>
  </UserItemContainer>
)

export default SmallUserItem
