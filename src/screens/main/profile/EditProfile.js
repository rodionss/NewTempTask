import * as R from 'ramda'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { change, Field, initialize, reduxForm } from 'redux-form'
import styled from 'styled-components'
import * as Yup from 'yup'
import { Header, LabeledFieldInput } from '../../../components'
import { BackIcon, SaveIcon } from '../../../components/icons'
import { THEME } from '../../../const'
import {
  getIsLodaingProfile,
  getProfile,
  getProfilePhoto,
} from '../../../modules/auth'
import { editProfile } from '../../../modules/main/duck'
import { validator, withAmplitude } from '../../../utils'
import UploadAvatar from './components/UploadAvatar'

const Container = styled.KeyboardAvoidingView.attrs({
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
})``

const InputContainer = styled.View`
  width: 100%;
  height: 60px;
  margin-top: 24px;
  padding: 0 20px;
`

const EditProfileDumb = ({
  isLoading,
  editProfile,
  profile,
  handleSubmit,
  navigation,
  initialize,
  photoUrl,
  change,
}) => {
  useEffect(() => {
    initialize('profile', profile)
  }, [])

  return (
    <Container>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
        rightButton={{
          onPress: handleSubmit((form) => {
            editProfile({ form })
          }),
          icon: SaveIcon,
          isLoading: isLoading,
        }}
        title={'Edit profile'}
      />

      <ScrollContainer>
        <UploadAvatar
          onPress={(uri) => {
            change('profile', 'newAvatarUri', uri)
          }}
          uri={photoUrl}
        />

        <InputContainer>
          <Field
            autoFocus={false}
            label={'User name'}
            name={'username'}
            style={{ height: 64 }}
            autoCorrect={false}
            component={LabeledFieldInput}
          />
        </InputContainer>

        <InputContainer>
          <Field
            autoFocus={false}
            label={'Name'}
            name={'name'}
            style={{ height: 64 }}
            autoCorrect={false}
            component={LabeledFieldInput}
          />
        </InputContainer>
        <InputContainer>
          <Field
            autoFocus={false}
            label={'Bio'}
            name={'bio'}
            autoCorrect={false}
            style={{ height: 64 }}
            component={LabeledFieldInput}
          />
        </InputContainer>
      </ScrollContainer>
    </Container>
  )
}

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Field is required'),
  username: Yup.string().required('Field is required'),
  bio: Yup.string().required('Field is required'),
})

const EditProfile = R.compose(
  withAmplitude('Edit profile screen shown'),
  reduxForm({
    form: 'profile',
    asyncValidate: validator(profileSchema),
    destroyOnUnmount: false,
  }),
  connect(
    R.applySpec({
      isLoading: getIsLodaingProfile,
      profile: getProfile,
      photoUrl: getProfilePhoto,
    }),
    { editProfile, change, initialize },
  ),
)(EditProfileDumb)

export default EditProfile
