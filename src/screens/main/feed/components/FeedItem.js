import moment from 'moment';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import CountDown from 'react-native-countdown-component';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import { useStore } from 'react-redux';
import styled from 'styled-components';
import {
  FeedPrimaryButton,
  RoundIconButton,
} from '../../../../components/buttons';
import {
  Checkmark,
  EyeIcon,
  FlagIcon,
  Hourglass,
  MutedIcon,
  PlusIcon,
  PointsIcon,
  ShareIcon,
} from '../../../../components/icons';
import { Link, Text } from '../../../../components/main';
import Player from '../../../../components/Player';
import { HEIGHT_OLD_VIDEO } from '../../../../const';
import { addViewToSession } from '../../../../modules/main';
import { keyExtractor, STATUS_BAR_HEIGHT } from '../../../../utils';

const { width } = Dimensions.get('window');

const FeedItemContainer = styled.View`
  overflow: hidden;
  height: ${HEIGHT_OLD_VIDEO}px;
  border-radius: 35px;
  margin-bottom: ${STATUS_BAR_HEIGHT}px;
`;

const GameFeedList = styled(FlatList)`
  height: ${({ heightOffset }) => HEIGHT_OLD_VIDEO - heightOffset}px;
  background-color: #000;
  border-radius: 35px;
`;
const StatsContainer = styled.View`
  margin-left: auto;
  align-items: flex-end;
`;

const CompletedCountCountainer = styled.TouchableOpacity`
  height: 24px;
  width: 47px;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  background-color: #0000002a;
  border-radius: 16px;
`;

const ViewsCountCountainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

const ViewsCountText = styled(Text)`
  color: #fff;
  margin-left: 4px;
  font-size: 14px;
  font-weight: 500;
  z-index: 99;
`;
const CompletedText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  z-index: 99;
`;

const FooterContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 0 8px;
  flex-direction: column-reverse;
`;
const GameInfoContainer = styled.View`
  padding: 0 12px;
  flex-direction: column-reverse;
`;

const ButtonContainer = styled.View`
  width: 100%;
  height: 72px;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  justify-content: space-around;
  margin-top: 25px;
  margin-bottom: 8px;
  border-radius: 28px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ButtonShare = styled.TouchableOpacity`
  width: 34px;
  height: 28px;
`;

const CountDownContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const RoundIndicator = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  margin-right: 4px;
  background-color: #48db60;
`;

const CompleteText = styled(Text)`
  color: #fff;
  font-weight: 600;
  margin-right: auto;
  margin-left: 4px;
  font-size: 17px;
`;

const Description = styled(Text)`
  font-size: 13px;
  margin-top: 4px;
  color: #d1d1d1;
`;

const DateText = styled(Text)`
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 20px;
  margin-top: 4px;
`;

const Title = styled(Text)`
  font-size: 19px;
  font-weight: 600;
  color: #fff;
`;

const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AuthorChallengeContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const AuthorChallengeAvatar = styled(FastImage)`
  width: 32px;
  height: 32px;

  border: 1px solid #ff300a;
  border-radius: 18px;
`;

const CompletedAvatar = styled(FastImage)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ left }) => left}px;
  width: 24px;
  height: 24px;
  z-index: -99;
  background-color: aliceblue;

  border-radius: 12px;
`;

const InfoContainer = styled.View`
  margin-left: 12px;
`;
const UserNameAuthor = styled.Text`
  font-size: 13px;
  color: #fff;
  font-weight: 600;
`;
const FounderText = styled.Text`
  font-size: 13px;
  color: #d9d9d9;
  font-weight: normal;
`;

const MutedButton = styled(Link)`
  position: absolute;
  bottom: 180px;
  right: 20px;
  width: 24px;
  height: 24px;
`;

const SeeDetailedContainer = styled(Link)`
  width: 150px;
  height: ${HEIGHT_OLD_VIDEO}px;
  justify-content: center;
  align-items: center;
`;

const SeeDetailedText = styled(Text)`
  font-size: 17px;
