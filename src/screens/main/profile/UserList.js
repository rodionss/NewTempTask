import * as R from 'ramda'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { getProfileId, getToken } from '../../../modules/auth'
import { selectUser } from '../../../modules/main/duck'
import { getAlienProfileId } from '../../../modules/main/selectors'
import * as Manager from '../../../modules/main/managers'

import UserList from '../../../components/UserList'

const FollowingUsersDumb = ({ token, ...props }) => {
  const id = useMemo(() => props.navigation.state.params.id, [])
  return (
    <UserList
      id={id}
      title={'Following'}
      ableFollow={true}
      client={(q, page = 1) => Manager.getFollowing(token, id, q, page)}
      {...props}
    />
  )
}

const FollowersUsersDumb = ({ token, ...props }) => {
  const id = useMemo(() => props.navigation.state.params.id, [])
  return (
    <UserList
      id={id}
      title={'Followers'}
      ableFollow={true}
      client={(q, page = 1) => Manager.getFollowers(token, id, q, page)}
      {...props}
    />
  )
}
export const FollowingUsers = connect(R.applySpec({ token: getToken }), {
  selectUser,
})(FollowingUsersDumb)

export const AlienFollowingUsers = connect(
  R.applySpec({ token: getToken, myId: getProfileId }),
  { selectUser },
)(FollowingUsersDumb)

export const FollowersUsers = connect(R.applySpec({ token: getToken }), {
  selectUser,
})(FollowersUsersDumb)

export const AlienFollowersUsers = connect(
  R.applySpec({ token: getToken, myId: getProfileId }),
  { selectUser },
)(FollowersUsersDumb)
