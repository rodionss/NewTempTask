import Clipboard from '@react-native-community/clipboard'
import * as R from 'ramda'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState, Keyboard } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import CountDown from 'react-native-countdown-component'
import Hyperlink from 'react-native-hyperlink'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import { change, Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import * as Yup from 'yup'
import { Checkbox, Header, LabeledFieldInput } from '../../components'
import { OnboardingButton } from '../../components/buttons'
import { BackIcon } from '../../components/icons'
import { Container, Link, Text } from '../../components/main'
import { THEME, URLS } from '../../const'
import {
  sendCode,
  sendSmsCode,
  signup,
  verifyInviteCode,
} from '../../modules/auth/duck'
import { getIsLodaingEmail, getProfileForm } from '../../modules/auth/selectors'
import { useAnalytics, validator, withAmplitude } from '../../utils/functions'
import UploadAvatar from '../main/profile/components/UploadAvatar'
import FieldPhoneInput from './components/FieldPhoneInput'

const FocusOut = styled.TouchableWithoutFeedback`
  flex: 1;
`

const CodePhoneTextContainer = styled.View`
  width: 50px;
  height: 50px;
  border-width: 1px;
  border-radius: 12px;
  border-color: ${({ isFocused }) =>
    isFocused ? THEME.formFieldValueColor : THEME.tabBarTintColor};
  padding-top: 8;
  background-color: ${THEME.secondaryBackgroundColor};
`

const CodePhoneText = styled(Text)`
  font-weight: bold;
  font-size: 24px;
  text-align: center;
`

const InviteCodeTextContainer = styled.View`
  width: 40px;
  height: 40px;
  border-width: 1px;
  border-radius: 12px;
  border-color: ${({ isFocused }) =>
    isFocused ? THEME.formFieldValueColor : THEME.tabBarTintColor};
  padding-top: 4;
  background-color: ${THEME.secondaryBackgroundColor};
`

const InviteCodeText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`

const ContainerPhoto = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`

const InputContainer = styled.View`
  width: 100%;
  margin-top: 32px;
  padding: 0 20px;
`

const ButtonContainer = styled.View`
  margin-top: 20px;
  margin-bottom: auto;
  padding: 0 20px;
  width: 100%;
`

const RegContainer = styled(Container)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  justify-content: space-between;
`

const TermsClickableContainer = styled.TouchableWithoutFeedback`
  width: 100%;
`

const TermsContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 20px;
  padding-left: 20px;
`

const TermsText = styled.Text`
  font-size: 14px;
  margin-left: 9px;
  color: #999;
`

const PhoneRegistrationDumb = ({
  navigation,
  handleSubmit,
  sendSmsCode,
  isRegistration,
  isLoading,
  change,
}) => {
  const [selectedCountry, selectCountry] = useState({
    cca2: 'US',
    callingCode: '1',
  })

  const [isAgreeAge, setAgreeAge] = useState(!isRegistration)
  const [isAgreeTerms, setAgreeTerms] = useState(!isRegistration)

  const isFullAgree = useMemo(
    () => isAgreeAge && isAgreeTerms,
    [isAgreeAge, isAgreeTerms],
  )

  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <RegContainer>
        <Header
          leftButton={{
            onPress: () => navigation.goBack(),
            icon: BackIcon,
          }}
          title={isRegistration ? 'SIGN UP' : 'SIGN IN'}
        />

        <InputContainer>
          <Field
            autoFocus={false}
            label={'Your phone number'}
            name={'phoneRaw'}
            selectedCountry={selectedCountry}
            selectCountry={selectCountry}
            autoCorrect={false}
            component={FieldPhoneInput}
            keyboardType={'phone-pad'}
          />
        </InputContainer>
        {isRegistration && (
          <>
            <TermsClickableContainer
              onPress={() => setAgreeTerms(!isAgreeTerms)}
            >
              <TermsContainer>
                <Checkbox
                  checked={isAgreeTerms}
                  onPress={() => setAgreeTerms(!isAgreeTerms)}
                />
                <Hyperlink
                  linkDefault={false}
                  linkStyle={{ color: '#fff' }}
                  linkText={(url) =>
                    url === URLS.terms ? 'terms of service' : 'privacy policy'
                  }
                  onPress={(url) => InAppBrowser.open(url)}
                >
                  <TermsText>
                    {`I accept myself, ${URLS.terms} and ${URLS.privacyPolicy}`}
                  </TermsText>
                </Hyperlink>
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
          </>
        )}
        <ButtonContainer>
          <OnboardingButton
            light={true}
            text={'NEXT STEP'}
            loading={isLoading}
            disabled={!isFullAgree}
            onPress={handleSubmit((form) => {
              form.phone = '+' + selectedCountry.callingCode[0] + form.phoneRaw
              change('phone', form.phone)
              sendSmsCode(form)
            })}
          />
        </ButtonContainer>
      </RegContainer>
    </FocusOut>
  )
}

