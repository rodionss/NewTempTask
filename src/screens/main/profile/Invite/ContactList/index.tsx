import React, { useCallback, useState } from 'react'
import { SearchInput, UserItem } from '@components/index'
import { UserContact } from '@screens/main/profile/Invite/types'
import LazyPaginatedList from '@components/common/molecules/LazyPaginatedList'
import { Header } from './atoms'

type Props = {
  contacts: UserContact[]
  onPressContact: (contact: UserContact) => void
}

function ContactList({ contacts, onPressContact }: Props) {
  const [searchText, setSearchText] = useState('')

  const onPressCross = useCallback(() => {
    setSearchText('')
  }, [])

  const searchPredicate = useCallback(
    (contact = {}) => {
      const search = searchText.toLowerCase()
      const name = contact.name.toLowerCase()
      const phone = contact.username.toLowerCase()

      return name.includes(search) || phone.includes(search)
    },
    [searchText],
  )

  const filteredContacts = contacts.filter(searchPredicate)

  return (
    <>
      <LazyPaginatedList<UserContact>
        contentContainerStyle={{ paddingBottom: 60 }}
        pageSize={5}
        data={filteredContacts}
        keyExtractor={(contact) => contact.name}
        ListHeaderComponent={
          <Header>
            <SearchInput
              value={searchText}
              placeholder='Find contact'
              onPressCross={onPressCross}
              onChangeText={setSearchText}
            />
          </Header>
        }
        renderItem={({ item, index }) => (
          <UserItem
            innerKey={(index + 1).toString()}
            user={item}
            button={{
              text: 'Invite',
              primary: true,
              onPress: () => onPressContact(item),
            }}
          />
        )}
      />
    </>
  )
}

export default ContactList
