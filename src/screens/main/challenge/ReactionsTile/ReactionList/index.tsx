import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { User, Challenge, FeedItem, Reaction } from '@app-types/challenge'
import { getParamFromUrl } from '@utils/functions'
import * as Manager from '@modules/main/managers'
import { FeedResponse, ReactionsResponse } from '@app-types/api/feed'
import { ReactionIcon } from '@components/Reactions'
import ListItem from '@screens/main/challenge/ReactionsTile/ReactionList/ListItem'
import { useDispatch, useSelector } from 'react-redux'
import { getToken } from '@modules/auth'
import { StackActions } from 'react-navigation'
import { useNavigation } from 'react-navigation-hooks'
import { RefreshControl } from 'react-native'
import {
  Description,
  Title,
} from '@screens/main/feed/notifications/ActiveGames/atoms'
import { PrimaryButton } from '@components/buttons'
import { setGlobalLoading } from '@modules/main'
import { getShareVideoOptions } from '@utils/VideoConverter'
import Share from 'react-native-share'
import { addWatermark } from '@utils/index'
import { REACTION_ALIAS, THEME } from '../../../../../const'
import {
  Counter,
  Label,
  ReactionsButton,
  ReactionsButtonContent,
  ReactionsContainer,
  List,
  StyledWrapper,
  EmptyStateWrapper,
} from './atoms'

const ITEMS_PER_ROW = 4

type Props = {
  initialChallenge: Challenge
  initialCompletion?: any
  activity?: boolean
}

function ReactionsList({
  initialChallenge,
  initialCompletion,
  activity = false,
}: Props) {
  const navigation = useNavigation()
  const token = useSelector(getToken)
  const dispatch = useDispatch()

  const [reactions, setReactions] = useState<User[]>([])
  const [pagination, setPagination] = useState({ hasMore: false, page: 1 })
  const [filter, setFilter] = useState('all')
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  const [challenge, setChallenge] = useState(initialChallenge || {})

  const navigateToAlienProfile = (user: User) =>
    navigation.dispatch(
      StackActions.push({ routeName: 'AlienProfile', params: { user } }),
    )

  useEffect(() => {
    if (initialChallenge) {
      const accessToken = !challenge.public
        ? getParamFromUrl('token', initialChallenge.access_url)
        : null
      Manager.getChallengeById(token, initialChallenge.id, accessToken).then(
        setChallenge,
      )
    }
  }, [initialChallenge])

  useEffect(() => {
    fetchFeed(1)
  }, [challenge])

  const fetchFeed = useCallback(
    (page = 1) => {
      Manager.challengeFeed(token, challenge.id, page).then(
        (response: FeedResponse) => {
          setPagination({
            hasMore: response.has_more,
            page: response.page,
          })
          if (page === 1) {
            setFeed(response.feed)
          } else {
            setFeed([...feed, ...response.feed])
          }
        },
      )
    },
    [challenge],
  )

  const completion = useMemo(() => {
    if (initialCompletion) {
      return initialCompletion
    }
    if (feed) {
      return feed.find(({ user }) => challenge.author.id === user.id)
    }
    return {}
  }, [challenge, feed])

  const fetchReactions = useCallback(
    (page = 1) => {
      if (completion) {
        Manager.participantsReactions(token, completion.id, page).then(
          (response: ReactionsResponse) => {
            setLoading(false)
            setPagination({
              hasMore: response.has_more,
              page: response.page,
            })
            const responseReactions = response.users
            if (page === 1) {
              setReactions([])
              setReactions(responseReactions)
            } else {
              setReactions([...reactions, ...responseReactions])
            }
          },
        )
      }
    },
    [completion],
  )

  const onPressShare = useCallback(() => {
    dispatch(setGlobalLoading(true))
    addWatermark(completion, challenge, (uri: string) => {
      getShareVideoOptions(
        uri,
        true,
        challenge.title.toUpperCase(),
        challenge.access_url,
      )
        .then(Share.open)
        .finally(() => {
          dispatch(setGlobalLoading(false))
        })
    })
  }, [challenge, completion])

  const onRefresh = () => fetchReactions(1)

  useEffect(() => {
    fetchReactions(1)
  }, [completion])

  const onScrollToEnd = useCallback(({ distanceFromEnd }) => {
    if (distanceFromEnd <= 0) return
    if (pagination.hasMore) fetchReactions(pagination.page + 1)
  }, [])

  const reactionsCount = useMemo(() => {
    const { reactions_count } = challenge

    const likeCount = reactions_count.like || 0
    const togetherCount = reactions_count.together || 0
    const wowCount = reactions_count.wow || 0
    const superCount = reactions_count.super || 0
    const lolCount = reactions_count.lol || 0
    const cuteCount = reactions_count.cute || 0
    const totalCount =
      likeCount + togetherCount + wowCount + superCount + lolCount + cuteCount

    return {
      all: totalCount,
      like: likeCount,
      together: togetherCount,
      wow: wowCount,
      super: superCount,
      cute: cuteCount,
      lol: lolCount,
    }
  }, [challenge])

  const reactionsBar = useMemo(() => {
    return Object.values(REACTION_ALIAS).map((reaction) => {
      const showLabel = reaction === REACTION_ALIAS.ALL
      const selected = reaction === filter

      return (
        <ReactionsButton
          key={reaction}
          selected={selected}
          onPress={() => setFilter(reaction)}
        >
          <ReactionsButtonContent>
            {showLabel ? (
              <Label>All</Label>
            ) : (
              <ReactionIcon reaction={reaction} size={20} />
            )}
            <Counter>{reactionsCount[reaction as Reaction]}</Counter>
          </ReactionsButtonContent>
        </ReactionsButton>
      )
    })
  }, [filter, reactionsCount])

  const noReactions = !loading && reactions.length === 0

  return (
    !loading && (
      <StyledWrapper>
        {noReactions ? (
          <EmptyStateWrapper activity={activity}>
            <Title>There are no reactions {'\n'} on this game yet</Title>
            <Description>
              Share your game with your friends {'\n'} to get great coverage
            </Description>
            <PrimaryButton full onPress={onPressShare} text='SHARE GAME' />
          </EmptyStateWrapper>
        ) : (
          <>
            <ReactionsContainer
              showsHorizontalScrollIndicator={false}
              activity={activity}
              horizontal
            >
              {reactionsBar}
            </ReactionsContainer>

            <List
              activity={activity}
              data={reactions}
              numColumns={ITEMS_PER_ROW}
              keyExtractor={(item: User) => item.id.toString()}
              renderItem={({ item }) => {
                const showReaction =
                  filter === REACTION_ALIAS.ALL ||
                  item.user_stats.reaction === filter

                return (
                  <ListItem
                    key={item.id.toString()}
                    avatarUrl={item.photo_url}
                    reaction={item.user_stats.reaction}
                    name={item.name}
                    username={item.username}
                    showReaction={showReaction}
                    onPress={() => navigateToAlienProfile(item)}
                  />
                )
              }}
              onEndReached={onScrollToEnd}
              refreshControl={
                <RefreshControl
                  tintColor={THEME.textColor}
                  refreshing={false}
                  onRefresh={onRefresh}
                />
              }
            />
          </>
        )}
      </StyledWrapper>
    )
  )
}

export default ReactionsList
