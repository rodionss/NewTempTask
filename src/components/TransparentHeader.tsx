import { Text } from '@components/main'
import { STATUS_BAR_HEIGHT } from '@utils/functions'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const Container = styled.View`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: ${STATUS_BAR_HEIGHT + 44}px;
  flex-direction: row;
  padding: 0 20px;
  justify-content: space-between;
  align-items: flex-end;
`

const Button = styled.TouchableOpacity`
  height: 36px;
  min-width: 36px;
  padding: 4px;
  align-items: center;
  justify-content: center;
`

const ButtonText = styled(Text)`
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.65px;
  text-align: center;
  margin-top: 8px;
  text-transform: uppercase;
  color: #cdcdcd;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`

const Title = styled(Text)`
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

type ButtonType = {
  onPress: () => void
  icon: (props?: object) => Element
  text?: string
  textStyle?: object
  containerStyle?: object
  isLoading?: boolean
}

type HeaderType = {
  title: string
  leftButton?: ButtonType
  rightButton?: ButtonType
  containerStyle?: StyleProp<ViewStyle>
}

const RightButton = ({
  onPress,
  icon,
  text,
  textStyle,
  containerStyle,
}: ButtonType) => (
  <Button onPress={onPress} style={containerStyle}>
    {icon && icon()}
    {text ? <ButtonText style={textStyle}>{text}</ButtonText> : null}
  </Button>
)

const TransparentHeader = ({ title, leftButton, rightButton }: HeaderType) => {
  return (
    <Container>
      {leftButton ? (
        <Button {...leftButton}>{leftButton.icon()}</Button>
      ) : (
        <Button />
      )}

      <Title>{title}</Title>

      {rightButton ? <RightButton {...rightButton} /> : <Button />}
    </Container>
  )
}

export default TransparentHeader
