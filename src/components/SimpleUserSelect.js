//TODO refactor this into separate components
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { assetList } from '../assets'
import { THEME } from '../const'
import {
  getProfileId,
  getProfileInteractionsRecent,
  getToken,
} from '../modules/auth'
import Avatar, { AvatarSize } from '../components/common/atoms/Avatar'
import * as Manager from '../modules/main/managers'
import { keyExtractor, useDebounce } from '../utils'
import { PrimaryButton } from './buttons'
import EmptyState from './EmptyState'
import { Link, Text } from './main'
import SearchInput from './SearchInput'
import { handleErrors } from '../aspects'

const Loader = styled.ActivityIndicator`
  margin: 0 auto;
`

const UserSearchContainer = styled.View`
  width: 100%;
  height: 100%;
  padding-bottom: 24px;
`

const SearchList = styled(FlatList).attrs({
  columnWrapperStyle: {
    justifyContent: 'space-evenly',
  },
})``

const ButtonContainer = styled.View`
  margin-top: 10px;
  padding: 0 13px 0 13px;
`

const UserItemContainer = styled(Link)`
  margin: 10px;
  width: 80px;
  opacity: ${(props) => (props.disabled ? `0.4` : `1`)};
`

const UserPhotoContainer = styled.View`
  padding: 5px;
`

const UserPhotoWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(80 * 3) / 8}px;
  width: 80px;
  height: 80px;
  border: ${(props) =>
    props.selected
      ? `4px solid ${THEME.primaryButtonColor}`
      : '4px solid #000'};
`

const ContactContainer = styled.View`
  width: 74px;
  height: 74px;
  border-radius: 28px;
  border: 2px solid ${THEME.formFieldBorderColor};
  align-items: center;
  justify-content: center;
  margin: 2px 0;
`

const ContactListIcon = styled.Image.attrs({
  source: assetList.contactList,
})`
  width: 32px;
  height: 34px;
`

const UserNameContainer = styled.View`
  align-items: center;
`

const UserNickName = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  color: #fff;
`

const UserName = styled(Text)`
  font-size: 12px;
`

const SelectedIndicator = styled.View`
  position: absolute;
  top: 7px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  align-items: center;
  z-index: 999;
  justify-content: center;
  background-color: ${THEME.primaryButtonColor};
`

const Checkmark = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.checkmark,
})`
  width: 10px;
  height: 10px;
  tint-color: #fff;
`

const RecentWrapper = styled.View`
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(71, 70, 70, 0.6);
`

const Wrapper = styled.View`
  padding: 10px 20px 0 20px;
`

const Title = styled(Text)`
  color: #919191;
  font-weight: 500;
  font-size: 15px;
`

function ListHeader({ title }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
    </Wrapper>
  )
}

