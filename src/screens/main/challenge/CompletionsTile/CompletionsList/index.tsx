import * as R from 'ramda'
import { useSelector } from 'react-redux'
import { getToken } from '@modules/auth'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FeedItem, Challenge } from '@app-types/challenge'
import { getParamFromUrl } from '@utils/functions'
import * as Manager from '@modules/main/managers'
import { FeedResponse } from '@app-types/api/feed'
import { ListRenderItemInfo, RefreshControl } from 'react-native'
import InviteFriend from '@screens/main/challenge/CompletionsTile/InviteFriend'
import ListItem from '@screens/main/challenge/CompletionsTile/CompletionsList/ListItem'
import { Wrapper } from '@screens/CameraRollPicker/atoms'
import SectionList from '@components/common/SectionList'
import { Section } from '@components/common/SectionList/types'
import { withNavigationFocus } from 'react-navigation'
import { ListWrapper, SectionHeader, SectionHeaderTitle } from './atoms'
import { THEME } from '../../../../../const'

const sorter = R.sortBy(R.prop('position'))

type Props = {
  initialChallenge: Challenge
  fromCompletion?: Challenge
  navigation: any
  activity?: boolean
}

function CompletionsListDumb({
  navigation,
  initialChallenge,
  fromCompletion,
  activity = false,
}: Props) {
  const token = useSelector(getToken)

  const [feed, setFeed] = useState<FeedItem[]>([])
  const [pagination, setPagination] = useState({ hasMore: true, page: 1 })
  const [challenge, setChallenge] = useState(initialChallenge || {})

  const fetchFeed = useCallback(
    (page) => {
      Manager.challengeFeed(token, challenge.id, page).then(
        (response: FeedResponse) => {
          if (page === 1) {
            setFeed([])
            setFeed(sorter(response.feed))
          } else {
            setFeed((prevState) => sorter([...response.feed, ...prevState]))
          }
          setPagination({ hasMore: response.has_more, page: response.page })
        },
      )
    },
    [challenge],
  )

  const onRefresh = () => fetchFeed(1)

  useEffect(() => {
    if (initialChallenge) {
      const accessToken = !initialChallenge.public
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

  const onScrollToEnd = useCallback(
    ({ distanceFromEnd }) => {
      if (distanceFromEnd <= 0) return
      if (pagination.hasMore) {
        fetchFeed(pagination.page + 1)
      }
    },
    [feed.length, pagination.page],
  )

  const sections = useMemo(() => {
    return [
      {
        title: 'All inspired',
        data: [
          {
            key: 'All inspired',
            list: [
              { id: 0, invite: true },
              ...new Map(feed.map((item) => [item.id, item])).values(),
            ],
          },
        ],
      },
    ]
  }, [feed])

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FeedItem>) => {
      // @ts-ignore
      const showInviteButton = item.invite

      if (showInviteButton) {
        return <InviteFriend challenge={challenge} />
      }

      const currentCompletion = item.id === fromCompletion?.id
      const isAuthorChallenge = challenge.user.id === item.user.id
      const itemIndex = index - 1

      return (
        <ListItem
          key={item.id.toString()}
          username={item.user.username}
          name={item.user.name}
          avatarUrl={item.user.photo_url}
          media={item.media}
          position={item.position}
          isAuthor={isAuthorChallenge}
          currentCompletion={currentCompletion}
          onPress={() => {
            navigation.push('ChallengeDetailed', {
              challenge,
              index: itemIndex,
              feed,
            })
          }}
        />
      )
    },
    [challenge, feed],
  )

  const showList = feed.length !== 0

  return (
    <Wrapper>
      {showList && (
        <ListWrapper>
          <SectionList<FeedItem>
            keyExtractor={(item: FeedItem) => item.id.toString()}
            numColumns={3}
            containerStyle={{ paddingHorizontal: activity ? 0 : 15 }}
            contentContainerStyle={{ paddingTop: 15, paddingBottom: 100 }}
            sections={sections as unknown as Section<FeedItem>[]}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <SectionHeader>
                <SectionHeaderTitle>{section.title}</SectionHeaderTitle>
              </SectionHeader>
            )}
            renderItem={renderItem}
            onEndReached={onScrollToEnd}
            refreshControl={
              <RefreshControl
                tintColor={THEME.textColor}
                refreshing={false}
                onRefresh={onRefresh}
              />
            }
          />
        </ListWrapper>
      )}
    </Wrapper>
  )
}

const CompletionsList = withNavigationFocus(CompletionsListDumb)

export default CompletionsList
