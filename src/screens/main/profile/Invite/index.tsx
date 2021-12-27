import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { Linking, RefreshControl } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import Contacts from 'react-native-contacts'
import Clipboard from '@react-native-clipboard/clipboard'
import { connect, useSelector } from 'react-redux'
import { Header } from '@components/index'
import { BackIcon } from '@components/icons'
import { SwipeIndicator } from '@components/ContextMenuModal'
import { getProfileInvites, getToken, updateProfile } from '@modules/auth'
import * as Manager from '@modules/main/managers'
import { useAnalytics, withAmplitude } from '@utils/index'
import InvitesCountIcon from '@screens/main/profile/Invite/InvitesCountIcon'
import { HeaderSize } from '@components/common/Header/atoms'
import { assetList } from '@assets/index'
import Share from 'react-native-share'
import { StackActions } from 'react-navigation'
import { DropdownService } from '../../../../services'
import { handleErrors } from '../../../../aspects'
import { Invite as InviteType, UserContact } from './types'
import {
  getInviteText,
  convertContactsToUserContacts,
  getMessageText,
} from './domain'
import EmptyState from './EmptyState'
import ContactList from './ContactList'
import {
  ModalContent,
  ButtonsWrapper,
  Button,
  Wrapper,
  Title,
  ButtonText,
  Group,
  ButtonGroup,
  Icon,
  LeftSide,
  Container,
} from './atoms'
import { THEME } from '../../../../const'

type Props = {
  updateProfile: any
  backButtonPress: any
}

function InviteDumb({ updateProfile, backButtonPress }: Props) {
  const navigation = useNavigation()
  const token = useSelector(getToken)
  const invites = useSelector(getProfileInvites) as InviteType[]
  const logEvent = useAnalytics()
  const [contacts, setContacts] = useState<UserContact[]>([])

  const copyInvite = useCallback(() => {
    if (invites.length) {
      Clipboard.setString(getInviteText(invites[0].url))
    }
  }, [invites])

  const shareInvite = useCallback(() => {
    if (invites.length) {
      Share.open({
        title: 'HAPPYŌ',
        subject: "I've just invited you to Happyō",
        message: getInviteText(invites[0].url),
      })
    }
  }, [invites])

  useEffect(() => {
    Contacts.getAll()
      .then((fetchedContacts) => {
        const phoneContacts = fetchedContacts.filter(
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

  const onPressContact = useCallback((contact) => {
    const phone = contact.name

    if (invites.length) {
      Manager.inviteByPhone(token, phone)
        .then((availableInvites: InviteType[]) => {
          updateProfile({ invites: availableInvites })
          logEvent('Invite to Happyō')
          Linking.openURL(`sms:${phone}&body=${getMessageText(phone)}`)
        })
        .catch(handleErrors)
    } else {
      DropdownService.alert('error', "Sorry, you're out of invites, try later")
    }
  }, [])

  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  const canInvite = invites.length

  const headerPressBack = backButtonPress || (() => navigation.goBack())

  return (
    <Container
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          tintColor={THEME.textColor}
          refreshing={false}
          onRefresh={forceUpdate}
        />
      }
    >
      <Wrapper>
        <Header
          leftButton={{
            onPress: headerPressBack,
            icon: BackIcon,
          }}
          rightButton={
            canInvite
              ? {
                  icon: () => (
                    <InvitesCountIcon invitesCount={invites.length} />
                  ),
                }
              : undefined
          }
          title='Invite to Happyō'
          size={HeaderSize.Main}
          rounded
        />
        {canInvite ? (
          <>
            <ButtonsWrapper>
              <Group>
                <Title>Invite via QR-code</Title>
                <Button
                  onPress={() =>
                    navigation.dispatch(
                      StackActions.push({ routeName: 'QRCodeInvite' }),
                    )
                  }
                >
                  <LeftSide>
                    <Icon
                      source={assetList.qrCodeIcon}
                      style={{ marginRight: 10 }}
                      width={24}
                      height={24}
                    />
                    <ButtonText>Scan QR-code</ButtonText>
                  </LeftSide>
                  <Icon source={assetList.arrowRight} width={24} height={24} />
                </Button>
              </Group>
              <Group>
                <Title>Send invite via</Title>
                <ButtonGroup>
                  <Button onPress={copyInvite}>
                    <Icon
                      source={assetList.copyIcon}
                      style={{ marginRight: 10 }}
                      width={27}
                      height={27}
                    />
                    <ButtonText>Copy</ButtonText>
                  </Button>
                  <Button onPress={shareInvite}>
                    <ButtonText>Social Media</ButtonText>
                    <Icon
                      source={assetList.socialMedia}
                      style={{ marginLeft: 10 }}
                      width={82}
                      height={25}
                    />
                  </Button>
                </ButtonGroup>
              </Group>
            </ButtonsWrapper>
            <ModalContent>
              <SwipeIndicator />
              <ContactList
                contacts={contacts}
                onPressContact={onPressContact}
              />
            </ModalContent>
          </>
        ) : (
          <EmptyState />
        )}
      </Wrapper>
    </Container>
  )
}

const Invite = R.compose(
  withAmplitude('Contact list screen shown'),
  connect(undefined, { updateProfile }),
)(InviteDumb)

export default Invite
