import { Contact } from 'react-native-contacts'
import { UserContact } from '@screens/main/profile/Invite/types'
import { URLS } from '../../../../const'

export const getMessageText = (number: string) =>
  `Hey!  I've just invited you to Happyō by the number ${number}. Download here: ${URLS.appStore}.\nLet's play together!`

export const getInviteText = (inviteUrl: string) =>
  `Hey! Let's play Happyō together.
    1. Download the app here: ${URLS.appStore}
    2. Press this invite link after downloading to activate the account: ${inviteUrl}
    3. Have fun!`

export const convertContactsToUserContacts = (contacts: Contact[]) =>
  contacts.map((contact) => covertToUserContact(contact))

export const covertToUserContact = (contact: Contact): UserContact => ({
  photo_url: contact.hasThumbnail ? contact.thumbnailPath : null,
  username:
    contact.givenName + (contact.familyName ? ` ${contact.familyName}` : ''),
  name: contact.phoneNumbers[0].number,
})
