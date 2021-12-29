import { PrimaryButton } from '@components/buttons'
import Header from '@components/common/Header'
import { BackIcon, NotificationIcon } from '@components/icons'
import { getProfileId, getToken } from '@modules/auth'
import { getHasNotifications } from '@modules/main'
import * as Manager from '@modules/main/managers'
import CompletionsList from '@screens/main/challenge/CompletionsTile/CompletionsList'
import ReactionList from '@screens/main/challenge/ReactionsTile/ReactionList'
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Dimensions } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { useSelector } from 'react-redux'
import { StackActions } from 'react-navigation'
import { useNavigation, useIsFocused } from 'react-navigation-hooks'
import ActivityInformation from '@screens/main/feed/notifications/ActivityInformation'
import { handleErrors } from '../../../../../aspects'
import {
  Button,
  ButtonsBar,
  ButtonText,
  Description,
  Drawer,
  DrawerActive,
  EmptyState,
  IconWrapper,
  Title,
  Wrapper,
} from './atoms'
import Card from './Card'

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH / 3)
const MAX_TITLE_LENGTH = 20

enum View {
  Inspired = 'inspired',
  Reacted = 'reacted',
}

type Props = {
  onNotificationIconPress: () => void
  showTutorial:boolean
}

function ActiveGames({ onNotificationIconPress, showTutorial }: Props) {
  const carouselRef = useRef()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const hasNotifications = useSelector(getHasNotifications)
  const id = useSelector(getProfileId)
  const token = useSelector(getToken)

  const [loading, setLoading] = useState(true)
  const [closeInfo, setCloseInfo] = useState(false)
  const [activeGames, setActiveGames] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [view, setView] = useState(View.Inspired)
  const [drawerCollapsed, setDrawerCollapsed] = useState(true)

  const fetchActive = useCallback(() => {
    Manager.getActiveChallenges(token, id)
      .then(({ completions }) => {
        setLoading(false)
        setActiveGames([])
        setActiveGames(
          completions.filter(
            ({ challenge }) =>
              challenge.user.id === id || challenge.user.id !== id,
          ),
        )
      })
      .catch(handleErrors)
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchActive()
    }
  }, [isFocused])

  const onCreateGamePress = () =>
    navigation.dispatch(
      StackActions.push({ routeName: 'CameraCreateChallenge' }),
    )
  const onInspiredButtonPress = () => setView(View.Inspired)
  const onReactedButtonPress = () => setView(View.Reacted)

  const inspiredSelected = view === View.Inspired
  const reactedSelected = view === View.Reacted
  const noActiveGames = activeGames.length === 0 && !loading

  const expandDrawer = () => setDrawerCollapsed(false)
  const collapseDrawer = () => setDrawerCollapsed(true)

  const headerTitle = useMemo(() => {
    if (drawerCollapsed) {
      return 'games activity'
    }
    const { title } = activeGames[currentIndex]?.challenge
    return title.length > MAX_TITLE_LENGTH
      ? `${title.slice(0, MAX_TITLE_LENGTH)}...`
      : title
  }, [drawerCollapsed, activeGames])

  const initialChallenge = activeGames[currentIndex]?.challenge

  return (
    <Wrapper>
      <Header
        leftButton={
          drawerCollapsed
            ? undefined
            : {
                onPress: collapseDrawer,
                icon: BackIcon,
              }
        }
        title={headerTitle}
        rightButton={{
          onPress: onNotificationIconPress,
          icon: () => (
            <IconWrapper unreadNotifications={hasNotifications}>
              <NotificationIcon />
            </IconWrapper>
          ),
        }}
      />
      {noActiveGames && (
        <>
          <EmptyState />
          <Drawer>
            {closeInfo || showTutorial ? (
              <>
                <Title>No active games yet</Title>
                <Description>
                  Create games yourself and stay tuned here
                </Description>
                <PrimaryButton
                  full
                  onPress={onCreateGamePress}
                  text='CREATE GAME'
                />
              </>
            ) : (
              <ActivityInformation
                onClosePress={() => {
                  setCloseInfo(true)
                }}
              />
            )}
          </Drawer>
        </>
      )}

      {!noActiveGames && (
        <>
          <Carousel
            ref={carouselRef}
            layout='default'
            onSnapToItem={(index) => setCurrentIndex(index)}
            data={activeGames}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            renderItem={({ item, index }) => (
              <Card
                showCounter={
                  item.challenge.id === activeGames[currentIndex].challenge.id
                }
                media={item.media}
                onPress={
                  index === currentIndex
                    ? expandDrawer
                    : () => {
                        setCurrentIndex(index)
                        carouselRef.current.snapToItem(index)
                      }
                }
                endTime={item.challenge.finishes_at}
              />
            )}
          />
          <DrawerActive collapsed={drawerCollapsed}>
            <ButtonsBar>
              <Button
                selected={inspiredSelected}
                onPress={onInspiredButtonPress}
              >
                <ButtonText selected={inspiredSelected}>Inspired</ButtonText>
              </Button>
              <Button selected={reactedSelected} onPress={onReactedButtonPress}>
                <ButtonText selected={reactedSelected}>Reacted</ButtonText>
              </Button>
            </ButtonsBar>
            {inspiredSelected && (
              <CompletionsList activity initialChallenge={initialChallenge} />
            )}
            {reactedSelected && (
              <ReactionList activity initialChallenge={initialChallenge} />
            )}
          </DrawerActive>
        </>
      )}
    </Wrapper>
  )
}

export default ActiveGames
