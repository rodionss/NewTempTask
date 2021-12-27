import * as R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import UserList from '../../../components/UserList'
import { getProfileId, getToken } from '../../../modules/auth'
import { selectUser } from '../../../modules/main/duck'
import {
  getCompleteUsers,
  getJoinedUsers,
} from '../../../modules/main/managers'

const CompletedUsersDumb = ({ token, ...props }) => (
  <UserList
    title={'Completed'}
    ableFollow={true}
    client={(q, page = 1) =>
      getCompleteUsers(token, props.navigation.state.params.id, q, page)
    }
    {...props}
  />
)

const ParticipantUsersDumb = ({ token, ...props }) => (
  <UserList
    title={'Participants'}
    ableFollow={true}
    client={(q, page = 1) =>
      getJoinedUsers(token, props.navigation.state.params.id, q, page)
    }
    {...props}
  />
)

export const CompletedUsers = connect(
  R.applySpec({ token: getToken, myId: getProfileId }),
  { selectUser },
)(CompletedUsersDumb)

export const ParticipantUsers = connect(
  R.applySpec({ token: getToken, myId: getProfileId }),
  { selectUser },
)(ParticipantUsersDumb)
