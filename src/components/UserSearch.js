import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { handleErrors } from '../aspects'
import { getProfileId, getToken } from '../modules/auth'
import { follow, unfollow } from '../modules/main/managers'
import { keyExtractor, useDebounce } from '../utils'
import EmptyState from './EmptyState'
import { FlatList } from './main'
import SearchInput from './SearchInput'
import { UserItem } from './UserItem'

const SearchList = styled(FlatList)`
  height: 100%;
`

const Loader = styled.ActivityIndicator`
  margin: 0 auto;
`

const UserSearch = ({
  client,
  token,
  onPressUser,
  ableFollow,
  meta,
  myId,
  withoutInput,
  selectedIds = [],
  ...props
}) => {
  const MIN_SEARCH_LENGTH = 1
  const STATE_LOADING = 'loading'
  const STATE_EMPTY = 'empty'
  const STATE_CONTENT = 'content'
  const STATE_ERROR = 'error'

  const [searchText, setSearchText] = useState('')
  const [loadState, setLoadState] = useState(STATE_EMPTY)
  const debouncedSearchText = useDebounce(searchText, 300)

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState(null)

  const handleResponse = useCallback((result, page) => {
    page == 1 ? setUsers(result.users) : setUsers([...users, ...result.users])
    setPagination({ hasMore: result.has_more, page: result.page })
    setLoadState(users.length > 0 ? STATE_CONTENT : STATE_EMPTY)
  })

  const loader = useCallback((page = 1) => {
    const q =
      debouncedSearchText && debouncedSearchText.length >= MIN_SEARCH_LENGTH
        ? debouncedSearchText
        : ''

    setLoadState(STATE_LOADING)
    client(q, page, debouncedSearchText)
      .then((result) => handleResponse(result, page))
      .catch((e) => {
        setLoadState(STATE_ERROR)
        handleErrors(e)
      })
  })

  useEffect(() => {
    loader()
  }, [client, debouncedSearchText])

  const handleLoadMore = useCallback(() => {
    loader(pagination.page + 1)
  })

  const onPressCross = useCallback(() => {
    setSearchText('')
  })

  const localManageFollowUser = useCallback((item) => {
    const isFollow = item.user_stats.follow_state === 'follow'
    const newUsers = users.reduce((acc, user) => {
      if (user.id === item.id)
        user.user_stats.follow_state = isFollow ? 'none' : 'follow'
      return [...acc, user]
    }, [])
    setUsers(newUsers)
  })

  const renderUserItem = useCallback(({ item }) => {
    const isFollow = item.user_stats.follow_state === 'follow'
    return (
      <UserItem
        user={item}
        button={
          myId === item.id
            ? null
            : ableFollow
            ? {
                text: isFollow ? 'Unfollow' : 'Follow',
                primary: !isFollow,
                onPress: () =>
                  R.call(isFollow ? unfollow : follow, token, item.id)
                    .then(() => localManageFollowUser(item))
                    .catch(handleErrors),
              }
            : null
        }
        onPress={() => onPressUser(item)}
        selected={selectedIds.includes(item.id)}
      />
    )
  })

  const renderListEmptyUsers = useCallback(() =>
    loadState == STATE_LOADING ? (
      <EmptyState>
        <Loader />
      </EmptyState>
    ) : (
      <EmptyState
        text={
          searchText && searchText.length >= MIN_SEARCH_LENGTH
            ? 'No users found'
            : 'Start to type something'
        }
      />
    ),
  )

  return (
    <>
      {withoutInput ? null : (
        <SearchInput
          value={searchText}
          placeholder={'Search'}
          onPressCross={onPressCross}
          onChangeText={setSearchText}
        />
      )}

      <SearchList
        data={users}
        keyExtractor={keyExtractor}
        renderItem={renderUserItem}
        ListEmptyComponent={renderListEmptyUsers}
        onEndReached={handleLoadMore}
        {...props}
      />
    </>
  )
}

export default connect(R.applySpec({ myId: getProfileId, token: getToken }))(
  UserSearch,
)
