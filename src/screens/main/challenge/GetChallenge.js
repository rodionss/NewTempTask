import { BlurView } from '@react-native-community/blur'
import moment from 'moment'
import * as R from 'ramda'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-snap-carousel'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { handleErrors } from '../../../aspects/handleErrors'
import { Header } from '../../../components'
import { BlurModalContainer } from '../../../components/BlurModalContainer'
import { SearchIcon, TutorialShake } from '../../../components/icons'
import { HEIGHT_OLD_VIDEO } from '../../../const'
import { getToken } from '../../../modules/auth'
import { getMuted } from '../../../modules/main'
import { joinChallenge, selectUser, setMuted } from '../../../modules/main/duck'
import * as Manager from '../../../modules/main/managers'
import { DropdownService } from '../../../services'
import { useAnalytics } from '../../../utils'
import FeedItem from '../feed/components/FeedItem'
import ReminderModal from '../feed/components/ReminderModal'
import FeedInviteModal from '@screens/main/feed/components/FeedInviteModal'

const TAB_HEIGHT = 60

const { width } = Dimensions.get('window')

const ExploreContainer = styled.View`
  flex: 1;
  align-items: center;
  background-color: #000;
`

const blurStyle = {
  width,
  height: HEIGHT_OLD_VIDEO,
  borderRadius: 35,
}

const ThumbnailDemoContainer = styled.View`
  width: ${width}px;
  height: ${HEIGHT_OLD_VIDEO}px;
  border-radius: 35px;
`
const ThumbnailDemo = styled(FastImage)`
  position: absolute;
  width: ${width}px;
  height: ${HEIGHT_OLD_VIDEO}px;
  border-radius: 35;
`

const GetChallenge = ({
  navigation,
  token,
  joinChallenge,
  muted,
  setMuted,
  isFocused,
}) => {
  useAnalytics('Random screen seen', {}, true)
  const carousel = useRef(null)
  const [currentIndex, setExploreIndex] = useState(0)

  const [mockChallenges, setMockChallenges] = useState([])
  const [challenges, setChallenges] = useState([])
  const [challengeShare, setChallengeShare] = useState({})
  const [exploring, setExploring] = useState(false)

  const [tutorialVisible, setTutorialVisible] = useState(false)

  const [challengeSaved, setChallengeSaved] = useState(null)

  useEffect(() => {
    Manager.getMockImages().then(setMockChallenges)
  }, [])

  useEffect(() => {
    if (isFocused && !exploring) onPressShake()
  }, [isFocused])

  const onPressShake = useCallback(() => {
    carousel.current.startAutoplay(true)

    Manager.getRandChallenges(token)
      .then((challenges) => {
        setChallenges(challenges)
        setTutorialVisible(false)
        if (challenges.length) {
          setTimeout(() => {
            carousel.current.stopAutoplay()
            carousel.current.snapToItem(0)
            setExploring(true)
          }, 1500)
        } else {
          DropdownService.alert('error', 'No new games found')
          carousel.current.stopAutoplay()
          carousel.current.snapToItem(0)
        }
      })
      .catch(handleErrors)
  })

  const onPressJoin = useCallback((fromCompletion, challenge) => {
    const joined = !!challenge.user_stats.joined_at

    const joinPayload = {
      challenge,
      id: challenge.id,
      fromCompletion,
      screen: 'random',
      joined,
    }
    joinChallenge(joinPayload)
    if (!joined) {
      setChallengeSaved(challenge)
    }
    return joined
  }, [])

  const renderExploreItem = useCallback(({ item, index }) => {
    return !exploring && typeof item === 'string' ? (
      <ThumbnailDemoContainer>
        <ThumbnailDemo source={{ uri: item }}></ThumbnailDemo>
        <BlurView blurType='dark' blurAmount={10} style={blurStyle} />
      </ThumbnailDemoContainer>
    ) : (
      <FeedItem
        challengeId={item.id}
        finishesAt={item.finishes_at}
        title={item.title}
        muted={muted || !isFocused}
        horizontal={false}
        description={item.description}
        secondsToEnd={moment(item.finishes_at).diff(moment(), 'seconds')}
        feed={[{ media: item.media, user: item.user }]}
        completedCount={item.completed_count}
        authorAvatar={item.user.photo_url}
        authorName={item.user.name}
        heightOffset={0}
        authorMedia={item.media}
        onPressUser={() => {
          navigation.push('AlienProfile', { user: item.user })
        }}
        onPressMuted={() => setMuted(!muted)}
        onPressJoin={(fromCompletion) => onPressJoin(fromCompletion, item)}
        onPressDoNow={() => {
          navigation.push('CameraChallenge', {
            challengeId: item.id,
            screen: 'random',
          })
        }}
        onPressShare={() => setChallengeShare(item)}
        currentChallenge={isFocused && index === currentIndex}
      />
    )
  }, [])

  return (
    <>
      <Header
        title='RANDOM'
        leftButton={{
          icon: SearchIcon,
          onPress: () => navigation.navigate('Search'),
        }}
      />
      <ExploreContainer>
        <Carousel
          ref={carousel}
          data={exploring ? challenges : mockChallenges}
          layout={'stack'}
          scrollEnabled={exploring}
          snapToInterval={500}
          loop={false}
          vertical={true}
          autoplayDelay={0}
          autoplayInterval={500}
          onSnapToItem={setExploreIndex}
          renderItem={renderExploreItem}
          itemHeight={HEIGHT_OLD_VIDEO + 164}
          sliderHeight={HEIGHT_OLD_VIDEO - 144}
        />
      </ExploreContainer>

      <FeedInviteModal
        isVisible={challengeShare.id}
        challenge={challengeShare}
        onPressClose={() => setChallengeShare({})}
      />

      <BlurModalContainer
        visible={tutorialVisible}
        onPress={() => {
          setTutorialVisible(false)
        }}
      >
        <TutorialShake />
      </BlurModalContainer>
      <ReminderModal
        isVisible={!!challengeSaved}
        challenge={challengeSaved}
        onPressSet={(time) => console.log(time)}
        onPressClose={() => {
          setChallengeSaved(false)
        }}
      />
    </>
  )
}

export default R.compose(
  withNavigationFocus,
  connect(R.applySpec({ token: getToken, muted: getMuted }), {
    selectUser,
    joinChallenge,
    setMuted,
  }),
)(GetChallenge)
