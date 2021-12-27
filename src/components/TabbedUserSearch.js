import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import * as Manager from '../modules/main/managers'
import Tabs from './common/Tabs'
import UserSearch from './UserSearch'

const Container = styled.View`
  width: 100%;
  height: 100%;
  padding-bottom: 24px;
  background-color: #000;
`

const TabContainer = styled.View`
  width: 100%;
  align-items: center;
`

const TabbedUserSearch = ({
  token,
  myId,
  onPressUser,
  meta,
  ableInvite,
  selectedIds = [],
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const clients = useMemo(
    () => [
      (q, page = 1) => Manager.getFollowing(token, myId, q, page),
      (q, page = 1) => Manager.getFollowers(token, myId, q, page),
      (q, page = 1) => {
        if (!q) {
          return new Promise((resolve, reject) => {
            resolve({
              users: [],
              has_more: false,
              page: 1,
            })
          })
        }

        return Manager.searchUser(token, q, page)
      },
    ],
    [],
  )

  return (
    <Container>
      <TabContainer>
        <Tabs
          tabs={['Following', 'Followers', 'Search']}
          value={tabIndex}
          onPressTab={setTabIndex}
        />
      </TabContainer>

      <UserSearch
        meta={meta}
        ableInvite={ableInvite}
        selectedIds={selectedIds}
        client={clients[tabIndex]}
        onPressUser={onPressUser}
      />
    </Container>
  )
}

export default TabbedUserSearch
