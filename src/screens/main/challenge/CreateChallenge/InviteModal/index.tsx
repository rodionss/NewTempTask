import React from 'react'
import { useSelector } from 'react-redux'
import Header from '@components/common/Header'
import { HeaderSize } from '@components/common/Header/atoms'
import { ModalContainer } from '@components/main'
import SimpleUserSelect from '@components/SimpleUserSelect'
import { getProfileId } from '@modules/auth'
import { ModalContent } from './atoms'

type Props = {
  isVisible: boolean
  onPressClose: () => void
  selectedIds: number[]
  onPressSelect: (selectedIds: string[]) => void
  confirmText?: string
  emptyText?: string
}

const InviteModal = ({
  isVisible,
  onPressClose,
  onPressSelect,
  selectedIds,
  confirmText = 'Invite to game',
  emptyText = "Add users you'd like to invite to game",
}: Props) => {
  const myId = useSelector(getProfileId)

  const filterUserIds = [myId]

  return (
    <ModalContainer isVisible={isVisible} onBackdropPress={onPressClose}>
      <ModalContent>
        <Header title='Invite to game' size={HeaderSize.Modal} />

        <SimpleUserSelect
          emptyListText={emptyText}
          selectedUsersText={confirmText}
          selectedIds={selectedIds}
          filterUserIds={filterUserIds}
          selectedUsersAction={(selectedIds) => onPressSelect(selectedIds)}
          onContactPress={() => {}}
          showContact={false}
        />
      </ModalContent>
    </ModalContainer>
  )
}

export default InviteModal
