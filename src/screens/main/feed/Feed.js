import assetList from '@assets/assetList'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  RefreshControl,
} from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { GamesListItem } from '../../../components'
import { SwipeTutorial } from '../../../components/BlurModalContainer'
import { Container, FlatList, Text } from '../../../components/main'
import { TutorialTooltip } from '../../../components/TutorialTooltip'
import { HEIGHT_FEED_VIDEO, STATE, THEME, TUTORIAL } from '../../../const'
import { getProfileId } from '../../../modules/auth'
import {
  getFirstLaunch,
  setFirstLaunch,
} from '../../../modules/auth/repository'
import {
  getFeed,
  joinChallenge,
  likeCompletion,
  refreshFeed,
  setMuted,
} from '../../../modules/main/duck'
import { getTutorial, saveTutorial } from '../../../modules/main/repository'
import {
  getFeedList,
  getFeedPagination,
  getHasPendingChallenges,
  getMuted,
  getPendingChallenges,
  getVideoUploadState,
} from '../../../modules/main/selectors'
import {
  getParamFromUrl,
  keyExtractor,
  STATUS_BAR_HEIGHT,
  useAnalytics,
} from '../../../utils'
import { ContextMenu } from '../challenge/components'
import FeedEmpty, { ExploreButton } from './components/FeedEmpty'
import MentionModal from './components/MentionModal'
import ReminderModal from './components/ReminderModal'
import UploadProgress from './components/UploadProgress'
import ToPlay from './ToPlay'

const { width } = Dimensions.get('window')

const FeedTabsContainer = styled.View`
  height: 32px;
  position: absolute;
  align-self: center;
  top: ${STATUS_BAR_HEIGHT + 20}px;
  z-index: 99999;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const Tab = styled.TouchableOpacity`
  margin: 0 6px;
`

const TabText = styled(Text)`
  font-weight: 800;
  font-size: 20px;
  text-align: center;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);

  ${({ active }) =>
    !active &&
    css`
      color: #cdcdcd;
      text-shadow: 1px 1px 1px rgba(62, 62, 62, 0.5);
      font-size: 15px;
    `}