const phoneSchema = Yup.object().shape({
  phoneRaw: Yup.string().required('Please enter your phone number'),
})

export const PhoneRegistration = R.compose(
  withAmplitude('Phone screen shown'),
  connect(
    R.applySpec({
      profile: getProfileForm,
      isLoading: getIsLodaingEmail,
    }),
    { sendSmsCode, change },
  ),
  reduxForm({
    form: 'profile',
    destroyOnUnmount: true,
    asyncValidate: validator(phoneSchema),
  }),
)(PhoneRegistrationDumb)

const ResendCodeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  height: 44px;
`
const ResendText = styled(Text)`
  font-size: 14px;
  color: #7d7d7d;
`
const ResendButton = styled(Link)`
  margin-left: 4px;
`

const ResendButtonText = styled(Text)`
  font-size: 14px;
  color: ${({ disabled }) => (disabled ? '#7d7d7d' : '#fff')};
`

const CountdownText = styled(Text)`
  font-size: 14px;
  color: #7d7d7d;
  margin-left: -8px;
`

const digitTxtStyle = {
  color: '#7d7d7d',
  fontSize: 14,
  marginTop: 14,
  marginLeft: -8,
  fontWeight: 'bold',
}

const CodePhoneRegistrationDumb = ({
  sendCode,
  isLoading,
  navigation,
  handleSubmit,
  sendSmsCode,
  change,
}) => {
  const [value, setValue] = useState('')
  const [canResend, setCanResend] = useState(false)
  const ref = useBlurOnFulfill({ value, cellCount: 6 })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })
  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <RegContainer>
        <Header
          leftButton={{
            onPress: () => navigation.goBack(),
            icon: BackIcon,
          }}
          title='SMS CODE'
        />

        <InputContainer>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={(value) => {
              setValue(value)
              change('code', value)
            }}
            cellCount={6}
            onEndEditing={() =>
              value.length === 6 ? handleSubmit(sendCode)() : null
            }
            keyboardType='number-pad'
            renderCell={({ index, symbol, isFocused }) => (
              <CodePhoneTextContainer key={index} isFocused={isFocused}>
                <CodePhoneText onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </CodePhoneText>
              </CodePhoneTextContainer>
            )}
          />
          <ResendCodeContainer>
            <ResendText>Didn’t receive it?</ResendText>
            <ResendButton
              disabled={!canResend}
              onPress={handleSubmit((from) => {
                setCanResend(false)
                sendSmsCode(from)
              })}
            >
              <ResendButtonText disabled={!canResend}>
                {'Tap to send '}
              </ResendButtonText>
            </ResendButton>
            {canResend ? null : (
              <>
                <ResendText>(</ResendText>
                <CountDown
                  size={14}
                  until={59}
                  timeToShow={['S']}
                  showSeparator={false}
                  digitStyle={{ width: 14 }}
                  digitTxtStyle={digitTxtStyle}
                  onFinish={() => setCanResend(true)}
                />
                <CountdownText>{'sec )'}</CountdownText>
              </>
            )}
          </ResendCodeContainer>
        </InputContainer>

        <ButtonContainer>
          <OnboardingButton
            light={true}
            loading={isLoading}
            disabled={true}
            text={'NEXT STEP'}
            onPress={handleSubmit(sendCode)}
          />
        </ButtonContainer>
      </RegContainer>
    </FocusOut>
  )
}

const codePhoneSchema = Yup.object().shape({
  code: Yup.string(),
})

export const CodePhoneRegistration = R.compose(
  withAmplitude('Phone code screen shown'),
  connect(R.applySpec({ profile: getProfileForm }), { sendCode, change }),
  reduxForm({
    form: 'profile',
    destroyOnUnmount: true,
    asyncValidate: validator(codePhoneSchema),
  }),
)(CodePhoneRegistrationDumb)

const PasteButton = styled(Link)`
  margin-top: 20px;
`
const PasteButtonText = styled(Text)`
  font-size: 15px;
  color: ${THEME.textColor};
