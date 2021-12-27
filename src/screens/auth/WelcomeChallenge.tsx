import assetList from '@assets/assetList'
import { TutorialTooltip } from '@components/TutorialTooltip'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { withNavigationFocus } from 'react-navigation'
import { useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { OnboardingGame, TransparentHeader } from '../../components'
import { InfoModal, SwipeTutorial } from '../../components/BlurModalContainer'
import { Container } from '../../components/main'
import { HEIGHT_FEED_VIDEO } from '../../const'
import { getWelcomeChallenges } from '../../modules/auth'
import { keyExtractor, STATUS_BAR_HEIGHT, useAnalytics } from '../../utils'
import GetInviteStatus from './components/GetInviteStatus'

const HEIGHT_VIDEO = HEIGHT_FEED_VIDEO

const FeedItemContainer = styled.View`
  overflow: hidden;
  height: ${HEIGHT_VIDEO}px;
  border-radius: 35px;
  background-color: #ccc;
`

const GameFeedList = styled(FlatList)`
  height: ${HEIGHT_VIDEO}px;
  background-color: #000;
  border-radius: 35px;
`

const statusStyle = {
  height: STATUS_BAR_HEIGHT + 64,
  alignItems: 'flex-start',
  paddingTop: 24,
  backgroundColor: 'rgba(27, 29, 29, 0.95)',
  borderRadius: 40,
}

type Props = {
  isFocused: boolean
  navigation: any
}

const WelcomeChallengeDumb = ({
  isFocused,
  navigation: { navigate },
}: Props) => {
  const logEvent = useAnalytics()
  const challenges = useSelector(getWelcomeChallenges)
  const completed = useMemo(
    () => challenges.filter((x) => x.name === 'ME')[0],
    [challenges],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastViewedGameIndex, setLastViewedGameIndex] = useState(0)

  const [welcomeModal, setWelcomeModal] = useState(false)
  const [tutorialSwipe, setTutorialSwipe] = useState(false)
  const [filmModal, setFilmModal] = useState(false)
  const [statusInvite, setStatusInvite] = useState('warn')
  const [hintPlay, setHintPlay] = useState(false)

  const statusText = useMemo(
    () => (statusInvite === 'warn' ? 'Complete welcome game' : 'Play the game'),
    [statusInvite],
  )

  const scrollRef = useRef<any | null>(null)
  const visibleItem = useRef(({ viewableItems }: any) => {
    if (!viewableItems.length) return
    setCurrentIndex(viewableItems[0].index)
  })

  useEffect(() => {
    if (completed) setStatusInvite('success')
  }, [completed])

  useEffect(() => {
    setWelcomeModal(true)
  }, [])

  useEffect(() => {
    if (isFocused && completed) {
      setCurrentIndex(0)
      scrollRef.current &&
        scrollRef.current.scrollToOffset({ x: 0, animated: true })
    }
  }, [completed, isFocused])

  useEffect(() => {
    if (currentIndex > lastViewedGameIndex) {
      setLastViewedGameIndex(currentIndex)
    }
  }, [currentIndex])

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <OnboardingGame
        media={
          item.video_url ? { video_url: item.video_url } : { video: item.video }
        }
        author={{
          username: 'Happyō team',
          name: "Let's go",
          photo_url: '',
        }}
        game={{ title: 'Just smile for\n10 seconds' }}
        button={{
          light: true,
          containerStyle: { paddingHorizontal: 20 },
          text: completed ? 'NEXT' : 'PLAY',
          onPress: () => {
            setHintPlay(false)
            if (completed) navigate('FollowContacts')
            else setFilmModal(true)
          },
        }}
        play={isFocused && index === currentIndex}
      />
    ),
    [currentIndex, completed],
  )

  return (
    <>
      <Container>
        <TransparentHeader
          title={'WELCOME GAME'}
          rightButton={{
            onPress: () => {
              logEvent('Play on welcome game', {
                skip: !completed,
                lastGameNumber: lastViewedGameIndex,
              })
              navigate('FollowContacts')
            },
            text: completed ? 'Next' : 'Skip',
            textStyle: { color: completed ? '#FF6A16' : '#ccc' },
          }}
        />
        <FeedItemContainer>
          <GameFeedList
            ref={scrollRef}
            data={challenges}
            keyExtractor={keyExtractor}
            pagingEnabled={true}
            horizontal={true}
            scrollEventThrottle={20}
            onViewableItemsChanged={visibleItem.current}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />
        </FeedItemContainer>
        <GetInviteStatus
          containerStyle={statusStyle}
          text={statusText}
          status={statusInvite}
        />
      </Container>
      <InfoModal
        visible={welcomeModal}
        text={`Let's learn to play\nHappyō`}
        textInfo={
          'Take part in a welcome game to learn the mechanics. You will understand that it is\neasy and interesting'
        }
        buttonText={`I’m ready`}
        onPress={() => {
          setWelcomeModal(false)
          setTimeout(() => setTutorialSwipe(true), 500)
        }}
      />
      <InfoModal
        visible={filmModal}
        text={`What is the game of Happyō?`}
        textInfo={
          'Film a 10 seconds video of a real life action that boosts your mood ' +
          'right now and enjoy how many people will join you!\n\nBe a creator!'
        }
        image={assetList.logoTutorial}
        buttonText={`Let’s go`}
        onPress={() => {
          setFilmModal(false)
          navigate('CameraWelcomeChallenge')
        }}
      />

      <SwipeTutorial
        anim={assetList.swipeLeftAnim}
        text={'Swipe left'}
        textInfo={'to see other people playing\nthis game'}
        visible={tutorialSwipe}
        onPress={() => {
          setHintPlay(true)
          setTutorialSwipe(false)
        }}
      />

      {hintPlay ? (
        <TutorialTooltip
          text={'Click to take part'}
          positionArrow={{ left: '85%%' }}
          position={{ bottom: STATUS_BAR_HEIGHT + 128, right: '5%' }}
          onPressTooltip={() => {
            setHintPlay(false)
          }}
          onPressOk={() => {
            setHintPlay(false)
          }}
        />
      ) : null}
    </>
  )
}

const WelcomeChallenge = withNavigationFocus(WelcomeChallengeDumb)

export default WelcomeChallenge
