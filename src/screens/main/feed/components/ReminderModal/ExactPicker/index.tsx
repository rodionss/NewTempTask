import React, { useCallback, useState } from 'react'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import { HOUR_MINUTES, DAY_HOURS } from '@utils/time'
import { RemindType } from '@screens/main/feed/components/ReminderModal/domain'
import {
  DayPickerButton,
  DayPickerButtonText,
  DayPickerWrapper,
  RemindButton,
  RemindButtonText,
  Wrapper,
} from './atoms'

enum Day {
  Today = 'today',
  Tomorrow = 'tomorrow',
}

type Props = {
  onTimeButtonPress: (remindType: RemindType, remindTime?: number) => void
  setText: (text: string) => void
}

function ExactPicker({ onTimeButtonPress, setText }: Props) {
  const [date, setDate] = useState(new Date())
  const [day, setDay] = useState(Day.Today)

  const onChange = (event: Event, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date
    setDate(currentDate)
  }

  const onTodayButtonPress = () => setDay(Day.Today)
  const onTomorrowButtonPress = () => setDay(Day.Tomorrow)

  const todaySelected = day === Day.Today
  const tomorrowSelected = day === Day.Tomorrow

  const remindButtonText = `Remind ${day} at ${moment(date).format('HH:mm')}`

  const onPress = useCallback(() => {
    const selected = day === Day.Today ? moment(date) : moment(date).add(1, 'days')
    setText(`Reminder set ${day} at ${selected.format('HH:mm')}`)
    onTimeButtonPress(RemindType.Custom, selected)
  }, [date, day])

  return (
    <Wrapper>
      <DayPickerWrapper>
        <DayPickerButton selected={todaySelected} onPress={onTodayButtonPress}>
          <DayPickerButtonText selected={todaySelected}>
            Today
          </DayPickerButtonText>
        </DayPickerButton>
        <DayPickerButton
          selected={tomorrowSelected}
          onPress={onTomorrowButtonPress}
        >
          <DayPickerButtonText selected={tomorrowSelected}>
            Tomorrow
          </DayPickerButtonText>
        </DayPickerButton>
      </DayPickerWrapper>
      <DateTimePicker
        mode='time'
        is24Hour={false}
        display='spinner'
        value={date}
        onChange={onChange}
        textColor='#fff'
      />
      <RemindButton onPress={onPress}>
        <RemindButtonText>{remindButtonText}</RemindButtonText>
      </RemindButton>
    </Wrapper>
  )
}

export default ExactPicker
