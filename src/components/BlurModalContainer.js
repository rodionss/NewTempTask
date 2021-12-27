import { BlurView } from '@react-native-community/blur'
import React from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components'
import { OnboardingButton } from '.'
import { Text } from './main'

const BlurContainer = styled(BlurView).attrs({
  blurType: 'dark',
  blurAmount: 10,
})`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  justify-content: center;
  align-items: center;
`

const TouchableTutorialContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`

export const BlurModalContainer = ({ onPress, visible, children }) =>
  visible ? (
    <TouchableTutorialContainer onPress={onPress}>
      <BlurContainer>{children}</BlurContainer>
    </TouchableTutorialContainer>
  ) : null

const SwipeAnim = styled(FastImage)`
  width: 100%;
  height: 200px;
`

const SwipeTitle = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: #ff430e;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
`
const SwipeDesc = styled(SwipeTitle)`
  color: #fff;
`

export const SwipeTutorial = ({ anim, up, text, textInfo, ...props }) => (
  <BlurModalContainer {...props}>
    <SwipeAnim style={{ marginBottom: up ? 0 : -44 }} source={anim} />
    <SwipeTitle>{text}</SwipeTitle>
    <SwipeDesc>{textInfo}</SwipeDesc>
  </BlurModalContainer>
)
const ModalContent = styled.ImageBackground`
  width: 100%;
  height: ${({ source }) => (source ? 500 : 'auto')};
  justify-content: flex-end;
  background-color: #1f1f1f;
  border-radius: 32px;
`

// const ImageModal = styled.Image.attrs({
//   resizeMode: 'contain',
// })`
//   border-radius: 35px;
//   width: 100%;
//   height: 100%;
//   margin-top: -14%;

// `

const InfoButtonContainer = styled.View`
  padding: 36px 20px;
`

const InfoTextTitle = styled(Text)`
  font-weight: 600;
  font-size: 24px;
  letter-spacing: 0.5px;
  line-height: 34px;
  margin-bottom: 8px;
  text-align: center;
  color: #ffffff;
`
const InfoText = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 24px;
  text-align: center;
  color: #cdcdcd;
`

export const InfoModal = ({
  text,
  textInfo,
  visible,
  buttonText,
  onPress,
  image,
}) => (
  <BlurModalContainer visible={visible} onPress={onPress}>
    <ModalContent source={image}>
      <InfoButtonContainer>
        <InfoTextTitle>{text}</InfoTextTitle>
        <InfoText>{textInfo}</InfoText>
        <OnboardingButton light={false} text={buttonText} onPress={onPress} />
      </InfoButtonContainer>
    </ModalContent>
  </BlurModalContainer>
)