`;

const FeedItem = ({
  title = '',
  feed = [],
  muted = true,
  description = '',
  onPressVideo,
  paused,
  completedCount = 0,
  secondsToEnd,
  finishesAt,
  viewsCount,
  initialIndex = 0,
  authorAvatar = '',
  authorName = '',
  completedAt = '',
  onPressMuted,
  horizontal = true,
  pagingEnabled = true,
  onScrollToEnd,
  onPressUser,
  onPressJoin,
  onPressDoNow,
  onPressAuthor,
  handleOverScroll = () => {},
  onPressShare,
  onPressDots,
  onPressCompleteCount,
  currentChallenge,
  heightOffset = 0,
  onChangeIndex = () => {},
}) => {
  const store = useStore();
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const visibleItem = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;
    setCurrentIndex(viewableItems[0].index)
    onChangeIndex(viewableItems[0].index)
  });

  const impacterCompletion = useMemo(
    () => (
      (feed.length &&
        feed[currentIndex]) ||
      {}),
    [currentIndex],
  );

  const renderGameFeedItem = useCallback(
    ({ item, index }) => {
      const played = currentIndex === index && currentChallenge;
      const last = index === feed.length;
      const completed_at = item.completed_at
        ? moment(item.completed_at).fromNow()
        : '';
      return typeof item === 'string' ? (
        <SeeDetailedContainer onPress={handleOverScroll}>
          <SeeDetailedText>SHOW MORE</SeeDetailedText>
        </SeeDetailedContainer>
      ) : item.user ? (
        <CompleteItem
          index={index}
          last={last}
          play={played}
          paused={paused}
          onPressDots={onPressDots}
          onViewVideo={() => {
            store.dispatch(addViewToSession(item.id));
          }}
          media={item.media}
          muted={muted || !played}
          authorName={item.user.name}
          completedAt={completed_at}
          position={item.position || 1}
          avatarUrl={item.user.photo_url}
          onPressVideo={onPressVideo}
          onPressUser={() => onPressUser(item.user)}
        />
      ) : null;
    },
    [feed],
  );

  return (
    <FeedItemContainer>
      <GameFeedList
        data={feed}
        key={'gameFeed'}
        keyExtractor={keyExtractor}
        horizontal={horizontal}
        heightOffset={heightOffset}
        pagingEnabled={pagingEnabled}
        contentOffset={{ x: initialIndex * width, y: 0 }}
        onViewableItemsChanged={visibleItem.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20,
          waitForInteraction: true,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={renderGameFeedItem}
        scrollEventThrottle={20}
        onEndReached={onScrollToEnd}
        onScroll={(e) => {
          const quarterOvercome =
            e.nativeEvent.contentOffset.x >
            width * (feed.length - 1) - width / 2;
          if (quarterOvercome) handleOverScroll();
        }}
      />
      <FooterContainer>
        <ButtonContainer>
          {secondsToEnd <= 0 || completedAt ? null : (
            <RoundIconButton
              size={48}
              icon={<FlagIcon fill={false} />}
              onPress={() => {
                onPressJoin(impacterCompletion)
              }}
            />
          )}
          {completedAt || secondsToEnd < 0 ? (
            <>
              {completedAt ? <Checkmark /> : <Hourglass />}
              <CompleteText>
                {completedAt ? 'COMPLETED' : 'THE GAME IS FINISHED'}
              </CompleteText>
            </>
          ) : (
            <FeedPrimaryButton
              text={'PLAY NOW'}
              onPress={() => onPressDoNow(impacterCompletion)}
            />
          )}
          {secondsToEnd < 0 ? null : (
            <RoundIconButton
              size={48}
              icon={<PlusIcon />}
              onPress={onPressShare}
            />
          )}
        </ButtonContainer>
        <GameInfoContainer>
          {onPressAuthor ? (
            <RowContainer>
              <AuthorChallengeContainer onPress={onPressAuthor}>
                <AuthorChallengeAvatar source={{ uri: authorAvatar }} />
                <InfoContainer>
                  <UserNameAuthor>{authorName}</UserNameAuthor>
                  <FounderText>{'Game author'}</FounderText>
                </InfoContainer>
              </AuthorChallengeContainer>
              <StatsContainer>
                <CompletedCountCountainer onPress={onPressCompleteCount}>
                  {/* {completedCount > 1
                  ? [1, 2].map((i) => (
                      <CompletedAvatar key={i} left={i * -14} />
                    ))
                  : null} */}
                  <CompletedText>{completedCount}</CompletedText>
                </CompletedCountCountainer>
                <ViewsCountCountainer>
                  <EyeIcon />
                  <ViewsCountText>
                    {feed[currentIndex].views_count || 0}
                  </ViewsCountText>
                </ViewsCountCountainer>
              </StatsContainer>
            </RowContainer>
          ) : null}
          {secondsToEnd <= 0 ? (
            <DateText>{moment(finishesAt).format('MMM DD, YYYY')}</DateText>
          ) : (
            <CountDownContainer>
              <RoundIndicator />
              <CountDown
                size={10}
                timeLabels={{}}
                until={secondsToEnd}
                showSeparator={true}
                timeToShow={['H', 'M', 'S']}
                digitTxtStyle={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
                separatorStyle={{ color: '#fff', width: 5 }}
                digitStyle={{ backgroundColor: 'transparent', width: 16 }}
              />
            </CountDownContainer>
          )}

          {description ? <Description>{description}</Description> : null}
          <Title>{title}</Title>
        </GameInfoContainer>
        <MutedButton onPress={onPressMuted}>
          <MutedIcon muted={muted} />
        </MutedButton>
      </FooterContainer>
    </FeedItemContainer>
  );
};

const CompletedItemContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: ${width}px;
  height: ${HEIGHT_OLD_VIDEO}px;
  align-items: flex-end;
  background-color: #000;
  border-radius: 35px;
`;

