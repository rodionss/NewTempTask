import React from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'
import { THEME } from '../const'
import { CrossInInput, SearchIcon } from './icons'
import { Link } from './main'

const SearchHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 15px;
  margin: 10px 20px 10px 20px;
  background-color: #333232;
  border-radius: 20px;
  height: 46px;
`

const Input = styled.TextInput`
  margin-left: 15px;
  flex: 1;
  align-self: stretch;
  font-size: 15px;
  font-weight: 500;
  color: ${THEME.formFieldValueColor};
`

const CrossButton = styled(Link)`
  width: 24px;
  height: 24px;
`

type Props = {
  innerRef?: React.Ref<TextInput>
  value: string
  placeholder?: string
  onChangeText: (text: string) => void
  onPressCross: () => void
  onFocus: () => void
}

const SearchInput = ({
  innerRef,
  value,
  placeholder,
  onChangeText,
  onPressCross,
  onFocus,
  ...props
}: Props) => (
  <SearchHeaderContainer>
    <SearchIcon color={THEME.formFieldValueColor} />
    <Input
      ref={innerRef}
      value={value}
      placeholder={placeholder}
      autoCorrect={false}
      placeholderTextColor='#919191'
      autoCompleteType='off'
      autoCapitalize='none'
      onChangeText={onChangeText}
      onFocus={onFocus}
      {...props}
    />

    {value ? (
      <CrossButton onPress={onPressCross}>
        <CrossInInput />
      </CrossButton>
    ) : null}
  </SearchHeaderContainer>
)

export default SearchInput
