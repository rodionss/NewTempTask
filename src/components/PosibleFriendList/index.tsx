import { followPosibleFriend } from '@modules/main/duck'
import { getPosibleFriends } from '@modules/main/selectors'
import { useAnalytics } from '@utils/functions'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Contacts from 'react-native-contacts'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { Text } from '../main'
import { ContactsItem, PosibleFriendItem } from './atoms'

const HorizontalList = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 16 },
})`
  padding-bottom: 16px;
`

const EmptyMessage = styled(Text)`
  padding-left: 16px;
`

type Props = {
  navigation: any
}

const PosibleFriendList = ({ navigation }: Props) => {
  const logEvent = useAnalytics()
  const dispatch = useDispatch()

  const posibleFriends = useSelector(getPosibleFriends)
  const [contactPermission, setContactPermission] = useState(false)

  const list = useMemo(
    () =>
      contactPermission
        ? posibleFriends
        : [posibleFriends[0], 'contacts', ...posibleFriends.slice(1)],
    [posibleFriends, contactPermission],
  )

  useEffect(() => {
    Contacts.checkPermission().then((res) =>
      setContactPermission(res !== 'undefined'),
    )
  }, [])

  const onPressContacts = useCallback(() => {
    Contacts.requestPermission().then((res) => {
      const enable = res !== 'undefined'
      logEvent('Contact list permission', { enable })
      setContactPermission(enable)
    })
  }, [])

  const renderPosibleFriendItem = useCallback(({ item = {}, index }) => {
    const follow = item.user_stats && item.user_stats.follow_state === 'none'
    const button = {
      light: follow,
      text: follow ? 'Follow' : 'Unfollow',
      onPress: () => dispatch(followPosibleFriend({ ...item, index, follow })),
    }
    return item === 'contacts' ? (
      <ContactsItem onPress={onPressContacts} />
    ) : (
      <PosibleFriendItem
        item={item}
        button={button}
        onPress={() => navigation.push('AlienProfile', { user: item })}
      />
    )
  }, [])

  return (
    <HorizontalList
      data={list}
      keyExtractor={(_, i) => 'uniq' + i}
      renderItem={renderPosibleFriendItem}
      ListEmptyComponent={<EmptyMessage>Not found mutual friends</EmptyMessage>}
    />
  )
}

export default PosibleFriendList
