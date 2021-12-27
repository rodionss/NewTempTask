import React from 'react'
import {
  Container,
  Wrapper,
  Text,
  Button,
  ButtonText,
  SavedIcon,
} from './atoms'

type Props = {
  text: string
  buttonText: string
  onTooltipPress?: () => void
  onButtonPress: () => void
  saved: boolean
}

function Tooltip({
  text,
  buttonText = 'remind',
  onTooltipPress,
  onButtonPress,
  saved,
}: Props) {
  return (
    <Container>
      <Wrapper onPress={onTooltipPress || undefined}>
        {!saved && <SavedIcon />}
        <Text>{text}</Text>
        {!saved && (
          <Button onPress={onButtonPress}>
            <ButtonText>{buttonText}</ButtonText>
          </Button>
        )}
      </Wrapper>
    </Container>
  )
}

export default Tooltip
