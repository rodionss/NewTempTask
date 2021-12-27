import React, { useRef } from 'react'
import styled from 'styled-components'
import { THEME } from '../const'
import { Text } from './main'

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: 100%;
  z-index: 99px;
  flex-direction: column;
`

const Label = styled(Text)`
  font-size: 14px;
  color: ${THEME.formFieldTitleColor};
`

const InputContainer = styled.View`
  width: 100%;
  flex-direction: row;
  height: 48px;
  border-radius: 20px;
  align-items: center;
  margin-top: 12px;
  border: 1px solid ${THEME.formFieldTitleColor};
  background-color: ${THEME.secondaryBackgroundColor};
`

const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${THEME.tabBarTintColor};
`

const Input = styled.TextInput`
  min-width: ${({ postfix }) => (postfix ? '10%' : '90%')};
  font-size: 18px;
  padding-left: 12px;
  color: ${THEME.formFieldValueColor};
`

const MultilineInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  padding-left: 12px;
  padding-top: 12px;
  border-radius: 20px;
  margin-top: 12px;
  min-height: 44px;
  max-height: 144px;
  border: 1px solid ${THEME.formFieldTitleColor};
  background-color: ${THEME.secondaryBackgroundColor};
  color: ${THEME.formFieldValueColor};
`

const ErrorContainer = styled.View`
  /* padding-bottom: 20px; */
`

const Error = styled.Text`
  font-size: 14px;
  margin-top: 14px;
  color: #bf3a28;
`

const AdditionalInfoContainer = styled.View`
  width: 100%;
  height: 18px;
  margin-top: 14px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const AdditionalInfo = styled.Text`
  font-size: 14px;
  color: #abb4be;
  opacity: 0.8;
`

const Counter = styled.Text`
  font-size: 14px;
  color: #abb4be;
  opacity: 0.8;
`

const Prefix = styled.Text`
  font-size: 21px;
  margin-left: 16px;
  margin-right: -10px;
  color: ${THEME.textColor};
`

const RowContainer = styled.View`
  flex-direction: row;
  padding: 0 16px;
  justify-content: space-between;
`

const UpperCounter = styled(Text)`
  font-size: 14px;
  color: ${THEME.formFieldTitleColor};
`

const LabeledFieldInput = ({
  name,
  label,
  ref,
  info,
  meta: { touched, error, submitFailed },
  meta,
  count,
  postfix,
  autoFocus = true,
  placeholder,
  prefix,
  keyboardType,
  multiline,
  onPress,
  input: { onChange, value, onBlur, ...input },
  ...props
}) => {
  const refInput = useRef(null)
  const isError = touched && !!error && submitFailed
  return (
    <Container
      onPress={() => {
        refInput.current && refInput.current.focus()
        onPress && onPress()
      }}
    >
      <RowContainer>
        <Label>{label}</Label>
        {count ? (
          <UpperCounter>
            {value.length}/{count}
          </UpperCounter>
        ) : null}
      </RowContainer>
      {multiline ? (
        <MultilineInput
          {...input}
          ref={refInput}
          postfix={postfix}
          name={name}
          value={value}
          autoFocus={autoFocus}
          textAlignVertical={'top'}
          placeholderTextColor={THEME.formFieldPlaceholderColor}
          onChangeText={onChange}
          placeholder={placeholder}
          multiline={true}
          {...props}
        />
      ) : (
        <InputContainer error={meta && isError}>
          {prefix && <Prefix>{prefix}</Prefix>}
          <Input
            {...input}
            postfix={postfix}
            name={name}
            value={value}
            autoFocus={autoFocus}
            autoCorrect={false}
            autoComplete={false}
            placeholderTextColor={THEME.formFieldPlaceholderColor}
            onEndEditing={onBlur}
            onChangeText={onChange}
            placeholder={placeholder}
            ref={refInput}
            keyboardType={keyboardType || 'default'}
            {...props}
          />
        </InputContainer>
      )}

      {isError ? (
        meta ? (
          <ErrorContainer>
            <Error>{error}</Error>
          </ErrorContainer>
        ) : (
          <ErrorContainer>
            <AdditionalInfoContainer>
              {info && <AdditionalInfo>{info}</AdditionalInfo>}
              {count && (
                <Counter>
                  {value.length}/{count}
                </Counter>
              )}
            </AdditionalInfoContainer>
          </ErrorContainer>
        )
      ) : null}
    </Container>
  )
}
export default LabeledFieldInput
