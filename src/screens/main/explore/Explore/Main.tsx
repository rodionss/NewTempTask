import GameTileItem from '@components/GameTileItem'
import PosibleFriendList from '@components/PosibleFriendList'
import { fetchExploreData, followIntrestingPeople } from '@modules/main/duck'
import {
  getInterestingUsers,
  getIsLoadingExplore,
  getPopularGames,
  getRandomGames,
  getTopics,
} from '@modules/main/selectors'
import { keyExtractor } from '@utils/functions'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshControl, ViewToken } from 'react-native'
import { ScrollView, withNavigationFocus } from 'react-navigation'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { TAB_HEIGHT } from '../../../../const'
import {
  BlockHeader,
  Dots,
  EmptyMessage,
  HorizontalList,
  IntrestingPeopleList,
  Separator,
  Topic,
} from './atoms'

const ScrollContainer = styled(ScrollView).attrs({
  contentContainerStyle: { paddingBottom: TAB_HEIGHT },
})``

const HorizontalPagingList = styled(HorizontalList).attrs({
  pagingEnabled: true,
  contentContainerStyle: { paddingHorizontal: 0 },
})``

const HorizontalIntrestingPagingScrollView = styled(HorizontalPagingList)`
  border-bottom-width: 0;
`

type Props = {
  navigation: any
  isFocused?: boolean
}

const ExploreMain = ({ navigation, isFocused }: Props) => {
  const dispatch = useDispatch()

  const isLoading = useSelector(getIsLoadingExplore)
  const topics = useSelector(getTopics)
  // const featuredGames = useSelector(getFeaturesGames)
  const randomGames = useSelector(getRandomGames)
  const popularGames = useSelector(getPopularGames)
  const intrestingUsers = useSelector(getInterestingUsers)

  const [activeIndex, setActiveIndex] = useState(0)
  const visibleIntrestingItems = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setActiveIndex(viewableItems[0].index)
    },
  )

  const renderGame = useCallback(
    ({ item }) => (
      <GameTileItem
        item={item}
        containerStyle={{ marginHorizontal: 4 }}
        onPress={() => {
          navigation.navigate('ChallengeDetailed', {
            direct: true,
            challenge: item,
          })
        }}
      />
    ),
    [],
  )

  const renderIntrestingPeopleItem = useCallback(({ item }: any) => {
    return (
      <IntrestingPeopleList
        title={item.title}
        users={item.users}
        emptyMessage={item.emptyMessage}
        onPressButton={(user) => {
          dispatch(followIntrestingPeople({ ...user, key: item.key }))
        }}
        onPress={(user) => navigation.push('AlienProfile', { user })}
      />
    )
  }, [])

  return (
    <ScrollContainer
      refreshControl={
        <RefreshControl
          tintColor={'#fff'}
          refreshing={isLoading}
          onRefresh={() => {
            dispatch(fetchExploreData())
          }}
        />
      }
    >
      {topics.length ? (
        <HorizontalPagingList
          data={topics}
          keyExtractor={keyExtractor}
          renderItem={({ item }: any) => (
            <Topic
              title={item.title}
              image={item.thumbnail_url}
              onPress={() => navigation.navigate('AllGamesList', { item })}
            />
          )}
        />
      ) : null}
      <BlockHeader title={'Random'} button={undefined} />
      <HorizontalList
        data={randomGames}
        keyExtractor={keyExtractor}
        renderItem={renderGame}
        ListEmptyComponent={<EmptyMessage>No game today</EmptyMessage>}
      />
      <BlockHeader title={'You may know'} />
      <PosibleFriendList navigation={navigation} />
      <Separator />
      <BlockHeader title={'Popular'} button={undefined} />
      <HorizontalList
        data={popularGames}
        keyExtractor={keyExtractor}
        renderItem={renderGame}
        ListEmptyComponent={<EmptyMessage>No popular game today</EmptyMessage>}
      />
      <BlockHeader title={'Interesting people'} />
      <HorizontalIntrestingPagingScrollView
        data={[
          {
            key: 'new',
            title: 'New to Happyō',
            users: R.slice(0, 5, intrestingUsers.new),
            emptyMessage: 'No new people today',
          },
          {
            key: 'featured',
            title: 'Celebrity',
            users: intrestingUsers.featured,
          },
        ]}
        keyExtractor={keyExtractor}
        onViewableItemsChanged={visibleIntrestingItems.current}
        renderItem={renderIntrestingPeopleItem}
      />

      <Dots count={2} activeIndex={activeIndex} />
      <Separator style={{ marginTop: 16, marginBottom: 16 }} />
    </ScrollContainer>
  )
}

export default withNavigationFocus(ExploreMain)
