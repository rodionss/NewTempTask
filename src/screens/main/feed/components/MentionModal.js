import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'
import { UserItem } from '../../../../components'
import { ModalContainer, Text } from '../../../../components/main'
import { THEME } from '../../../../const'

const ModalContent = styled.View`
  width: ${Dimensions.get('window').width}px;
  margin-top: auto;
  padding-top: 12px;
  padding-bottom: 44px;
  align-items: center;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: ${THEME.secondaryBackgroundColor};
  z-index: 9999;
`

const SwipeIndicator = styled.View`
  align-self: center;
  height: 5px;
  width: 25%;
  background-color: #ffffff;
  border-radius: 100px;
`

const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  align-self: center;
  margin-top: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #fafafa;
`

const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: rgba(71, 70, 70, 0.6);
`

const MentionModal = ({
  isVisible,
  myId,
  users = [],
  onPressClose,
  onPressUser,
}) => {
  return (
    <ModalContainer
      isVisible={isVisible}
      swipeDirection={'down'}
      onSwipeTreshold={400}
      onSwipeComplete={onPressClose}
      onBackdropPress={onPressClose}
    >
      <ModalContent>
        <SwipeIndicator />
        <Title>{'In this game'}</Title>
        <Separator />
        {users &&
          users.map((user) => (
            <UserItem
              user={user}
              onPress={() => {
                onPressUser(user)
                onPressClose()
              }}
            />
          ))}
      </ModalContent>
    </ModalContainer>
  )
}

export default MentionModal