`

const HasIndicator = styled.View`
  position: absolute;
  top: 0;
  right: ${({ active }) => (active ? -12 : -8)}px;
  width: ${({ active }) => (active ? 6 : 4)}px;
  height: ${({ active }) => (active ? 6 : 4)}px;
  border-radius: 3px;
  background-color: ${({ active }) =>
    `rgba(250, 250, 250, ${active ? 1 : 0.6})`};
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
`

const FeedDumb = ({ isFocused, navigation }) => {
  const logEvent = useAnalytics('Feed screen seen', {}, true)
  const dispatch = useDispatch()

  const feed = useSelector(getFeedList)
  const toPlayGames = useSelector(getPendingChallenges)
  const myId = useSelector(getProfileId)
  const muted = useSelector(getMuted)
  const pagination = useSelector(getFeedPagination)
  const uploadState = useSelector(getVideoUploadState)
  const hasPendingChallenges = useSelector(getHasPendingChallenges)

  const progress = useRef(new Animated.Value(0)).current
  const [tapPaused, setTapPaused] = useState(false)

  const [contextMenu, setContextMenu] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const [feedTab, setFeedTab] = useState(true)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [completionIndex, setCompletionIndex] = useState(0)
  const [mentionUsers, setMentionUsers] = useState(false)
  const [currentAppState, setCurrentAppState] = useState(AppState.currentState)

  const [reminderOpen, setReminderOpen] = useState(false)
  const [challengeSaved, setChallengeSaved] = useState(null)

  const [tutorial, setTutorial] = useState({})
  const [currentTutorial, setCurrentTutorial] = useState(null)

  const visibleItem = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return
    setTapPaused(false)
    setCurrentIndex(viewableItems[0].index)
  })

  const currentChallenge = useMemo(
    () => feed[currentIndex],
    [feed, currentIndex],
  )

  const focusedScreen = useMemo(
    () => !!feedTab && isFocused,
    [isFocused, feedTab],
  )

  const currentCompletion = useMemo(
    () => (currentChallenge ? currentChallenge.feed[completionIndex] : null),
    [currentChallenge, completionIndex],
  )

  useEffect(() => {
    if (Object.keys(tutorial).length && !tutorial[TUTORIAL.SWIPE_LEFT]) {
      setCurrentTutorial(TUTORIAL.SWIPE_LEFT)
    }
  }, [currentIndex])

  useEffect(() => {
    if (Object.keys(tutorial).length) saveTutorial(tutorial)
  }, [tutorial])

  useEffect(() => {
    getTutorial().then((tutorial) => {
      setTutorial(tutorial)
      if (!tutorial[TUTORIAL.SWIPE_UP]) setCurrentTutorial(TUTORIAL.SWIPE_UP)
    })
    AppState.addEventListener('change', setCurrentAppState)
    return () => AppState.removeEventListener('change')
  }, [])

  useEffect(() => {
    if (currentAppState === 'active') dispatch(refreshFeed())
    else if (currentAppState === 'inactive') {
      getFirstLaunch().then((isFirst) => {
        if (isFirst === 'true') {
          logEvent('First session - finished')
          setFirstLaunch('false')
        }
      })
    }
  }, [currentAppState])

  useEffect(() => {
    if (Object.keys(tutorial).length && !tutorial[TUTORIAL.CREATE_GAME])
      setCurrentTutorial(TUTORIAL.CREATE_GAME)
    if (uploadState === STATE.UPLOAD_VIDEO.CONVERTING) {
      Animated.timing(progress, {
        toValue: 0.6,
        duration: 3000,
      }).start()
    } else if (uploadState === STATE.UPLOAD_VIDEO.LOADING) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
      }).start()
    }
  }, [uploadState])

  const onRefresh = useCallback(() => {
    dispatch(refreshFeed())
  }, [])

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore) dispatch(getFeed(pagination.page + 1))
  })

  const onPressJoin = useCallback((challenge, fromCompletion) => {
    const joined = !!challenge.user_stats.joined_at
    const joinPayload = {
      challenge,
      id: challenge.id,
      fromCompletion,
      screen: 'feed',
      joined,
      joinToken: challenge.public
        ? undefined
        : getParamFromUrl('token', challenge.access_url),
    }
    dispatch(joinChallenge(joinPayload))
    if (!joined) {
      setReminderOpen(true)
      setChallengeSaved(challenge)
    }
  }, [])

  const onPressLike = useCallback((gameCompletion, reaction) => {
    dispatch(likeCompletion({ gameCompletion, reaction }))
  }, [])

  const onPressUser = useCallback((user) => {
    if (myId && myId === user.id) navigation.push('Profile')
    else navigation.push('AlienProfile', { user })
  }, [])

  const renderItemFeed = useCallback(
    ({ item, index }) => {
      const completion = item.feed.find((feedItem) => feedItem.user.id === myId)
      return (
        <GamesListItem
          game={item}
          paused={tapPaused}
          myId={myId}
          feed={item.feed}
          onChangeIndex={setCompletionIndex}
          secondsToEnd={moment(item.finishes_at).diff(moment(), 'seconds')}
          currentChallenge={focusedScreen && currentIndex === index}
          muted={muted || !focusedScreen}
          onPressUser={onPressUser}
          onPressAuthor={() => onPressUser(item.user)}
          onPressMuted={() => dispatch(setMuted(!muted))}
          setTapPaused={setTapPaused}
          onPressDots={() => {
            setContextMenu(true)
          }}
          onPressLike={onPressLike}
          onPressJoin={(fromCompletion) => {
            onPressJoin(item, fromCompletion)
          }}
          onPressMention={setMentionUsers}
          onPressDoNow={(fromCompletion) => {
            navigation.push('CameraChallenge', {
              challengeId: item.id,
              fromCompletion,
              screen: 'feed',
            })
          }}
          onPressInvite={() => {
            setShowInviteModal(true)
          }}
          onPressCompleteCount={() => {
            navigation.push('CompletionsTile', { challenge: item })
          }}
          onPressLikeAuthor={() => {
            navigation.push('ReactionsTile', {
              challenge: item,
              completion: completion,
            })
          }}
        />
      )
    },
    [muted, currentIndex, focusedScreen, myId, tapPaused],
  )

  const renderListEmptyFeed = useCallback(
    () => <FeedEmpty navigation={navigation} />,
    [],
  )

  const renderFooterList = useCallback(
    () =>
      pagination.hasMore ? (
        <ActivityIndicator />
      ) : feed.length ? (
        <ExploreButton onPress={() => navigation.navigate('Explore')} />
      ) : null,
    [pagination.hasMore],
  )
  return (
    <>
      <Container>
        {uploadState === STATE.UPLOAD_VIDEO.INIT ? null : (
          <UploadProgress uploadState={uploadState} anim={progress} />
        )}
        <FeedTabsContainer>
          <Tab onPress={() => setFeedTab(true)}>
            <TabText active={feedTab}>{'MY FEED'}</TabText>
          </Tab>
          <Tab onPress={() => setFeedTab(false)}>
            {hasPendingChallenges ? <HasIndicator active={!feedTab} /> : null}
            <TabText active={!feedTab}>{'TO PLAY'}</TabText>
          </Tab>
        </FeedTabsContainer>
        {feedTab ? null : <ToPlay navigation={navigation} data={toPlayGames} />}
        <FlatList
          data={feed}
          onViewableItemsChanged={visibleItem.current}
          viewabilityConfig={{ itemVisiblePercentThreshold: 66 }}
          pagingEnabled={false}
          initialNumToRender={3}
          snapToInterval={HEIGHT_FEED_VIDEO + STATUS_BAR_HEIGHT}
          decelerationRate={'fast'}
          showsVerticalScrollIndicator={false}
          renderItem={renderItemFeed}
          ListFooterComponent={renderFooterList}
          keyExtractor={keyExtractor}
          onEndReached={handleLoadMore}
          refreshControl={
            <RefreshControl
              tintColor={THEME.textColor}
              refreshing={false}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={renderListEmptyFeed}
        />
      </Container>
      <ContextMenu
        myId={myId}
        game={currentChallenge}
        gameCompletion={currentCompletion}
        onPressJoin={onPressJoin}
        onPressDeleteGame={onRefresh}
        onPressDeleteCompletion={onRefresh}
        showMenu={contextMenu}
        setShowMenu={setContextMenu}
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
      />

      <ReminderModal
        isVisible={reminderOpen}
        challenge={challengeSaved}
        onPressSet={(time) => console.log(time)}
        onPressClose={() => {
          setReminderOpen(false)
          setChallengeSaved(false)
        }}
      />

      <MentionModal
        isVisible={!!mentionUsers}
        myId={myId}
        users={mentionUsers}
        onPressUser={onPressUser}
        onPressClose={() => setMentionUsers(false)}
      />
      <Tutorial
        currentTutorial={currentTutorial}
        closeAndSave={(key) => {
          setTutorial({ ...tutorial, [key]: true })
          setCurrentTutorial(null)
        }}
      />
    </>
  )
}

const Tutorial = ({ currentTutorial, closeAndSave }) => (
  <>
    {currentTutorial === TUTORIAL.CREATE_GAME ? (
      <TutorialTooltip
        position={{ left: width / 4 - 30, bottom: STATUS_BAR_HEIGHT + 44 }}
        text={'Press to create a new game and\ninspire people to feel happier'}
        onPressOk={() => closeAndSave(TUTORIAL.CREATE_GAME)}
      />
    ) : null}
    <SwipeTutorial
      anim={assetList.swipeUpAnim}
      text={'Swipe up'}
      up={true}
      textInfo={'to see other game'}
      visible={currentTutorial === TUTORIAL.SWIPE_UP}
      onPress={() => closeAndSave(TUTORIAL.SWIPE_UP)}
    />
    <SwipeTutorial
      anim={assetList.swipeLeftAnim}
      text={'Swipe left'}
      textInfo={'to see other people playing\nthis game'}
      visible={currentTutorial === TUTORIAL.SWIPE_LEFT}
      onPress={() => closeAndSave(TUTORIAL.SWIPE_LEFT)}
    />
  </>
)

const Feed = withNavigationFocus(FeedDumb)

export default Feed