const SimpleUserSelect = ({
  emptyListText,
  selectedUsersAction,
  selectedUsersText,
  onContactPress,
  filterUserIds = [],
  selectedIds = [],
  showContact = true,
}) => {
  const STATE_LOADING = 'loading'
  const STATE_EMPTY = 'empty'
  const STATE_CONTENT = 'content'
  const STATE_ERROR = 'error'

  const ITEM_USER = 'user'
  const ITEM_EMPTY = 'empty'
  const ITEM_CONTACT = 'contact'

  const COLUMNS = 4
  const DEBOUNCE_DELAY = 300
  const MIN_SEARCH_LENGTH = 1

  const myId = useSelector(getProfileId)
  const token = useSelector(getToken)
  const recent = useSelector(getProfileInteractionsRecent)

  const [following, setFollowing] = useState([])
  const [followingPagination, setFollowingPagination] = useState({
    page: 1,
    hasM_more: false,
  })

  const [searchText, setSearchText] = useState('')
  const [loadState, setLoadState] = useState(STATE_EMPTY)
  const debouncedSearchText = useDebounce(searchText, DEBOUNCE_DELAY)

  const [users, setUsers] = useState([])
  const [userList, setUserList] = useState(recent)
  const [pagination, setPagination] = useState(null)
  const [ids, setIds] = useState(selectedIds)

  const searchInput = useRef(null)
  const convertName = (name) => (name ? name.split(' ')[0] : '')

  const client = useCallback((q, page = 1) => {
    if (!q) {
      return new Promise((resolve) => {
        resolve({
          users: [],
          has_more: false,
          page: 1,
        })
      })
    }

    return Manager.searchUser(token, q, page)
  }, [])

  const loader = useCallback((page = 1) => {
    const q =
      debouncedSearchText && debouncedSearchText.length >= MIN_SEARCH_LENGTH
        ? debouncedSearchText
        : ''

    setLoadState(STATE_LOADING)
    client(q, page)
      .then((result) => handleResponse(result, page))
      .catch((e) => {
        setLoadState(STATE_ERROR)
        handleErrors(e)
      })
  })

  useEffect(() => {
    loader()
  }, [client, debouncedSearchText])

  useEffect(() => {
    Manager.getFollowing(token, myId, undefined, followingPagination.page)
      .then((result) => {
        console.log(result)
        setFollowingPagination((prevState) => ({
          ...prevState,
          has_more: result.hasMore,
        }))
        setFollowing((prevState) => [...prevState, ...result.users])
      })
      .catch(handleErrors)
  }, [followingPagination.page])

  const handleLoadMore = useCallback(() => {
    loader(pagination.page + 1)
  })

  const handleLoadMoreFollowers = useCallback(() => {
    if (followingPagination.has_more) {
      setFollowingPagination((prevState) => ({
        ...prevState,
        page: prevState.page + 1,
      }))
    }
  }, [followingPagination])

  const renderSearchUserItem = useCallback(({ item }) => {
    return (
      <UserItem
        user={item}
        onPress={() => {
          const alreadyAdded = userList.filter((it) => it.id === item.id)
          if (!alreadyAdded.length) {
            setUserList([...userList, item])
            setIds([...ids, item.id])
          }
          setSearchText('')
          if (searchInput.current) {
            searchInput.current.blur()
          }
        }}
        selected={false}
        disabled={filterUserIds.includes(item.id)}
      />
    )
  })

  const renderSearchEmptyUsers = useCallback(() =>
    loadState == STATE_LOADING ? (
      <EmptyState>
        <Loader />
      </EmptyState>
    ) : (
      <EmptyState
        text={
          loadState == STATE_CONTENT &&
          searchText &&
          searchText.length >= MIN_SEARCH_LENGTH
            ? 'No users found'
            : 'Start to type something'
        }
      />
    ),
  )

  const renderSelectedList = (items, contacts) => {
    const filteredItems = items.filter((x) => !filterUserIds.includes(x.id))
    return showContact && contacts
      ? renderList([
          {
            id: 'contacts',
            itemType: ITEM_CONTACT,
          },
          ...filteredItems,
        ])
      : renderList(filteredItems)
  }

  const renderList = (items) => {
    const remainder = items.length % COLUMNS

    if (remainder > 0) {
      return [
        ...items,
        ...[...new Array(COLUMNS - remainder)].map(() => ({
          id: 'empty-`parseInt(Math.random() * 1000)`',
          itemType: ITEM_EMPTY,
        })),
      ]
    }

    return items
  }

  const onUserTap = (user) => {
    if (ids.includes(user.id)) {
      setIds(ids.filter((item) => item !== user.id))
    } else {
      setIds([...ids, user.id])
    }

    if (!userList.map(({ id }) => id).includes(user.id)) {
      setUserList((prevState) => [...prevState, user])
    }
  }

  const handleResponse = useCallback((result, page) => {
    page == 1 ? setUsers(result.users) : setUsers([...users, ...result.users])
    setPagination({ hasMore: result.has_more, page: result.page })
    setLoadState(users.length > 0 ? STATE_CONTENT : STATE_EMPTY)
  })

  const onPressCross = useCallback(() => {
    setSearchText('')
  })

  const renderUserItem = useCallback(({ item }) => {
    return (
      <UserItem
        user={item}
        onPress={() => onUserTap(item)}
        selected={ids.includes(item.id)}
      />
    )
  })

  const UserItem = ({ onPress, user = {}, selected, disabled }) => (
    <>
      {user.itemType === ITEM_EMPTY ? (
        <UserItemContainer />
      ) : user.itemType === ITEM_CONTACT ? (
        <UserItemContainer onPress={onContactPress}>
          <UserPhotoContainer>
            <ContactContainer>
              <ContactListIcon />
            </ContactContainer>
          </UserPhotoContainer>
          <UserNameContainer>
            <UserNickName>Contacts</UserNickName>
            <UserNickName>list</UserNickName>
          </UserNameContainer>
        </UserItemContainer>
      ) : (
        <UserItemContainer
          onPress={disabled ? null : onPress}
          disabled={disabled}
        >
          <UserPhotoContainer>
            {selected ? (
              <SelectedIndicator>
                <Checkmark />
              </SelectedIndicator>
            ) : null}

            <UserPhotoWrapper selected={selected}>
              <Avatar uri={user.photo_url} size={AvatarSize.Contact} />
            </UserPhotoWrapper>
          </UserPhotoContainer>
          <UserNameContainer>
            <UserNickName>{user.username.toLowerCase()}</UserNickName>
            <UserName>{convertName(user.name)}</UserName>
          </UserNameContainer>
        </UserItemContainer>
      )}
    </>
  )

  const renderListEmptyUsers = useCallback(() => (
    <EmptyState text={emptyListText} />
  ))

  const showRecent = userList.length !== 0

  return (
    <UserSearchContainer>
      <SearchInput
        innerRef={searchInput}
        value={searchText}
        placeholder={'Send to ...'}
        onPressCross={onPressCross}
        onChangeText={setSearchText}
      />

      {searchText.length > 0 ? (
        <SearchList
          keyboardShouldPersistTaps={'always'}
          data={renderList(users)}
          numColumns={COLUMNS}
          keyExtractor={keyExtractor}
          renderItem={renderSearchUserItem}
          ListEmptyComponent={renderSearchEmptyUsers}
          onEndReached={handleLoadMore}
        />
      ) : (
        <>
          {showRecent && (
            <RecentWrapper>
              <ListHeader title='Recent' />
              <FlatList
                horizontal={true}
                data={renderSelectedList([...userList].reverse(), false)}
                keyExtractor={keyExtractor}
                renderItem={renderUserItem}
                ListEmptyComponent={renderListEmptyUsers}
              />
            </RecentWrapper>
          )}
          <SearchList
            data={renderSelectedList(following, true)}
            numColumns={COLUMNS}
            keyExtractor={keyExtractor}
            renderItem={renderUserItem}
            ListEmptyComponent={renderListEmptyUsers}
            onEndReached={handleLoadMoreFollowers}
          />
        </>
      )}

      {ids.length ? (
        <ButtonContainer>
          <PrimaryButton
            text={selectedUsersText}
            onPress={() => selectedUsersAction(ids)}
          />
        </ButtonContainer>
      ) : null}
    </UserSearchContainer>
  )
}

export default SimpleUserSelect
