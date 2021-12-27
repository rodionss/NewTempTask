import GameTileItem from '@components/GameTileItem'
import { Text } from '@components/main'
import SmallUserItem from '@components/SmallUserItem'
import { UserItem } from '@components/UserItem'
import UserSearch from '@components/UserSearch'
import {
  getProfileId,
  getProfileInteractionsRecent,
  getToken,
} from '@modules/auth'
import { getCelebrity, getPopularGames } from '@modules/main'
import { useDebounce } from '@utils/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { handleErrors } from '../../../../aspects/handleErrors'
import { TAB_HEIGHT, THEME } from '../../../../const'
import { searchGames, searchUser } from '../../../../modules/main/managers'
import { GameList } from './atoms'

const { width, height } = Dimensions.get('window')

const Container = styled.View`
  flex: 1;
  background-color: ${THEME.secondaryBackgroundColor};
`
const List = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingBottom: TAB_HEIGHT + 20,
  },
})`
  flex: 1;
  background-color: ${THEME.secondaryBackgroundColor};
`

const HorizontalUserList = styled.FlatList.attrs({ horizontal: true })`
  width: ${width}px;
  max-height: 132px;
  background-color: ${THEME.secondaryBackgroundColor};
`

const Title = styled(Text)`
  font-weight: 600;
  font-size: 15px;
  color: #7d7d7d;
  padding-top: 12px;
  padding-left: 12px;
  background-color: ${THEME.secondaryBackgroundColor};
`

type Props = {
  navigation: any
  searchText: string
  isUserTab: boolean
}

const Search = ({ navigation, isUserTab, searchText, ...props }: Props) => {
  const MIN_SEARCH_LENGTH = 1
  const myId = useSelector(getProfileId)
  const token = useSelector(getToken)

  const recent = useSelector(getProfileInteractionsRecent)
  const popularUsers = useSelector(getCelebrity)
  const popularGames = useSelector(getPopularGames)
  const debouncedSearchText = useDebounce(searchText, 300)
  const [games, setGames] = useState([])

  useEffect(() => {
    if (debouncedSearchText && !isUserTab)
      searchGames(token, debouncedSearchText)
        .then((res: any) => setGames(res.challenges)) // Add pagination
        .catch(handleErrors)
  }, [debouncedSearchText])

  const renderUserItem = useCallback(
    ({ item }) => (
      <UserItem
        user={item}
        onPress={() => navigation.push('AlienProfile', { user: item })}
      />
    ),
    [],
  )

  const renderGameItem = useCallback(
    ({ item }) => (
      <GameTileItem
        containerStyle={{ marginTop: 8 }}
        item={item}
        onPress={() => {
          navigation.navigate('ChallengeDetailed', {
            direct: true,
            challenge: item,
          })
        }}
      />
    ),
    [],
  )
  const renderUserListHeader = useCallback(
    () => (
      <>
        <Title>Recent</Title>
        <HorizontalUserList
          data={recent}
          renderItem={({ item }: any) => (
            <SmallUserItem
              user={item}
              onPress={() => navigation.push('AlienProfile', { user: item })}
            />
          )}
        />
        <Title>Popular</Title>
      </>
    ),
    [],
  )

  return (
    <Container>
      {!searchText ? (
        isUserTab ? (
          <List
            data={popularUsers}
            renderItem={renderUserItem}
            ListHeaderComponent={renderUserListHeader}
          />
        ) : (
          <GameList
            data={popularGames}
            renderItem={renderGameItem}
            ListHeaderComponent={<Title>Popular</Title>}
          />
        )
      ) : isUserTab ? (
        <UserSearch
          withoutInput
          ableFollow
          style={{ backgroundColor: '#111313', marginTop: -44, paddingTop: 44 }}
          onPressUser={(user: any) => {
            if (myId && myId === user.id) navigation.push('Profile')
            else navigation.push('AlienProfile', { user })
          }}
          client={(_: any, page = 1) =>
            !searchText || searchText.length < MIN_SEARCH_LENGTH
              ? new Promise((resolve) =>
                  resolve({ users: [], has_more: false, page: 1 }),
                )
              : searchUser(token, searchText, page)
          }
        />
      ) : (
        <GameList data={games} renderItem={renderGameItem} />
      )}
    </Container>
  )
}

export default Search
