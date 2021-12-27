import { STATUS_BAR_HEIGHT } from '@utils/functions'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { withNavigationFocus } from 'react-navigation'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { GamesListItem } from '../../../components'
import { BackIcon } from '../../../components/icons'
import { Container, Link } from '../../../components/main'
import { getProfileId, getToken } from '../../../modules/auth'
import { getMuted } from '../../../modules/main'
import {
  joinChallenge,
  likeCompletion,
  refreshFeed,
  setMuted,
} from '../../../modules/main/duck'
import * as Manager from '../../../modules/main/managers'
import { getParamFromUrl } from '../../../utils'
import MentionModal from '../feed/components/MentionModal'
import ReminderModal from '../feed/components/ReminderModal'
import { ContextMenu } from './components'

const BackButton = styled(Link)`
  position: absolute;
  top: ${STATUS_BAR_HEIGHT + 24}px;
  z-index: 999;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  left: 16px;
`

const ChallengeDetailed = ({
  isFocused,
  navigation: { state, navigate, push, goBack, popToTop },
}) => {
  const dispatch = useDispatch()
  // SELECTORS
  const token = useSelector(getToken)
  const myId = useSelector(getProfileId)
  const muted = useSelector(getMuted)
  // PURE
  const initialIndex = useMemo(() => state.params.index || 0, [])
  const direct = useMemo(() => state.params.direct || false, [])

  // STATE
  const [challenge, setChallenge] = useState(state.params.challenge)
  const [feed, setFeed] = useState(state.params.feed || [])
  const [pagination, setPagination] = useState(state.params.pagination || {})
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const [tapPaused, setTapPaused] = useState(false)

  const [mentionUsers, setMentionUsers] = useState(false)
  const [contextMenu, setContextMenu] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const [challengeSaved, setChallengeSaved] = useState(null)

  const [forceRerender, setForceRerender] = useState(0)

  // MEMO
  const completion = useMemo(() => feed[currentIndex], [currentIndex])

  const secondsToEnd = useMemo(
    () => moment(challenge.finishes_at).diff(moment(), 'seconds'),
    [challenge],
  )

  useEffect(() => {
    const accessToken = !challenge.public
      ? getParamFromUrl('token', challenge.access_url)
      : null
    Manager.getChallengeById(token, challenge.id, accessToken).then(
      setChallenge,
    )
    direct ? fetchFeed(1) : null
  }, [])

  const fetchFeed = useCallback((page = 1) => {
    Manager.challengeFeed(token, challenge.id, page).then((result) => {
      setPagination({
        hasMore: result.has_more,
        page: result.page,
      })
      setFeed([...feed, ...result.feed])
    })
  })

  const onPressUser = useCallback((user) => {
    if (myId && myId === user.id) {
      push('Profile')
    } else {
      push('AlienProfile', { user })
    }
  })

  const onRefresh = useCallback(() => {
    dispatch(refreshFeed())
  })

  const onPressLike = useCallback((gameCompletion, reaction) => {
    dispatch(likeCompletion({ gameCompletion, reaction }))
    setForceRerender(forceRerender + 1)
  })

  const onPressJoin = (game, fromCompletion) => {
    const joined = !!challenge.user_stats.joined_at
    const joinPaylaod = {
      challenge,
      id: challenge.id,
      fromCompletion,
      screen: 'detailed',
      joined,
      joinToken: challenge.public
        ? undefined
        : getParamFromUrl('token', challenge.access_url),
    }
    dispatch(joinChallenge(joinPaylaod))
    setChallenge({
      ...challenge,
      user_stats: {
        ...challenge.user_stats,
        joined_at: !challenge.user_stats.joined_at,
      },
    })
    if (!joined) setChallengeSaved(challenge)
  }

  return (
    <>
      <Container>
        <BackButton onPress={() => goBack()}>
          <BackIcon />
        </BackButton>
        {challenge.user ? (
          <GamesListItem
            initialIndex={currentIndex}
            game={challenge}
            forceRerender={forceRerender}
            paused={tapPaused}
            myId={myId}
            feed={feed}
            onChangeIndex={setCurrentIndex}
            secondsToEnd={secondsToEnd}
            currentChallenge={isFocused}
            muted={muted || !isFocused}
            onPressUser={onPressUser}
            onPressAuthor={() => onPressUser(challenge.user)}
            onPressMuted={() => dispatch(setMuted(!muted))}
            setTapPaused={setTapPaused}
            onPressDots={() => {
              setContextMenu(true)
            }}
            onPressLike={onPressLike}
            onPressJoin={(fromCompletion) => {
              onPressJoin(challenge, fromCompletion)
            }}
            onPressMention={setMentionUsers}
            onPressDoNow={(fromCompletion) => {
              popToTop()
              navigate('CameraChallenge', {
                challengeId: challenge.id,
                fromCompletion,
                screen: 'feed',
              })
            }}
            onPressInvite={() => {
              setShowInviteModal(true)
            }}
            onPressCompleteCount={() => {
              push('CompletionsTile', { challenge: challenge })
            }}
            onPressLikeAuthor={() => {
              navigate('ReactionsTile', { challenge, completion })
            }}
          />
        ) : null}
      </Container>

      {challenge && challenge.user ? (
        <>
          <ContextMenu
            myId={myId}
            game={challenge}
            gameCompletion={completion}
            onPressJoin={onPressJoin}
            onPressDeleteGame={onRefresh}
            onPressDeleteCompletion={onRefresh}
            showMenu={contextMenu}
            setShowMenu={setContextMenu}
            showInviteModal={showInviteModal}
            setShowInviteModal={setShowInviteModal}
          ></ContextMenu>

          <MentionModal
            isVisible={!!mentionUsers}
            myId={myId}
            users={mentionUsers}
            onPressUser={onPressUser}
            onPressClose={() => setMentionUsers(false)}
          />
          <ReminderModal
            isVisible={!!challengeSaved}
            challenge={challengeSaved}
            onPressSet={(time) => console.log(time)}
            onPressClose={() => {
              setChallengeSaved(false)
            }}
          />
        </>
      ) : null}
    </>
  )
}

export default withNavigationFocus(ChallengeDetailed)
