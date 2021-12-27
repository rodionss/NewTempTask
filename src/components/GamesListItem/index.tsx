import { FeedItem } from '@app-types/challenge'
import { FeedPrimaryButton, IconButton } from '@components/buttons'
import Counter from '@components/Counter'
import { setGlobalLoading } from '@modules/main/duck'
import { getShareVideoOptions } from '@utils/VideoConverter'
import moment from 'moment'
import styled from 'styled-components/native'
import React, { useCallback, useMemo, useRef, useState, memo } from 'react'
import { Dimensions, ViewToken } from 'react-native'
import Share from 'react-native-share'
import { useStore } from 'react-redux'
import { addViewToSession } from '../../modules/main'
import { addWatermark, keyExtractor } from '../../utils'
import {
  AtIcon,
  CircleCompleteIcon,
  CrossIcon,
  FlagIcon,
  InviteIcon,
  MutedIcon,
  SendIcon,
  ShareIcon,
} from '../icons'
import {
  CompletedIndicatorContainer,
  CompletedIndicatorText,
  DateText,
  FooterButtonContainer,
  GameFeedList,
  GameInfoContainer,
  ItemContainer,
  RowContainer,
  SendPopupContainer,
  SendPopupItem,
  SendPopupItemText,
  SmallButton,
  SmallButtonContainer,
  Title,
} from './atoms'
import CompleteItem from './CompleteItem'

const { width } = Dimensions.get('window')

const FeedButtonContainer = styled.View`
  position: absolute;
  right: 20px;
  bottom: 92px;
  z-index: 99;
`

type Props = {
  feed: FeedItem[]
  muted: boolean
  myId: string
  game: any
  setTapPaused: () => void
  paused: boolean
  initialIndex: number
  currentChallenge: FeedItem
  onPressMuted: () => void
  onScrollToEnd: () => void
  onPressUser: () => void
  onPressJoin: (impacterCompletion: object) => void
  onPressMention: () => void
  onPressDoNow: (impacterCompletion: object) => void
  onPressLike?: (gameCompletion: object, reaction: any) => void
  onPressDots: () => void
  onPressLikeAuthor?: () => void
  onPressCompleteCount: (impacterCompletion: object) => void
  onPressInvite: () => void
  onChangeIndex: (index: number | null) => void
  showReactionsIcon?: boolean
}

