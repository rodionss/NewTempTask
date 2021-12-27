import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useState } from 'react'
import { Dimensions, ImageBackground, KeyboardAvoidingView } from 'react-native'
import HyperLink from 'react-native-hyperlink'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { useSelector, useStore } from 'react-redux'
import { change, Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import * as Yup from 'yup'
import { assetList } from '../../assets'
import { Checkbox } from '../../components'
import { OnboardingButton } from '../../components/buttons'

import { THEME, URLS } from '../../const'
import { getProfilePhoneRawForm, sendSmsCode } from '../../modules/auth'

import { STATUS_BAR_HEIGHT, validator } from '../../utils'
import FieldPhoneInput from './components/FieldPhoneInput'
const { height } = Dimensions.get('window')

const AuthorizationContainer = styled.View.attrs({
  bounces: false,
  contentContainerStyle: {
    height: '100%',
  },
})`
  height: 100%;
  background-color: ${THEME.primaryBackgroundColor};
`

const KeyboardView = styled(KeyboardAvoidingView).attrs({
  behavior: 'padding',
  contentContainerStyle: {
    marginTop: 'auto',
    height: '100%',
  },
})`
  flex: 1;
`

const Background = styled(ImageBackground).attrs({
  resizeMode: 'stretch',
})`
  width: 100%;
  position: absolute;
  height: ${height}px;
  align-items: center;
  z-index: -999;
  justify-content: center;
`

const BackgroundMessages = styled(ImageBackground).attrs({
  resizeMode: 'contain',
})`
  width: 100%;
  position: absolute;
  top: ${STATUS_BAR_HEIGHT * 2 + 100}px;
  height: ${STATUS_BAR_HEIGHT * 2 + 180}px;
  align-items: center;
  z-index: -999;
  justify-content: center;
`

const InputContainer = styled(LinearGradient).attrs({
  colors: ['#00000022', '#000'],
})`
  padding: 0 24px;
  padding-bottom: 24px;
  margin-top: auto;
`

const GradientContainer = styled(LinearGradient).attrs({
  colors: ['#00000077', '#000'],
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const TermsClickableContainer = styled.TouchableWithoutFeedback`
  width: 100%;
`

const TermsContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 12px;
`

const TermsText = styled.Text`
  font-size: 14px;
  margin-left: 9px;
  color: #999;
`

const ButtonContainer = styled.View`
  width: 100%;
  align-items: center;
  padding: 0 20px;
  padding-bottom: 50px;
  background-color: #000;
`

const Authorization = ({ navigation, handleSubmit }) => {
  const store = useStore()
  const phone = useSelector(getProfilePhoneRawForm)

  const [selectedCountry, selectCountry] = useState({
    cca2: 'US',
    callingCode: '1',
    mask: '(000) 000 0000',
  })

  const [isAgreeAge, setAgreeAge] = useState(false)
  const [isAgreeTerms, setAgreeTerms] = useState(false)
  const [inputFocused, setFocus] = useState(false)

  const isFullAgree = useMemo(
    () => isAgreeAge && isAgreeTerms && phone && phone.length > 0,
    [isAgreeAge, isAgreeTerms, phone],
  )

  return (
    <AuthorizationContainer>
      <Background
        source={
          STATUS_BAR_HEIGHT === 20
            ? assetList.regOnboardingBP
            : assetList.regOnboarding
        }
      />
      {inputFocused ? <GradientContainer /> : null}

      <KeyboardView>
        <InputContainer
          colors={
            inputFocused ? ['#00000022', '#000'] : ['#ffffff00', '#ffffff00']
          }
        >
          <Field
            autoFocus={false}
            label={'Your phone number'}
            name={'phoneRaw'}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            containerStyle={{ marginBottom: 8 }}
            selectedCountry={selectedCountry}
            selectCountry={selectCountry}
            autoCorrect={false}
            component={FieldPhoneInput}
            keyboardType={'phone-pad'}
          />

          <TermsClickableContainer onPress={() => setAgreeTerms(!isAgreeTerms)}>
            <TermsContainer>
              <Checkbox
                checked={isAgreeTerms}
                onPress={() => setAgreeTerms(!isAgreeTerms)}
              />
              <HyperLink
                linkDefault={false}
                linkStyle={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
                linkText={(url) =>
                  url === URLS.terms ? 'Terms of Service' : 'Privacy Policy'
                }
                onPress={(url) => InAppBrowser.open(url)}
              >
                <TermsText>
                  {`I accept myself, ${URLS.terms} and\n${URLS.privacyPolicy}`}
                </TermsText>
              </HyperLink>
            </TermsContainer>
          </TermsClickableContainer>

          <TermsClickableContainer onPress={() => setAgreeAge(!isAgreeAge)}>
            <TermsContainer>
              <Checkbox
                checked={isAgreeAge}
                onPress={() => setAgreeAge(!isAgreeAge)}
              />

              <TermsText>{'I confirm I am over 18 years old'}</TermsText>
            </TermsContainer>
          </TermsClickableContainer>
        </InputContainer>

        <ButtonContainer
          style={{ backgroundColor: inputFocused ? '#000' : 'transparent' }}
        >
          <OnboardingButton
            full
            text={'Start'}
            disabled={!isFullAgree}
            light={isFullAgree}
            onPress={handleSubmit((form) => {
              form.phone = (
                '+' +
                selectedCountry.callingCode[0] +
                form.phoneRaw
              ).replace(/ /g, '')
              store.dispatch(change('phone', form.phone))
              store.dispatch(sendSmsCode(form))
            })}
            // onPress={() => {
            //   isFullAgree && navigation.navigate('PhoneCodeRegistration')
            // }}
          />
        </ButtonContainer>
      </KeyboardView>
    </AuthorizationContainer>
  )
}
const schema = Yup.object().shape({
  phoneRaw: Yup.string().required('Please enter your phone number'),
})

export default reduxForm({
  form: 'profile',
  asyncValidate: validator(schema),
})(Authorization)
