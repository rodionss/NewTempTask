import React from 'react'
import styled from 'styled-components'
import { assetList } from '../assets'
import { THEME } from '../const'

const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
})`
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid ${({ checked }) => (checked ? '#fff' : THEME.formFieldBorderColor)};
  background-color: #161818;
`

const Checkmark = styled.Image.attrs({
  source: assetList.checkmark,
})`
  width: 10px;
  height: 8px;
  tint-color: #fff;
`

const Checkbox = ({ checked, onPress }) => (
  <Container checked={checked} onPress={onPress}>
    {checked && <Checkmark />}
  </Container>
)

export default Checkbox
