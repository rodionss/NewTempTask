import { OnboardingButton } from '@components/buttons'
import { Button } from '@components/common/Header/atoms'
import { BackIcon } from '@components/icons'
import { getProfileId, getToken } from '@modules/auth'
import { createChallenge } from '@modules/main/duck'
import { getIsLoadingFormChallenge } from '@modules/main/selectors'
import { validator } from '@utils/index'
import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, ScrollView } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import { change, getFormValues, initialize, reduxForm } from 'redux-form'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import InviteModal from '@screens/main/challenge/CreateChallenge/InviteModal'
import { assetList } from '../../../../assets'
import InviteUserModal from '../../feed/components/InviteUserModal'
import {
  ButtonContainer,
  ButtonMedia,
  ButtonsWrapper,
  ButtonText,
  ContentWrapper,
  Option,
  OptionInfo,
  OptionInfoText,
  OptionLabel,
  OptionsWrapper,
  OptionText,
  Row,
  Wrapper,
} from './atoms'
import TitleInput from './TitleInput'

export const MAX_LENGTH = 48

enum ModalView {
  Tag = 'tag',
  Invite = 'invite',
}

const CreateChallengeDumb = ({
  createChallenge,
  initialize,
  navigation,
  isLoading,
  token,
  myId,
  challenge = {},
}) => {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
  })

  const [userModalVisible, setUserModal] = useState(false)
  const [taggedIds, setTaggedIds] = useState([])
  const [invitedIds, setInvitedIds] = useState([])

  const [modalView, setModalView] = useState(ModalView.Tag)

  useEffect(() => {
    challenge = {
      categoryId: 1,
      public: true,
      title: '',
      description: '',
      videoProps: null,
      ...challenge,
    }
    initialize('challenge', challenge)
  }, [])

  const selected = modalView === ModalView.Tag ? taggedIds : invitedIds

  return (
    <>
      <Wrapper>
        <ScrollView bounces={false}>
          <ContentWrapper>
            <Row>
              <Button onPress={() => navigation.goBack()}>
                <BackIcon />
              </Button>
              <Button />
            </Row>
            <TitleInput
              placeholder='TITLE'
              autoFocus
              name='title'
              multiline={false}
              autoCorrect
              autoCapitalize='characters'
              control={control}
            />
          </ContentWrapper>

          <ButtonsWrapper>
            <OptionsWrapper>
              <Option
                onPress={() => {
                  setModalView(ModalView.Tag)
                  setUserModal(true)
                }}
              >
                <OptionLabel>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={assetList.tagFriends}
                  />
                  <OptionText>Tag friends</OptionText>
                </OptionLabel>
                {taggedIds.length > 0 && (
                  <OptionInfo>
                    <OptionInfoText>{`${taggedIds.length} people`}</OptionInfoText>
                  </OptionInfo>
                )}
              </Option>
              <Option
                onPress={() => {
                  setModalView(ModalView.Invite)
                  setUserModal(true)
                }}
              >
                <OptionLabel>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={assetList.inviteFriends}
                  />
                  <OptionText>Invite friends</OptionText>
                </OptionLabel>
                {invitedIds.length > 0 && (
                  <OptionInfo>
                    <OptionInfoText>{`${invitedIds.length} people`}</OptionInfoText>
                  </OptionInfo>
                )}
              </Option>
            </OptionsWrapper>
          </ButtonsWrapper>
        </ScrollView>
      </Wrapper>

      <ButtonContainer>
        <OnboardingButton
          text='Publish'
          light
          full
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit((form) => {
            createChallenge({
              ...challenge,
              ...form,
              taggedUsers: taggedIds,
              invitedUsers: invitedIds,
              done: true,
            })
          })}
        />
      </ButtonContainer>
      <InviteModal
        confirmText='Tag friends'
        selectedIds={taggedIds}
        isVisible={userModalVisible && modalView === ModalView.Tag}
        onPressSelect={(ids) => {
          setTaggedIds(ids)
          setUserModal(false)
        }}
        onPressClose={() => setUserModal(false)}
      />
      <InviteModal
        confirmText='Invite friends'
        selectedIds={invitedIds}
        isVisible={userModalVisible && modalView === ModalView.Invite}
        onPressSelect={(ids) => {
          setInvitedIds(ids)
          setUserModal(false)
        }}
        onPressClose={() => setUserModal(false)}
      />
    </>
  )
}

const validationSchema = Yup.object().shape({
  title: Yup.string().max(MAX_LENGTH).required('Field is required'),
})

export const CreateChallenge = R.compose(
  withNavigationFocus,
  reduxForm({
    form: 'challenge',
    asyncValidate: validator(validationSchema),
    destroyOnUnmount: false,
    shouldAsyncValidate: () => true,
  }),
  connect(
    R.applySpec({
      token: getToken,
      myId: getProfileId,
      isLoading: getIsLoadingFormChallenge,
      challenge: getFormValues('challenge'),
      isEdit: R.F,
    }),
    { createChallenge, change, initialize },
  ),
)(CreateChallengeDumb)