`

const InviteCodeRegistrationDumb = ({
  isFocused,
  navigation,
  verifyInviteCode,
}) => {
  const logEvent = useAnalytics()

  const [value, setValue] = useState('')
  const [clipboardContent, setClipboardContent] = useState('')
  const [currentAppState, setCurrentAppState] = useState(AppState.currentState)
  const ref = useBlurOnFulfill({ value, cellCount: 8 })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  useEffect(() => {
    AppState.addEventListener('change', setCurrentAppState)
    return () => AppState.removeEventListener('change')
  }, [])

  useEffect(() => {
    if (isFocused && currentAppState === 'active')
      Clipboard.getString().then(setClipboardContent)
  }, [isFocused, currentAppState])

  const onPressPaste = useCallback(() => {
    setValue(clipboardContent)
  })

  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <RegContainer>
        <Header
          leftButton={{
            onPress: () => navigation.goBack(),
            icon: BackIcon,
          }}
          title='INVITE CODE'
        />

        <InputContainer>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={8}
            onEndEditing={() => {
              if (value.length === 8) {
                verifyInviteCode(value)
                logEvent('Registration - invite code input')
              }
            }}
            renderCell={({ index, symbol, isFocused }) => (
              <InviteCodeTextContainer key={index} isFocused={isFocused}>
                <InviteCodeText onLayout={getCellOnLayoutHandler(index)}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </InviteCodeText>
              </InviteCodeTextContainer>
            )}
          />
          {clipboardContent.length === 8 ? (
            <PasteButton onPress={onPressPaste}>
              <PasteButtonText>
                <PasteButtonText style={{ fontWeight: 'bold' }}>
                  {clipboardContent}
                </PasteButtonText>
                {' click here for paste'}
              </PasteButtonText>
            </PasteButton>
          ) : null}
        </InputContainer>
        <ButtonContainer>
          <OnboardingButton
            light={true}
            disabled={true}
            text={'NEXT STEP'}
            onPress={() => {
              verifyInviteCode(value)
            }}
          />
        </ButtonContainer>
      </RegContainer>
    </FocusOut>
  )
}

export const InviteCodeRegistration = R.compose(
  withNavigationFocus,
  connect(undefined, { verifyInviteCode }),
)(InviteCodeRegistrationDumb)

const KeyboardContainer = styled.KeyboardAvoidingView.attrs({
  behavior: 'padding',
  keyboardVerticalOffset: 20,
})`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
`

const ScrollContainer = styled.ScrollView.attrs({
  bounces: false,
  contentContainerStyle: {
    paddingBottom: 64,
  },
})`
  width: 100%;
`

const BioRegistrationDumb = ({
  navigation,
  handleSubmit,
  signup,
  isLoading,
  change,
}) => {
  const scrollRef = useRef(null)
  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <KeyboardContainer>
        <Header
          leftButton={{
            onPress: () => navigation.goBack(),
            icon: BackIcon,
          }}
          title='CREATE PROFILE'
        />

        <ScrollContainer ref={scrollRef}>
          <ContainerPhoto>
            <UploadAvatar
              onPress={(uri) => {
                change('newAvatarUri', uri)
              }}
            />
          </ContainerPhoto>
          <InputContainer>
            <Field
              autoFocus={false}
              label={'Real name'}
              name={'name'}
              placeholder={'Will Smith'}
              style={{ height: 64 }}
              autoCorrect={false}
              component={LabeledFieldInput}
            />
          </InputContainer>
          <InputContainer>
            <Field
              autoFocus={false}
              label={'Unique username'}
              name={'username'}
              placeholder={'willy'}
              prefix={'@'}
              style={{ height: 64 }}
              autoCorrect={false}
              autoCapitalize={false}
              component={LabeledFieldInput}
            />
          </InputContainer>
          <InputContainer>
            <Field
              autoFocus={false}
              label={'Bio'}
              name={'bio'}
              multiple={true}
              onFocus={() => scrollRef.current.scrollToEnd()}
              placeholder={'Producer of my own happiness'}
              style={{ height: 72 }}
              autoCorrect={false}
              multiline={true}
              component={LabeledFieldInput}
            />
          </InputContainer>
        </ScrollContainer>
        <ButtonContainer>
          <OnboardingButton
            light={true}
            loading={isLoading}
            text={'SAVE'}
            onPress={handleSubmit(signup)}
          />
        </ButtonContainer>
      </KeyboardContainer>
    </FocusOut>
  )
}

const bioSchema = Yup.object().shape({
  username: Yup.string().required('Username is a required field'),
  name: Yup.string().required('Name is a required field'),
  bio: Yup.string().required('Bio is a required field'),
})

export const BioRegistration = R.compose(
  withAmplitude('Bio screen shown'),
  connect(R.applySpec({ profile: getProfileForm }), { signup, change }),
  reduxForm({
    form: 'profile',
    destroyOnUnmount: true,
    asyncValidate: validator(bioSchema),
  }),
)(BioRegistrationDumb)
