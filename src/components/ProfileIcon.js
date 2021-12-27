import * as R from 'ramda'
import React from 'react'
import Avatar, { AvatarSize } from '../components/common/atoms/Avatar'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { getProfilePhoto } from '../modules/auth'

const BORDER_WIDTH = 2

const Wrapper = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border-color: #fff;
  border-width: ${({ active }) => (active ? BORDER_WIDTH : 0)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProfileIcon = ({ active, photoUrl }) => {
  return (
    <Wrapper active={active}>
      <Avatar uri={photoUrl} size={AvatarSize.Navbar} />
    </Wrapper>
  )
}

export default connect(R.applySpec({ photoUrl: getProfilePhoto }))(ProfileIcon)
