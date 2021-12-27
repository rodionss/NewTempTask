import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { render } from 'react-dom'
import { Dimensions, ImageBackground } from 'react-native'
import FastImage from 'react-native-fast-image'
import { FlatList } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { assetList } from '../../assets'
import { OnboardingButton } from '../../components/buttons'
import {
  DoLabel,
  FilmLabel,
  PlayLabel,
  SecondsLabel,
  SwipeArrow,
  TenSecondsLabel,
  WelcomeLabel,
} from '../../components/icons'
import { Container, Link, Text } from '../../components/main'
import { STATUS_BAR_HEIGHT, keyExtractor, useAnalytics } from '../../utils'

const { height } = Dimensions.get('window')

const OnboardingContainer = styled(Container)``

const ButtonContainer = styled.View`
  position: absolute;
  width: 95%;
  align-self: center;
  align-items: center;
  margin-top: auto;
  bottom: 50px;
`

const SwipeUpContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 44px;
  height: 74px;
  align-items: center;
  justify-content: center;
`

const SkipButton = styled(Link)`
  position: absolute;
  top: ${STATUS_BAR_HEIGHT + 8}px;
  left: 20px;
  z-index: 9999;
  height: 32px;
  align-items: center;
  justify-content: center;
`

const SkipText = styled(Text)`
  font-size: 16px;
  align-items: center;
  color: #919191;
`

const Background = styled(ImageBackground)`
  top: 0;
  right: 0;
  width: 100%;
  height: ${height}px;
  align-items: center;
  z-index: 999;
  justify-content: center;
`

const InfoContainer = styled.View`
  position: absolute;
  left: 0;
  z-index: 999;
  bottom: ${STATUS_BAR_HEIGHT + 144}px;
`

const Label = styled(FastImage).attrs({
  resizeMode: 'contain',
})``

const InfoText = styled(Text)`
  font-size: 16px;
  line-height: 29px;
  color: #ffffff;
  padding: 0 20px;
  margin-top: 16px;
`

const contentData = [
  {
    labelImage: <WelcomeLabel />,
    text: `Welcome to Happyō, you’re the one we’ve been waiting for!\n\nWe are united by the idea to make our World a better place! Together. Every day`,
    backgroundImage: assetList.onboaringWelcome,
  },
  {
    labelImage: <DoLabel />,
    text: `Do simple actions in real life to unveil your true self and feel happier!`,
    backgroundImage: assetList.onboaringDo,
  },
  {
    labelImage: <FilmLabel />,
    text: `Film short videos to share your actions and inspire others!`,
    backgroundImage: assetList.onboaringFilm,
  },
  {
    labelImage: <TenSecondsLabel />,
    text: '10 seconds daily and the World around changes, at least yours!',
    backgroundImage: assetList.onboaringTenSeconds,
  },
  {
    labelImage: <PlayLabel />,
    text: 'Play your life, create, repeat and pass on! Let the game begin!',
    backgroundImage: assetList.onboaringPlay,
  },
]

const OnboardingDumb = ({ navigation }) => {
  const logEvent = useAnalytics()
  const scrollRef = useRef(null)
  const visibleItem = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return
    setCurrentIndex(viewableItems[0].index)
  })

  const [skipped, setSkipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastViewedPage, setLastViewedPage] = useState(0)

  const lastPage = useMemo(
    () => currentIndex === contentData.length - 1,
    [currentIndex],
  )

  useEffect(() => {
    if (currentIndex > lastViewedPage) {
      setLastViewedPage(currentIndex)
    }
    if (currentIndex === contentData.length - 1 && !skipped) {
      logEvent('Onboarding', {
        skip: false,
        lastScreenNumber: contentData.length - 1,
      })
    }
  }, [currentIndex])

  const renderPage = useCallback(({ item }) => (
    <Background source={item.backgroundImage}>
      <InfoContainer top={item.top}>
        {item.labelImage}
        <InfoText>{item.text}</InfoText>
      </InfoContainer>
    </Background>
  ))

  return (
    <OnboardingContainer>
      <SkipButton
        onPress={() => {
          if (lastPage) {
            scrollRef.current.scrollToOffset({ y: 0 })
          } else {
            setSkipped(true)
            logEvent('Onboarding', {
              skip: true,
              lastScreenNumber: lastViewedPage,
            })
            scrollRef.current.scrollToEnd()
          }
        }}
      >
        <SkipText>{lastPage ? 'Up' : 'Skip'}</SkipText>
      </SkipButton>

      <FlatList
        data={contentData}
        ref={scrollRef}
        pagingEnabled={!lastPage}
        scrollEnabled={!lastPage}
        keyExtractor={keyExtractor}
        renderItem={renderPage}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={visibleItem.current}
      />
      {lastPage ? (
        <ButtonContainer>
          <OnboardingButton
            full
            light={true}
            text={'CREATE PROFILE'}
            onPress={() => {
              navigation.navigate('ProfileRegistration')
              logEvent('Press on create profile')
            }}
          />
        </ButtonContainer>
      ) : (
        <SwipeUpContainer pointerEvents={'none'}>
          <SwipeArrow step={currentIndex + 1} />
        </SwipeUpContainer>
      )}
    </OnboardingContainer>
  )
}

const Onboarding = OnboardingDumb

export default Onboarding
