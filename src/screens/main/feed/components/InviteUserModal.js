import * as R from 'ramda';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { handleErrors } from '../../../../aspects';
import { assetList } from '../../../../assets';
import { PrimaryButton } from '../../../../components/buttons';
import { SearchIcon, ShareIcon } from '../../../../components/icons';
import { Link, ModalContainer, Text } from '../../../../components/main';
import TabbedUserSearch from '../../../../components/TabbedUserSearch';
import { getProfileId, getToken } from '../../../../modules/auth';
import * as Manager from '../../../../modules/main/managers';
import { useAnalytics } from '../../../../utils';

const ModalContent = styled.View`
  width: ${Dimensions.get('window').width}px;
  height: ${({ height }) => height}%;
  margin-top: auto;
  padding-top: 8px;
  align-items: center;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: #000;
  z-index: 9999;
`;

const Title = styled(Text)`
  font-weight: 500;
  font-size: 18px;
`;

const UserList = styled(FlatList)`
  width: 100%;
`;

const UserContainer = styled(Link)`
  width: 60px;
  padding-top: 20px;
  margin-left: 24px;
  align-items: center;
  justify-content: center;
`;

const UserPhoto = styled(FastImage)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;

const Username = styled(Text)`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
`;

const SelectedIndicator = styled.View`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  align-items: center;
  z-index: 99;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Checkmark = styled.Image.attrs({
  resizeMode: 'contain',
  source: assetList.checkmark,
})`
  width: 24px;
  height: 20px;
  tint-color: #fff;
`;

const CancelButton = styled(Link)`
  justify-content: center;
  align-items: center;
  width: 20%;
`;

const CancelText = styled(Text)`
  margin-top: 20px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
`;

const ButtonContainer = styled.View`
  width: 100%;
  flex-direction: row;
  padding: 0 20px;
  margin-top: -30%;
  padding-bottom: 32px;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
`;

const Header = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 24px;
  padding: 0 16px;
  background-color: #000;
  justify-content: space-between;
  align-items: center;
`;

const HeaderButton = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
`;

const FAVOURITE_HEIGHT = 30;
const SEARCH_HEIGHT = 80;

const InviteUserModal = ({
  token,
  myId,
  isVisible: challengeId,
  accessUrl,
  selected,
  type,
  acceptText,
  onPressClose,
  onPressSend,
}) => {
  const logEvent = useAnalytics();
  const [height, setHeight] = useState(SEARCH_HEIGHT);
  const [users, setUsers] = useState([]);

  const isSearch = useMemo(() => true, [height]);
  const [selectedUserIds, setSelectedUserIds] = useState(selected || []);

  useEffect(() => {
    // FIXME, replace with favourites or most recent
    Manager.getFollowing(token, myId)
      .then((result) => setUsers(result.users))
      .catch(handleErrors);
  }, []);

  const manageSelectUser = useCallback((user) => {
    if (type !== 'tag') return;
    if (selectedUserIds.includes(user.id)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id != user.id));
    } else {
      setSelectedUserIds([...selectedUserIds, user.id]);
    }
  });

  const renderUserItem = useCallback(({ item }) => {
    return (
      <UserContainer onPress={() => manageSelectUser(item)}>
        <UserPhoto source={{ uri: item.photo_url }}>
          {selectedUserIds.includes(item.id) ? (
            <SelectedIndicator>
              <Checkmark />
            </SelectedIndicator>
          ) : null}
        </UserPhoto>
        <Username>{item.username}</Username>
      </UserContainer>
    );
  });

  return (
    <ModalContainer isVisible={!!challengeId} onBackdropPress={onPressClose}>
      <ModalContent height={height}>
        <Header>
          <HeaderButton
            disabled={isSearch || type === 'tag'}
            onPress={() => {
              Share.open({
                title: 'HAPPYO',
                subject: 'I did this using the Happyo app',
                message: accessUrl,
              }).then(() => logEvent('Link to a game shared'));
            }}
          >
            {isSearch || type === 'tag' ? null : (
              <ShareIcon width={20} height={20} />
            )}
          </HeaderButton>
          <Title>{'Invite to game'}</Title>
          <HeaderButton
            onPress={() => {
              if (selectedUserIds.length) {
                onPressSend();
              }
              setHeight(SEARCH_HEIGHT);
            }}
          >
            {isSearch ? null : <SearchIcon />}
          </HeaderButton>
        </Header>
        {isSearch ? (
          <TabbedUserSearch
            token={token}
            myId={myId}
            selectedIds={selectedUserIds}
            ableInvite={type !== 'tag'}
            meta={{ id: challengeId }}
            onPressUser={manageSelectUser}
          />
        ) : (
          <UserList
            data={users}
            horizontal={true}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        <ButtonContainer>
          {type === 'tag' || !isSearch ? (
            selectedUserIds.length ? (
              <>
                <CancelButton
                  onPress={
                    isSearch && type !== 'tag'
                      ? () => setHeight(FAVOURITE_HEIGHT)
                      : type === 'tag'
                      ? () => {
                          onPressSend([]);
                          onPressClose();
                        }
                      : onPressClose
                  }
                >
                  <CancelText>{isSearch ? 'BACK' : 'CANCEL'}</CancelText>
                </CancelButton>
                <PrimaryButton
                  onPress={() => {
                    onPressSend(selectedUserIds);
                    type === 'tag' ? null : setSelectedUserIds([]);
                  }}
                  text={`${acceptText ? acceptText : 'SEND'} (${
                    selectedUserIds.length
                  })`}
                />
              </>
            ) : (
              <CancelButton
                onPress={
                  isSearch && type !== 'tag'
                    ? () => setHeight(FAVOURITE_HEIGHT)
                    : type === 'tag'
                    ? () => {
                        onPressSend([]);
                        onPressClose();
                      }
                    : onPressClose
                }
              >
                <CancelText>{isSearch ? 'BACK' : 'CANCEL'}</CancelText>
              </CancelButton>
            )
          ) : null}
        </ButtonContainer>
      </ModalContent>
    </ModalContainer>
  );
};

export default connect(R.applySpec({ token: getToken, myId: getProfileId }))(
  InviteUserModal,
);
