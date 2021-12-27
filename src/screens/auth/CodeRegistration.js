import React, { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView } from 'react-native'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field'
import CountDown from 'react-native-countdown-component'
import { withNavigationFocus } from 'react-navigation'
import { useDispatch, useSelector } from 'react-redux'
import { change } from 'redux-form'
import styled from 'styled-components'
import { Header } from '../../components'
import { OnboardingButton } from '../../components/buttons'
import { BackIcon, InviteLinkIcon } from '../../components/icons'
import { Link, Text } from '../../components/main'
import { THEME } from '../../const'
import {
  getIsLoadingSmsCode,
  getProfileForm,
  sendCode,
} from '../../modules/auth'
import { sendSmsCode } from '../../modules/auth/duck'

const Container = styled.View`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
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
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: ${THEME.secondaryBackgroundColor};
`

const Label = styled(Text)`
  font-weight: 500;
  font-size: 13px;
  margin-left: 16px;
  margin-bottom: 12px;
  color: rgba(250, 250, 250, 0.6);
`

const InfoContainer = styled.View`
  margin-top: 40%;
  align-self: center;
  align-items: center;
`
const InviteInfoTitle = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 28px;
  line-height: 36px;
  color: #fafafa;
`
const RequestInviteText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  align-self: center;
  text-align: center;
`
const RequestInviteButton = styled(Link)`
  align-items: center;
  margin: 25px 0;
`

const RequestInviteButtonText = styled(RequestInviteText)`
  font-weight: bold;
  margin-top: 4px;
  font-size: 16px;
  color: #fafafa;
  letter-spacing: 1.5px;
`

const InviteCodeRegistrationDumb = ({ navigation }) => (
  <Container>
    <Header
      leftButton={{
        icon: BackIcon,
        onPress: () => navigation.goBack(),
      }}
      title='USE INVITE'
    />
    <RegContainer>
      <InfoContainer>
        <InviteLinkIcon />
        <InviteInfoTitle>
          {'Follow the invite link'}
        </InviteInfoTitle>
        <RequestInviteText style={{ marginTop: 12 }}>
          {'Please open the invite message that you got and press the second link to continue'}
        </RequestInviteText>
      </InfoContainer>
      <ButtonContainer>
        <RequestInviteButton
          onPress={() => {
            navigation.push('NotificationRegistration')
          }}
        >
          <RequestInviteText>
            {"Haven't received your invitation yet?"}
          </RequestInviteText>
          <RequestInviteButtonText>{'GET AN INVITE'}</RequestInviteButtonText>
        </RequestInviteButton>
      </ButtonContainer>
    </RegContainer>
  </Container>
)

const FocusOut = styled.TouchableWithoutFeedback`
  flex: 1;
`
const KeyboardView = styled(KeyboardAvoidingView).attrs({
  behavior: 'padding',
})`
  flex: 1;
  background-color: #000;
`

const InputContainer = styled.View`
  width: 100%;
  margin-top: 32px;
  padding: 0 20px;
`

const ResendCodeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
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

const CodePhoneTextContainer = styled.View`
  width: 50px;
  height: 50px;
  border-width: 2px;
  border-radius: 16px;
  border-color: ${({ isFocused }) =>
    isFocused ? THEME.formFieldValueColor : THEME.formFieldBorderColor};
  padding-top: 6px;
  background-color: #161818;
`

const CodePhoneText = styled(Text)`
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
`

const PhoneCodeRegistrationDumb = ({ navigation }) => {
  const dispatch = useDispatch()
  const profileForm = useSelector(getProfileForm)
  const isLoadingSmsCode = useSelector(getIsLoadingSmsCode)
  const [value, setValue] = useState('')
  const [canResend, setCanResend] = useState(false)
  const ref = useBlurOnFulfill({ value, cellCount: 6 })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  })

  useEffect(() => {
    dispatch(change('profile', 'code', value))
  }, [value])

  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <KeyboardView>
        <Header
          leftButton={{
            icon: BackIcon,
            onPress: () => navigation.goBack(),
          }}
          title='ENTER CODE'
        />

        <RegContainer>
          <InputContainer>
            <Label>Enter confirmation code</Label>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={setValue}
              cellCount={6}
              onEndEditing={() => {
                if (profileForm.code && profileForm.code.length === 6) {
                  dispatch(sendCode(profileForm))
                }
              }}
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
                onPress={() => {
                  setCanResend(false)
                  dispatch(sendSmsCode(profileForm))
                }}
              >
                <ResendButtonText disabled={!canResend}>
                  {'Tap to send '}
                </ResendButtonText>
              </ResendButton>
              {canResend ? null : (
                <>
                  <ResendText>{'('}</ResendText>
                  <CountDown
                    size={14}
                    until={59}
                    timeToShow={['S']}
                    showSeparator={false}
                    digitStyle={{ width: 14 }}
                    timeLabelStyle={{ color: THEME.secondaryBackgroundColor }}
                    digitTxtStyle={digitTxtStyle}
                    onFinish={() => {
                      setCanResend(true)
                    }}
                  />
                  <CountdownText>{'sec )'}</CountdownText>
                </>
              )}
            </ResendCodeContainer>
          </InputContainer>

          <ButtonContainer>
            <OnboardingButton
              light={false}
              loading={isLoadingSmsCode}
              disabled={isLoadingSmsCode || value.length !== 6}
              text={'CONFIRM'}
              onPress={() => dispatch(sendCode(profileForm))}
            />
          </ButtonContainer>
        </RegContainer>
      </KeyboardView>
    </FocusOut>
  )
}

export const InviteCodeRegistration = withNavigationFocus(
  InviteCodeRegistrationDumb,
)

export const PhoneCodeRegistration = PhoneCodeRegistrationDumb
