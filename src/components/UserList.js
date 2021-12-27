import React from 'react'
import { Header, UserSearch } from './'
import { BackIcon } from './icons'
import { Container } from './main'

const UserList = ({
  title = '',
  navigation,
  selectUser,
  myId,
  client,
  ableFollow = false,
  ...props
}) => {
  return (
    <>
      <Container>
        {title ? (
          <Header
            leftButton={{
              onPress: () => navigation.goBack(),
              icon: BackIcon,
            }}
            title={title}
          />
        ) : null}
        <UserSearch
          {...props}
          client={client}
          ableFollow={ableFollow}
          onPressUser={(item) => {
            if (myId && myId === item.id) navigation.push('Profile')
            else navigation.push('AlienProfile', { user: item })
          }}
        />
      </Container>
    </>
  )
}

export default UserList
