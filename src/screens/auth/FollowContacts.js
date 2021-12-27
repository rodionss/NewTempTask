import { TutorialTooltip } from '@components/TutorialTooltip'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { FlatList } from 'react-native'
import Contacts from 'react-native-contacts'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { handleErrors } from '../../aspects'
import { OnboardingGame, TransparentHeader } from '../../components'
import { Container } from '../../components/main'
import { HEIGHT_FEED_VIDEO } from '../../const'
import { getToken } from '../../modules/auth'
import * as Manager from '../../modules/main/managers'
import {
  keyExtractor,
  STATUS_BAR_HEIGHT,
  useAnalytics,
  withAmplitude,
} from '../../utils'
import GetInviteStatus from './components/GetInviteStatus'

const GameFeedList = styled(FlatList)`
  height: ${HEIGHT_FEED_VIDEO}px;
  background-color: #000;
  border-radius: 35px;
`
const FeedItemContainer = styled.View`
  overflow: hidden;
  height: ${HEIGHT_FEED_VIDEO}px;
  border-radius: 35px;
  background-color: #ccc;
`

const statusContainerStyle = {
  height: STATUS_BAR_HEIGHT + 64,
  alignItems: 'flex-start',
  paddingTop: 24,
  backgroundColor: 'rgba(27, 29, 29, 0.95)',
  borderRadius: 40,
}

const FollowContactsDumb = ({ navigation }) => {
  const logEvent = useAnalytics()
  const token = useSelector(getToken)

  const [featured, setFeatured] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleItem = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return
    setCurrentIndex(viewableItems[0].index)
  })
  const [statusInvite, setStatusInvite] = useState('warn')
  const [goalInvite, setGoalInvite] = useState(0)
  const [skipButton, setSkipButton] = useState(0)

  const statusText = useMemo(
    () =>
      statusInvite === 'warn' ? `Follow ${goalInvite}/5` : `Play the life`,
    [statusInvite, goalInvite],
  )

  useEffect(() => {
    Contacts.getAll()
      .then((contacts) => {
        const arrayPhones = contacts.map(
          (contact) =>
            contact.phoneNumbers &&
            contact.phoneNumbers.length &&
            contact.phoneNumbers[0].number,
        )
        Manager.sendContacts(token, { contacts: arrayPhones })
          .then(({ featured }) => {
            setFeatured(featured.filter((x) => x.top_challenge))
            logEvent('Contact list permission', { enable: true })
          })
          .catch(handleErrors)
      })
      .catch(() => {
        logEvent('Contact list permission', { enable: false })
        onPressNext()
      })
      .finally(() => {
        setTimeout(() => {
          setSkipButton(true)
        }, 1000)
      })
  }, [])

  useEffect(() => {
    setStatusInvite(goalInvite >= 5 ? 'success' : 'warn')
  }, [goalInvite])

  const localManageFollowUser = useCallback((list, item, follow) => {
    setGoalInvite(follow ? goalInvite - 1 : goalInvite + 1)
    const newUsers = list.reduce((acc, user) => {
      if (user.id === item.id)
        user.user_stats.follow_state = follow ? 'none' : 'follow'
      return [...acc, user]
    }, [])
    return newUsers
  })

  const onPressNext = useCallback(() => {
    navigation.navigate('Feed')
  })

  const onPressFollow = useCallback((item) => {
    const follow = item.user_stats.follow_state === 'follow'
    setFeatured(localManageFollowUser(featured, item, follow))
    if (follow) {
      Manager.unfollow(token, item.id).catch(handleErrors)
    } else {
      logEvent('Follow on user', { screen: 'registration' })
      Manager.follow(token, item.id).catch(handleErrors)
    }
  })

  const renderItem = useCallback(
    ({ item, index }) => {
      const follow = item.user_stats.follow_state === 'follow'
      return (
        <OnboardingGame
          media={item.top_challenge.media}
          play={index === currentIndex}
          authorPhotoSize={40}
          author={item}
          button={{
            text: follow ? 'Unfollow' : 'Follow',
            light: !follow,
            containerStyle: { paddingHorizontal: 16 },
            onPress: () => onPressFollow(item),
          }}
        />
      )
    },
    [featured, currentIndex],
  )

  return (
    <Container>
      <TransparentHeader
        title={'Find Friends'}
        rightButton={
          skipButton
            ? {
                text: goalInvite >= 5 ? 'NEXT' : 'SKIP',
                textStyle: goalInvite >= 5 ? { color: '#de6734' } : {},
                onPress: onPressNext,
              }
            : null
        }
      />
      <FeedItemContainer>
        <GameFeedList
          data={featured}
          keyExtractor={keyExtractor}
          pagingEnabled={true}
          horizontal={true}
          scrollEventThrottle={20}
          onViewableItemsChanged={visibleItem.current}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
        />
      </FeedItemContainer>
      <GetInviteStatus
        containerStyle={statusContainerStyle}
        text={statusText}
        status={statusInvite}
      />
    </Container>
  )
}
const FollowContacts = withAmplitude('Follow contacts screen shown')(
  FollowContactsDumb,
)

export default FollowContacts