const CompletedAuthorContainer = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;
  flex-direction: row;
  align-items: center;
`;

const AuthorAvatar = styled(FastImage)`
  width: 40px;
  height: 40px;
  margin-right: 8px;
  border-radius: 20px;
`;

const AuthorName = styled.Text`
  font-weight: 600;
  color: #ffffff;
  font-size: 13px;
`;

const CompletedAuthorInspired = styled.Text`
  font-size: 13px;
  color: #ffffff;
`;

const DotsContainer = styled(Link)`
  position: absolute;
  top: 20px;
  right: 20px;
  height: 32px;
  z-index: 9999;
  align-items: center;
  justify-content: center;
  width: 32px;
  border-radius: 16px;
  background-color: #33333377;
`;

export const CompleteItem = ({
  play,
  position,
  muted,
  avatarUrl,
  completedAt,
  paused,
  onViewVideo,
  // preload,
  onPressDots,
  onPressUser,
  onPressVideo,
  authorName,
  media,
}) => {
  return (
    <CompletedItemContainer onPress={onPressVideo}>
      {onPressDots ? (
        <DotsContainer onPress={onPressDots}>
          <PointsIcon />
        </DotsContainer>
      ) : null}
      <CompletedAuthorContainer onPress={onPressUser}>
        <AuthorAvatar source={{ uri: avatarUrl }} />
        <View>
          <AuthorName>
            {authorName} #{position}
          </AuthorName>
          <CompletedAuthorInspired>{completedAt}</CompletedAuthorInspired>
        </View>
      </CompletedAuthorContainer>

      <Player
        media={media}
        muted={muted}
        play={play}
        paused={paused}
        onViewVideo={onViewVideo}
      />
    </CompletedItemContainer>
  );
};

const PendingItemContainer = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  width: ${width}px;
  align-items: flex-end;
  height: ${HEIGHT_OLD_VIDEO}px;
  background-color: #000;
  border-radius: 35px;
  margin-bottom: ${STATUS_BAR_HEIGHT}px;
`;

const AuthorPendingContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding-left: 12px;
`;

export const PendingItem = ({
  title,
  media,
  play,
  muted,
  author,
  description,
  onPressAuthor,
  onPressVideo,
  onPressDoNow,
  onPressJoin,
  onPressMuted,
  onPressShare,
}) => (
  <FeedItemContainer>
    <CompletedItemContainer onPress={onPressVideo}>
      <Player media={media} muted={muted} play={play} />

      <FooterContainer>
        <ButtonContainer>
          <RoundIconButton
            size={48}
            icon={<FlagIcon fill={true} />}
            onPress={onPressJoin}
          />

          <FeedPrimaryButton text={'PLAY NOW'} onPress={onPressDoNow} />
          <RoundIconButton
            size={48}
            icon={<ShareIcon />}
            onPress={onPressShare}
          />
        </ButtonContainer>
        <GameInfoContainer>
          {description ? <Description>{description}</Description> : null}
          <Title>{title}</Title>
        </GameInfoContainer>
        <AuthorPendingContainer onPress={onPressAuthor}>
          <AuthorAvatar source={{ uri: author.photo_url }} />
          <InfoContainer>
            <UserNameAuthor>{author.name}</UserNameAuthor>
            <FounderText>{'founder'}</FounderText>
          </InfoContainer>
        </AuthorPendingContainer>
      </FooterContainer>
      <MutedButton onPress={onPressMuted}>
        <MutedIcon muted={true}></MutedIcon>
      </MutedButton>
    </CompletedItemContainer>
  </FeedItemContainer>
);

export default FeedItem;