const GamesListItem = ({
  feed = [],
  muted = true,
  myId,
  game,
  setTapPaused,
  paused,
  initialIndex = 0,
  currentChallenge,
  forceRerender = 0,
  onPressMuted,
  onScrollToEnd,
  onPressUser,
  onPressJoin,
  onPressMention,
  onPressDoNow,
  onPressLike,
  onPressDots,
  onPressCompleteCount,
  onPressLikeAuthor,
  onPressInvite,
  onChangeIndex,
  showReactionsIcon,
}: Props) => {
  const store = useStore()
  const gameList = useRef(null)

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex)
  const [sendPopup, setSendPopup] = useState<boolean>(false)

  const visibleItem = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length) {
        setCurrentIndex(viewableItems[0].index)
        onChangeIndex(viewableItems[0].index)
      }
    },
  )

  const isMyGame = useMemo(() => game.user.id === myId, [])

  const secondsToEnd = useMemo(() => {
    const startTime = moment()
    const endTime = moment(game.finishes_at)
    const diff = moment.duration(endTime.diff(startTime))
    return diff.asSeconds()
  }, [game])

  const isGameOver = useMemo(
    () => isMyGame || game.user_stats.completed_at || secondsToEnd <= 0,
    [isMyGame, secondsToEnd],
  )

  const executorAvatars = useMemo(
    () =>
      feed.reduce(
        (acc, x) =>
          x.user.photo_url && acc.length < 2 ? [...acc, x.user.photo_url] : acc,
        [],
      ),
    [feed.length],
  )

  const currentGame = useMemo(() => feed[currentIndex], [currentIndex, feed])

  const onPressShare = useCallback(() => {
    setSendPopup(false)
    store.dispatch(setGlobalLoading(true))
    addWatermark(currentGame, game, (uri: string) => {
      getShareVideoOptions(uri, true, game.title.toUpperCase(), game.access_url)
        .then(Share.open)
        .finally(() => {
          store.dispatch(setGlobalLoading(false))
        })
    })
  }, [currentGame])

  const onPressCreator = useCallback(() => {
    if (gameList.current) {
      setCurrentIndex(feed.length - 1)
      gameList.current.scrollToEnd()
    }
  }, [])

  const renderGameFeedItem = useCallback(
    ({ item, index }) => {
      const played = currentIndex === index && currentChallenge
      const last = index === feed.length
      const completed_at = item.completed_at
        ? moment(item.completed_at).fromNow()
        : ''

      return (
        <CompleteItem
          item={item}
          isMyGame={isMyGame}
          index={index}
          last={last}
          play={played}
          onPressDots={onPressDots}
          isAuthorGame={item.user.id === game.user.id}
          preload={index === 0 || index === currentIndex + 1}
          paused={paused}
          executorAvatars={executorAvatars}
          onViewVideo={() => {
            store.dispatch(addViewToSession(item.id))
          }}
          reaction={item.user_stats ? item.user_stats.reaction : null}
          onPressCreator={onPressCreator}
          onPressLike={(reaction: any) => {
            if (item.user.id === myId) {
              return
            }
            feed[index].user_stats.reaction = reaction
            onPressLike(item, reaction)
          }}
          onPressMuted={onPressMuted}
          media={item.media}
          muted={muted || !played}
          completedCount={game.completed_count}
          authorName={item.user.username}
          completedAt={completed_at}
          position={item.position || 1}
          avatarUrl={item.user.photo_url}
          setTapPaused={setTapPaused}
          closePopup={() => {
            if (sendPopup) {
              setSendPopup(false)
              return true
            }
          }}
          onPressUser={() => onPressUser(item.user)}
          onPressCompleteCount={() => onPressCompleteCount(currentGame)}
          onPressLikeAuthor={onPressLikeAuthor}
          completedByMe={item.user.id === myId}
          showReactionsIcon={showReactionsIcon}
        />
      )
    },
    [
      currentIndex,
      paused,
      muted,
      sendPopup,
      currentChallenge,
      currentGame,
      forceRerender,
    ],
  )

  return (
    <ItemContainer>
      <GameFeedList
        ref={gameList}
        data={feed}
        key='gameFeed'
        keyExtractor={keyExtractor}
        initialNumToRender={3}
        horizontal
        pagingEnabled
        contentOffset={{ x: initialIndex * width, y: 0 }}
        onViewableItemsChanged={visibleItem.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 99,
          waitForInteraction: true,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={renderGameFeedItem}
        scrollEventThrottle={100}
        onEndReached={onScrollToEnd}
      />
      {paused ? null : (
        <>
          <SmallButtonContainer>
            {game.tagged_users.length > 1 ? (
              <SmallButton
                onPress={() =>
                  onPressMention(game.tagged_users.map((t) => t.user))
                }
              >
                <AtIcon />
              </SmallButton>
            ) : null}
            {muted ? (
              <SmallButton disabled>
                <MutedIcon />
              </SmallButton>
            ) : null}
          </SmallButtonContainer>
          <GameInfoContainer pointerEvents='none'>
            <RowContainer>
              <Title>{game.title}</Title>
              {game.user_stats.completed_at || secondsToEnd <= 0 ? (
                <CompletedIndicatorContainer>
                  <CompletedIndicatorText>DONE</CompletedIndicatorText>
                  <CircleCompleteIcon />
                </CompletedIndicatorContainer>
              ) : null}
            </RowContainer>
            {secondsToEnd <= 0 ? (
              <DateText>
                {moment(game.finishes_at).format('MMM DD, YYYY')}
              </DateText>
            ) : (
              <Counter secondsToEnd={secondsToEnd} />
            )}
          </GameInfoContainer>
          {isGameOver ? null : (
            <FeedButtonContainer>
              <FeedPrimaryButton
                width={96}
                text='PLAY'
                onPress={() => onPressDoNow(currentGame)}
              />
            </FeedButtonContainer>
          )}
          <FooterButtonContainer>
            {isGameOver ? (
              <>
                {secondsToEnd <= 0 ? null : (
                  <IconButton
                    icon={<InviteIcon />}
                    style={{ marginRight: 8 }}
                    onPress={onPressInvite}
                  />
                )}
                <IconButton icon={<ShareIcon />} onPress={onPressShare} />
              </>
            ) : (
              <>
                <IconButton
                  icon={<FlagIcon filled={!!game.user_stats.joined_at} />}
                  style={{ marginRight: 8 }}
                  onPress={() => onPressJoin(currentGame)}
                />
                <IconButton
                  icon={
                    sendPopup ? (
                      <CrossIcon width={36} height={36} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onPress={() => setSendPopup(!sendPopup)}
                />
              </>
            )}
          </FooterButtonContainer>
          {sendPopup ? (
            <SendPopupContainer>
              <SendPopupItem onPress={onPressShare}>
                <SendPopupItemText>Share</SendPopupItemText>
                <ShareIcon width={30} />
              </SendPopupItem>
              <SendPopupItem onPress={onPressInvite}>
                <SendPopupItemText>Invite</SendPopupItemText>
                <InviteIcon width={28} />
              </SendPopupItem>
            </SendPopupContainer>
          ) : null}
        </>
      )}
    </ItemContainer>
  )
}

export default memo(GamesListItem)
