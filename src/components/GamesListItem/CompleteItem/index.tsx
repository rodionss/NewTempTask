import { Reaction } from '@app-types/challenge'
import { IconButton } from '@components/buttons'
import Avatar, { AvatarSize } from '@components/common/atoms/Avatar'
import { SmallStarIcon } from '@components/icons'
import Player from '@components/Player'
import Reactions, { ReactionIcon } from '@components/Reactions'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import {
  ActionButtonContainer,
  AuthorIndicator,
  AuthorName,
  CompletedAuthorContainer,
  CompletedAuthorInspired,
  CompleteAvatarWrapper,
  Container,
  DotsContainer,
  DotsMenu,
  InviteFriend,
  InviteFriendIcon,
  AuthorInfo,
} from './atoms'

type Props = {
  isMyGame: boolean
  play: any
  position: any
  muted: any
  avatarUrl: any
  reaction: any
  completedAt: any
  paused: any
  onPressLike: any
  onPressCreator: any
  onPressDots: any
  onViewVideo: any
  isAuthorGame: any
  preload: any
  executorAvatars: any
  onPressUser: any
  setTapPaused: any
  onPressMuted: any
  authorName: any
  completedCount: any
  media: any
  closePopup: () => void
  onPressCompleteCount: () => void
  onPressLikeAuthor: () => void
  completedByMe: boolean
  showReactionsIcon?: boolean
}

const DELAY_LONG_TAP = 300
const DELAY_DOUBLE_TAP = 400

function CompleteItem({
  play,
  position,
  muted,
  avatarUrl,
  reaction,
  completedAt,
  paused,
  onPressLike,
  onPressDots,
  onViewVideo,
  closePopup = () => {},
  isAuthorGame,
  preload,
  executorAvatars = [],
  onPressUser,
  setTapPaused,
  onPressMuted,
  authorName,
  completedCount,
  media,
  onPressCompleteCount,
  onPressLikeAuthor,
  completedByMe,
  showReactionsIcon = true,
}: Props) {
  const pauseTimer = useRef<number>(0)
  const oneTapTimeput = useRef<number>(0)
  const tapTime = useRef<number>(0)
  const reactionButton = useRef(null)

  const [visibleReaction, setVisibleReaction] = useState(false)

  const avatars = useMemo(() => {
    if (executorAvatars.length === 2) {
      return (
        <>
          <CompleteAvatarWrapper first>
            <Avatar uri={executorAvatars[0]} />
          </CompleteAvatarWrapper>
          <CompleteAvatarWrapper>
            <Avatar uri={executorAvatars[1]} />
          </CompleteAvatarWrapper>
        </>
      )
    }
    return (
      <>
        <InviteFriend>
          <InviteFriendIcon />
        </InviteFriend>
        <CompleteAvatarWrapper>
          <Avatar uri={executorAvatars[0]} />
        </CompleteAvatarWrapper>
      </>
    )
  }, [executorAvatars])

  const onPress = useCallback(() => {
    if (visibleReaction || closePopup()) {
      reactionButton.current.reset()
      setVisibleReaction(false)
      return
    }
    if (+new Date() - tapTime.current < DELAY_DOUBLE_TAP) {
      // DOUBLE TAP
      tapTime.current = 0
      clearTimeout(oneTapTimeput.current)
      onPressLike(reaction || Reaction.Like)
    } else {
      // SINGLE TAP
      tapTime.current = +new Date()
      oneTapTimeput.current = setTimeout(() => {
        !paused && onPressMuted()
      }, DELAY_DOUBLE_TAP)
    }
  }, [
    tapTime.current,
    pauseTimer.current,
    oneTapTimeput.current,
    visibleReaction,
    paused,
    muted,
    closePopup,
  ])

  return (
    <Container
      onPress={onPress}
      onPressIn={() => {
        pauseTimer.current = setTimeout(
          () => setTapPaused(true),
          DELAY_LONG_TAP,
        )
      }}
      onPressOut={() => {
        setTapPaused(false)
        clearTimeout(pauseTimer.current)
      }}
    >
      <DotsContainer onPress={onPressDots}>
        <DotsMenu />
      </DotsContainer>
      {paused ? null : (
        <ActionButtonContainer>
          {completedCount > 0 ? (
            <IconButton
              style={{ marginTop: 12 }}
              text={`${completedCount}`}
              onPress={onPressCompleteCount}
            >
              {avatars}
            </IconButton>
          ) : null}
          {showReactionsIcon && (
            <IconButton
              icon={
                visibleReaction ? null : (
                  <ReactionIcon size={32} reaction={reaction} />
                )
              }
              style={{ marginTop: 12 }}
              onPress={
                completedByMe
                  ? onPressLikeAuthor
                  : () => onPressLike(reaction ? null : Reaction.Like)
              }
              onLongPress={
                completedByMe
                  ? null
                  : () => {
                      reactionButton.current.animateButton()
                      setVisibleReaction(true)
                    }
              }
            />
          )}

          <Reactions
            refButton={reactionButton}
            onPress={(reaction) => {
              onPressLike(reaction)
              setVisibleReaction(false)
            }}
          />
        </ActionButtonContainer>
      )}
      <CompletedAuthorContainer onPress={onPressUser}>
        <Avatar uri={avatarUrl} size={AvatarSize.M} />
        <AuthorInfo>
          <AuthorName>
            {authorName} #{position}
          </AuthorName>
          <CompletedAuthorInspired>{completedAt}</CompletedAuthorInspired>
        </AuthorInfo>
        {isAuthorGame ? (
          <AuthorIndicator>
            <SmallStarIcon />
          </AuthorIndicator>
        ) : null}
      </CompletedAuthorContainer>
      <Player
        media={media}
        muted={muted}
        play={play}
        preload={preload}
        paused={paused}
        onViewVideo={onViewVideo}
      />
    </Container>
  )
}

export default memo(CompleteItem)
