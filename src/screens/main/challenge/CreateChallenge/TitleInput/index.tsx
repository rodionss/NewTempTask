import React, { useRef } from 'react'
import { Control, FieldValues, useController } from 'react-hook-form'
import { THEME } from '../../../../../const'
import { Container, LengthRestriction, MultilineInput } from './atoms'

const TITLE_MAX_LENGTH = 48

type AutoCapitalize = 'sentences' | 'none' | 'words' | 'characters'

type Props = {
  name: string
  autoFocus?: boolean
  autoCorrect?: boolean
  autoCapitalize?: AutoCapitalize
  placeholder: string
  multiline?: boolean
  control: Control<FieldValues, Object>
}

function TitleInput({
  name,
  autoFocus = true,
  autoCorrect = false,
  autoCapitalize = 'sentences',
  placeholder,
  multiline = true,
  control,
}: Props) {
  const refInput = useRef(null)

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    defaultValue: '',
    name,
    rules: { required: true, maxLength: TITLE_MAX_LENGTH },
  })

  return (
    <Container
      error={Boolean(error)}
      onPress={() => {
        if (refInput.current) {
          refInput.current.focus()
        }
      }}
    >
      <LengthRestriction>{`${value.length}/${TITLE_MAX_LENGTH}`}</LengthRestriction>
      <MultilineInput
        ref={refInput}
        value={value}
        multiline={multiline}
        autoFocus={autoFocus}
        autoCorrect={autoCorrect}
        textAlignVertical='top'
        placeholderTextColor={THEME.formFieldPlaceholderColor}
        onChangeText={onChange}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        maxLength={TITLE_MAX_LENGTH}
      />
    </Container>
  )
}
export default TitleInput
