import * as R from 'ramda'
import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'

import { Header, UserItem, EmptyState } from '../../../components'
import { Container, FlatList } from '../../../components/main'
import { withAmplitude } from '../../../utils'
import { BackIcon } from '../../../components/icons'
import { getToken } from '../../../modules/auth'
import * as Manager from '../../../modules/main/managers'
import { handleErrors } from '../../../aspects'
import { DropdownService } from '../../../services'

const BlockedUsersDumb = ({ navigation, token }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    Manager.getBlockedUsers(token, '', 1)
      .then((result) => {
        setUsers(result.users)
      })
      .catch(handleErrors)
  }, [])

  const manageUserBlock = useCallback((item) => {
    if (item.user_stats.is_blocking) {
      Manager.unblockUser(token, item.id).then(() => {
        DropdownService.alert(
          'success',
          'Done!',
          `You've unblocked ${item.name}`,
        )
      })
    } else {
      Manager.blockUser(token, item.id).then(() => {
        DropdownService.alert('success', 'Done!', `You've blocked ${item.name}`)
      })
    }

    const isBlocking = item.user_stats.is_blocking
    const newUsers = users.reduce((acc, user) => {
      if (user.id === item.id) {
        user.user_stats.is_blocking = !isBlocking
      }

      return [...acc, user]
    }, [])
    setUsers(newUsers)
  })

  return (
    <Container>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
        title={'Blocked users'}
      />
      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          const isBlocking = item.user_stats.is_blocking
          return (
            <UserItem
              user={item}
              button={{
                text: isBlocking ? 'Unblock' : 'Block',
                primary: !isBlocking,
                onPress: () => {
                  manageUserBlock(item)
                },
              }}
            />
          )
        }}
        ListEmptyComponent={() => (
          <EmptyState text='Blocked users will be displayed here' />
        )}
      />
    </Container>
  )
}

const BlockedUsers = R.compose(
  withAmplitude('Blocked users screen shown'),
  connect(R.applySpec({ token: getToken }), {}),
)(BlockedUsersDumb)

export default BlockedUsers
