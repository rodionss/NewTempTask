import React, { useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  Button,
  ButtonText,
  Container,
  HeaderSize,
  Loader,
  Summary,
  Title,
} from './atoms'

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
  summary?: string
  caps?: boolean
  size?: HeaderSize
  containerStyle?: StyleProp<ViewStyle>
  rounded?: boolean
}

function RightButton({
  onPress,
  isLoading,
  icon,
  text,
  textStyle,
  containerStyle,
}: ButtonType) {
  const showText = text && !icon

  if (isLoading) {
    return <Loader />
  }

  return (
    <Button onPress={onPress} style={containerStyle}>
      {icon && icon()}
      {showText && <ButtonText style={textStyle}>{text}</ButtonText>}
    </Button>
  )
}

function Header({
  title,
  leftButton,
  rightButton,
  summary,
  containerStyle = {},
  caps = true,
  size = HeaderSize.Main,
  rounded,
}: HeaderType) {
  const middleSection = useMemo(() => {
    if (summary) {
      return <Summary>{summary}</Summary>
    }

    if (title) {
      return <Title caps={caps}>{title}</Title>
    }

    return <Button />
  }, [summary, title, caps])

  return (
    <Container style={containerStyle} size={size} rounded={rounded}>
      {leftButton ? (
        <Button onPress={leftButton.onPress}>{leftButton.icon()}</Button>
      ) : (
        <Button />
      )}

      {middleSection}

      {rightButton ? <RightButton {...rightButton} /> : <Button />}
    </Container>
  )
}

export default Header
