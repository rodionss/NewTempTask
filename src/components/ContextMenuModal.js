import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'
import { ModalContainer, Text } from './main'
import { THEME } from '../const'

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

export const SwipeIndicator = styled.View`
  align-self: center;
  height: 5px;
  margin-bottom: 16px;
  width: 25%;
  background-color: #ffffff;
  border-radius: 100px;
`

const MenuButton = styled.TouchableOpacity`
  width: 90%;
  height: 56px;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  margin: 6px 0;
  flex-direction: row;
  background-color: #333232;
  border-radius: 24px;
`

const TextButton = styled(Text)`
  font-weight: 500;
  font-size: 18px;
  margin-left: 8px;
  color: ${({ disabled }) => (disabled ? '#777' : '#FFFFFF')};
`

const ContextMenuModal = ({
  isVisible,
  onPressClose,
  children,
  buttons = [],
  onModalHide = () => {},
}) => {
  return (
    <ModalContainer
      isVisible={!!isVisible}
      swipeDirection={'down'}
      onSwipeTreshold={400}
      onSwipeComplete={onPressClose}
      onBackdropPress={onPressClose}
      onModalHide={onModalHide}
    >
      <ModalContent>
        <SwipeIndicator />
        {buttons.map((params) =>
          params ? (
            <MenuButton
              key={params.title}
              style={params.style}
              disabled={params.isLoading}
              onPress={params.onPress ? params.onPress : params.onPressClose}
            >
              {params.icon}
              <TextButton style={params.styleText} disabled={params.isLoading}>
                {params.title}
              </TextButton>
            </MenuButton>
          ) : null,
        )}
      </ModalContent>
      {children}
    </ModalContainer>
  )
}

export default ContextMenuModal
