import React from 'react'
import { Picker } from '@react-native-community/picker'
import { THEME } from '../const'

const FieldSelectInput = ({
  input: { onChange, value, ...input },
  values,
  ...props
}) => {
  return (
    <Picker
      {...input}
      {...props}
      style={{ width: '100%' }}
      selectedValue={value}
      itemStyle={{ color: THEME.primaryBackgroundColor }}
      onValueChange={onChange}
    >
      {values.map((item) => (
        <Picker.Item
          key={item.value}
          color={THEME.textColor}
          label={item.label}
          value={item.value}
        />
      ))}
    </Picker>
  )
}
export default FieldSelectInput
