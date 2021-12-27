import React from 'react'
import { RemindType } from '@screens/main/feed/components/ReminderModal/domain'
import {
  Wrapper,
  TimePickerWrapper,
  TimeButton,
  ButtonText,
  ExactTimeButton,
} from './atoms'

type Props = {
  onTimeButtonPress: (remindType: RemindType) => void
  onExactPress: () => void
  setText: (text: string) => void
}

function DefaultPicker({ onTimeButtonPress, onExactPress, setText }: Props) {
  return (
    <Wrapper>
      <TimePickerWrapper>
        <TimeButton
          top
          onPress={() => {
            onTimeButtonPress(RemindType.HourHalf)
            setText(`Reminder set in 30 minutes`)
          }}
        >
          <ButtonText>In 30 minutes</ButtonText>
        </TimeButton>
        <TimeButton
          onPress={() => {
            onTimeButtonPress(RemindType.Hour)
            setText(`Reminder set in 1 hour`)
          }}
        >
          <ButtonText>In 1 hour</ButtonText>
        </TimeButton>
        <TimeButton
          bottom
          onPress={() => {
            onTimeButtonPress(RemindType.ThreeHours)
            setText(`Reminder set in 3 hours`)
          }}
        >
          <ButtonText>In 3 hours</ButtonText>
        </TimeButton>
      </TimePickerWrapper>

      <ExactTimeButton onPress={onExactPress}>
        <ButtonText>Set exact time</ButtonText>
      </ExactTimeButton>
    </Wrapper>
  )
}

export default DefaultPicker
