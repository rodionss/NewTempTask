import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking } from 'react-native'
import Contacts from 'react-native-contacts'
import { connect, useSelector } from 'react-redux'
import { Header } from '@components/index'
import { BackIcon } from '@components/icons'
import { Container } from '@components/main'
import { getProfileInvites, getToken, updateProfile } from '@modules/auth'
import * as Manager from '@modules/main/managers'
import { useAnalytics, withAmplitude } from '@utils/index'
import { UserContact } from '@screens/main/profile/Invite/types'
import {
  convertContactsToUserContacts,
  getMessageText,
} from '@screens/main/profile/Invite/domain'
import { useNavigation } from 'react-navigation-hooks'
import { DropdownService } from '../../../../services'
import { Invite as InviteType } from './types'
import ContactList from './ContactList'
import { handleErrors } from '../../../../aspects'

type Props = {
  isModal?: boolean
  messageText?: string
}

function InviteContactListDumb({
  updateProfile,
  backButtonPress,
  isModal = false,
  messageText = getMessageText(),
}: Props) {
  const navigation = useNavigation()
  const token = useSelector(getToken)
  const invites = useSelector(getProfileInvites) as InviteType[]
  const logEvent = useAnalytics()
  const [contacts, setContacts] = useState<UserContact[]>([])

  useEffect(() => {
    Contacts.getAll()
      .then((fetchedContact) => {
        const phoneContacts = fetchedContact.filter(
          (contact) =>
            contact.phoneNumbers &&
            contact.phoneNumbers.length &&
            contact.phoneNumbers[0].number,
        )

        Manager.sendContacts(token, {
          contacts: phoneContacts.map(
            (contact) => contact.phoneNumbers[0].number,
          ),
        })
          .then(() => logEvent('Contact list permission', { enable: true }))
          .catch(handleErrors)

        setContacts(convertContactsToUserContacts(phoneContacts))
      })
      .catch(() => {
        logEvent('Contact list permission', { enable: false })
      })
  }, [])

  const onPressContact = useCallback((contact: UserContact) => {
    const phone = contact.name

    if (invites.length) {
      Manager.inviteByPhone(token, phone)
        .then((availableInvites: InviteType[]) => {
          updateProfile({ invites: availableInvites })
          logEvent('Invite to Happyō')
          Linking.openURL(`sms:${phone}&body=${messageText}`)
        })
        .catch(handleErrors)
    } else {
      DropdownService.alert('error', "Sorry, you're out of invites, try later")
    }
  }, [])

  const renderContent = useCallback(
    (size) => (
      <>
        <Header
          leftButton={{
            onPress: backButtonPress || (() => navigation.goBack()),
            icon: BackIcon,
          }}
          title={`Invite friends (${invites.length})`}
          size={size}
        />
        <ContactList contacts={contacts} onPressContact={onPressContact} />
      </>
    ),
    [invites, contacts, onPressContact],
  )

  return isModal ? (
    renderContent('modal')
  ) : (
    <Container>{renderContent('main')}</Container>
  )
}

const InviteContactList = R.compose(
  withAmplitude('Contact list screen shown'),
  connect(undefined, { updateProfile }),
)(InviteContactListDumb)

export default InviteContactList
