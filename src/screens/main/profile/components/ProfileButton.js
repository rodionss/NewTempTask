import React from 'react'
import styled from 'styled-components'
import { assetList } from '../../../../assets'
import { Text, Link } from '../../../../components/main'

const Button = styled(Link)`
  flex-direction: row;
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
`

const TextContainer = styled.View``

const ButtonText = styled(Text)`
  font-size: 15px;
`

const AdditionalText = styled(Text)`
  font-size: 12px;
  margin-top: 4px;
`

const Chevron = styled.Image.attrs({
  source: assetList.chevron,
  resizeMode: 'contain',
})`
  width: 10px;
  height: 10px;
  transform: rotate(180deg);
`

const ProfileButton = ({ text, onPress, color, info, last }) => (
  <Button last={last} onPress={onPress}>
    <TextContainer>
      <ButtonText color={color}>{text}</ButtonText>
      {info && <AdditionalText>{info}</AdditionalText>}
    </TextContainer>
    <Chevron />
  </Button>
)

export default ProfileButton
