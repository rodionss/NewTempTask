import * as R from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { change, Field, reduxForm } from 'redux-form'
import styled from 'styled-components'
import * as Yup from 'yup'
import { Header, LabeledFieldInput } from '../../components'
import { Container } from '../../components/main'
import { OnboardingButton } from '../../components/buttons'
import { BackIcon } from '../../components/icons'
import { THEME } from '../../const'
import { signup } from '../../modules/auth/duck'
import { getProfileForm } from '../../modules/auth/selectors'
import { validator } from '../../utils/functions'
import UploadAvatar from '../main/profile/components/UploadAvatar'
import GetInviteStatus from './components/GetInviteStatus'

const FocusOut = styled.TouchableWithoutFeedback`
  flex: 1;
`

const ContainerPhoto = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`

const InputContainer = styled.View`
  width: 100%;
  margin-top: 16px;
  padding: 0 20px;
`

const ButtonContainer = styled.View`
  padding: 10px 20px 10px 20px;
  width: 100%;
  background-color: ${THEME.secondaryBackgroundColor};
`

const MainContainer = styled(Container)`
  flex: 1;
  padding-bottom: ${THEME.containerPadding}px;
  background-color: ${THEME.secondaryBackgroundColor};
`

const KeyboardContainer = styled.KeyboardAvoidingView.attrs({
  behavior: 'padding',
})`
  flex: 1;
  background-color: ${THEME.primaryBackgroundColor};
`

const ScrollContainer = styled.ScrollView.attrs({
  bounces: false,
  contentContainerStyle: {
    paddingBottom: 32,
  },
})`
  width: 100%;
  border-top-left-radius: 34px;
  border-top-right-radius: 34px;
  background-color: ${THEME.secondaryBackgroundColor};
`

const ProfileRegistration = ({
  navigation,
  handleSubmit,
  signup,
  isLoading,
  profile,
  change,
}) => {
  const scrollRef = useRef(null)
  const [statusInvite, setStatusInvite] = useState('warn')
  useEffect(() => {
    const status =
      profile && profile.name && profile.username ? 'success' : 'warn'
    setStatusInvite(status)
  }, [profile])
  return (
    <FocusOut onPress={() => Keyboard.dismiss()}>
      <MainContainer>
        <KeyboardContainer>
          <Header
            leftButton={{
              onPress: () => navigation.goBack(),
              icon: BackIcon,
            }}
            title='CREATE PROFILE'
          />

          <ScrollContainer ref={scrollRef}>
            <GetInviteStatus
              containerStyle={{ marginTop: 16 }}
              text={
                statusInvite === 'warn'
                  ? 'Complete your profile'
                  : 'Play the game'
              }
              status={statusInvite}
            />
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
                label={'Bio (Not necessary)'}
                name={'bio'}
                multiple={true}
                onFocus={() => scrollRef.current.scrollToEnd()}
                placeholder={'Write a little about yourself'}
                style={{ height: 72 }}
                autoCorrect={false}
                count={150}
                multiline={true}
                component={LabeledFieldInput}
              />
            </InputContainer>
          </ScrollContainer>
          <ButtonContainer>
            <OnboardingButton
              light={statusInvite === 'success'}
              disabled={statusInvite !== 'success'}
              loading={isLoading}
              text={'SAVE'}
              onPress={handleSubmit(signup)}
            />
          </ButtonContainer>
        </KeyboardContainer>
      </MainContainer>
    </FocusOut>
  )
}

const bioSchema = Yup.object().shape({
  username: Yup.string().required('Username is a required field'),
  name: Yup.string().required('Name is a required field'),
})

export default R.compose(
  connect(R.applySpec({ profile: getProfileForm }), { signup, change }),
  reduxForm({
    form: 'profile',
    destroyOnUnmount: false,
    asyncValidate: validator(bioSchema),
  }),
)(ProfileRegistration)
