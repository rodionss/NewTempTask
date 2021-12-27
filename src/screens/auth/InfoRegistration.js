import React from 'react'
import styled from 'styled-components'
import { Header } from '../../components'
import { OnboardingButton } from '../../components/buttons'
import { BackIcon } from '../../components/icons'
import { Text } from '../../components/main'
import { THEME } from '../../const'

const Container = styled.View`
  flex: 1;
  background-color: #000;
`
const ButtonContainer = styled.View`
  margin-top: auto;
  padding: 0 20px;
  width: 100%;
`

const RegContainer = styled.View`
  flex: 1;
  padding-bottom: 32px;
  border-top-left-radius: 34px;
  border-top-right-radius: 34px;
  background-color: ${THEME.secondaryBackgroundColor};
  justify-content: space-between;
`

const TextsContainer = styled.View`
  padding: 0 20px;
  padding-top: 24px;
`
const Title = styled(Text)`
  font-weight: bold;
  font-size: 20px;
  color: #fafafa;
`

const ItemContainer = styled.View`
  flex-direction: row;
  margin-top: 12px;
`

const NumberText = styled(Text)`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-right: 8px;
  color: rgba(250, 250, 250, 0.6);
`

const InfoText = styled(Text)`
  font-size: 15px;
  width: 95%;
  line-height: 24px;
  color: #fafafa;
`

const texts = [
  'You see this, so it is assumed that you already have the Happyō application installed, but you have not copied the invitation code.',
  'Please follow your unique invite link\nto activate it.',
  'If the link does not lead to the application automatically, you must go to it from the web page you are on by clicking the corresponding button. It is usually located at the top of the screen.',
  'This will take you to the next steps - verification and registration.',
]

const InfoRegistration = ({ navigation }) => {
  return (
    <Container>
      <Header
        title={'REGISTRATION INFO'}
        leftButton={{
          icon: BackIcon,
          onPress: () => navigation.goBack(),
        }}
      />
      <RegContainer>
        <TextsContainer>
          <Title>How to register</Title>
          {texts.map((text, i) => (
            <ItemContainer>
              <NumberText>{i + 1}.</NumberText>
              <InfoText>{text}</InfoText>
            </ItemContainer>
          ))}
          <InfoText style={{ marginTop: 16 }}>
            {
              'Thank you for joining Happyō! There are a few inches left to bring joy around you.'
            }
          </InfoText>
        </TextsContainer>
        <ButtonContainer>
          <OnboardingButton
            light={false}
            disabled={false}
            text={'UNDERSTOOD'}
            onPress={() => {
              navigation.goBack()
            }}
          />
        </ButtonContainer>
      </RegContainer>
    </Container>
  )
}

export default InfoRegistration
