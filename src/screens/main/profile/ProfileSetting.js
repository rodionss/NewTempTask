import * as R from 'ramda';
import React from 'react';
import { Alert, Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Header } from '../../../components';
import { BackIcon } from '../../../components/icons';
import { Container, Text } from '../../../components/main';
import { THEME, URLS } from '../../../const';
import { deleteProfile, getProfileId, logout } from '../../../modules/auth';
import { getIsLoadingEdit } from '../../../modules/main/selectors';
import { withAmplitude } from '../../../utils';
import ProfileButton from './components/ProfileButton';

const RowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled(Text)`
  font-weight: 600;
  font-size: 18px;
  color: ${THEME.textColor};
`;

const UserId = styled(Text)`
  font-size: 16px;
  color: ${THEME.textColor};
`;

const ButtonsContainer = styled.View`
  padding: 0 0 0 15px;
  margin-top: 24px;
  margin-bottom: 34px;
`;

const PaddedContainer = styled.ScrollView`
  padding: 20px;
`;

const ProfileSettingDumb = ({ navigation, id, logout, deleteProfile }) => {
  const createConfirmAlert = () =>
    Alert.alert(
      'Log out',
      '\nAre you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {},
        },
        { text: 'Yes', onPress: logout },
      ],
      { cancelable: false },
    );
  return (
    <>
      <Header
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: BackIcon,
        }}
        title={'Options'}
      />

      <Container>
        <PaddedContainer>
          <RowContainer>
            <Title>{'About'}</Title>
            <UserId>User ID: {id}</UserId>
          </RowContainer>

          <ButtonsContainer>
            <ProfileButton
              text={'Blocked users'}
              onPress={() => {
                navigation.push('BlockedUsers');
              }}
            />
            <ProfileButton
              text={'Support'}
              onPress={() => {
                Linking.openURL(URLS.support);
              }}
            />
            <ProfileButton
              text={'Terms'}
              onPress={() => InAppBrowser.open(URLS.terms)}
            />
            <ProfileButton
              last
              text={'Privacy Policy'}
              onPress={() => InAppBrowser.open(URLS.privacyPolicy)}
            />
          </ButtonsContainer>

          <ButtonsContainer>
            <ProfileButton
              last
              color={'red'}
              text={'Logout'}
              onPress={() => createConfirmAlert()}
            />
          </ButtonsContainer>
        </PaddedContainer>
      </Container>
    </>
  );
};

const ProfileSetting = R.compose(
  withAmplitude('Profile setting screen shown'),
  connect(
    R.applySpec({
      isLoading: getIsLoadingEdit,
      id: getProfileId,
    }),
    { logout, deleteProfile },
  ),
)(ProfileSettingDumb);

export default ProfileSetting;
