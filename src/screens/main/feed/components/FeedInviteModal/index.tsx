import * as R from 'ramda'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Header } from '@components/index'
import { ModalContainer } from '@components/main'
import { SwipeIndicator } from '@components/ContextMenuModal'
import { HeaderSize } from '@components/common/Header/atoms'
import SimpleUserSelect from '@components/SimpleUserSelect'
import { getToken, getProfileId } from '@modules/auth'
import { Challenge } from '@app-types/challenge'
import { inviteChallenge } from '@modules/main/managers'
import { handleErrors } from '../../../../../aspects'
import InviteContactList from '../../../profile/Invite/InviteContactsList'
import { ModalContent } from './atoms'

enum View {
  User = 'user',
  Contact = 'contact',
}

type Props = {
  isVisible: boolean
  challenge: Challenge
  onPressClose: () => void
}

function InviteUserModal({ isVisible, challenge, onPressClose }: Props) {
  const token = useSelector(getToken)
  const [screenState, setScreenState] = useState(View.User)
  const myId = useSelector(getProfileId)
  const [filterUserIds, setFilterUserIds] = useState<number[]>()

  useEffect(() => {
    const ids = [myId] as number[]
    if (challenge && challenge.user) {
      ids.push(challenge.user.id)
    }
    setFilterUserIds(ids)
  }, [challenge])

  return (
    <ModalContainer
      isVisible={Boolean(isVisible)}
      onBackdropPress={onPressClose}
    >
      <ModalContent>
        {screenState === View.User ? (
          <>
            <Header
              title='Invite to game'
              size={HeaderSize.Modal}
              caps={false}
            />

            <SimpleUserSelect
              emptyListText={"Add users you'd like to invite to game"}
              selectedUsersText='Invite friends'
              filterUserIds={filterUserIds}
              selectedUsersAction={(selectedIds: number[]) => {
                R.call(inviteChallenge, token, challenge.id, {
                  user_ids: selectedIds,
                })
                  .then(() => {
                    onPressClose()
                  })
                  .catch(handleErrors)
              }}
              onContactPress={() => {
                setScreenState(View.Contact)
              }}
            />
          </>
        ) : (
          <InviteContactList
            backButtonPress={() => {
              setScreenState(View.User)
            }}
            isModal
            messageText={`Hey! Join this game at Happyō: ${challenge.access_url}`}
          />
        )}
      </ModalContent>
    </ModalContainer>
  )
}

export default InviteUserModal
